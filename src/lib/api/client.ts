// src/lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { ENV } from "@/lib/config/env";
import { ApiError } from "@/types";

// ⭐ Tipo para los errores de validación de FastAPI
interface ValidationErrorDetail {
  loc?: (string | number)[]; // ⭐ Cambiado para coincidir con ValidationError
  msg: string;
  type?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    console.log("🚀 Inicializando ApiClient para:", ENV.API_URL);

    if (!ENV.API_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL no está configurado. Revisa tus variables de entorno."
      );
    }

    this.client = axios.create({
      baseURL: ENV.API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 45000,
      withCredentials: false,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (process.env.NODE_ENV === "development") {
            console.log(
              `🔐 Token agregado a: ${config.method?.toUpperCase()} ${
                config.url
              }`
            );
          }
        }
        return config;
      },
      (error) => {
        console.error("❌ Error en interceptor de request:", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `✅ ${response.status} ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`
          );
        }
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const url = error.config?.url || "unknown";
        const method = error.config?.method?.toUpperCase() || "UNKNOWN";
        const status = error.response?.status;

        console.error(`❌ ${status || "NETWORK"} ${method} ${url}`);

        if (error.code === "ECONNABORTED") {
          console.error(
            "⏱️  Timeout: El servidor está tardando demasiado en responder"
          );
          return Promise.reject(
            new Error(
              "El servidor está tardando demasiado en responder. Intenta nuevamente."
            )
          );
        }

        if (!error.response) {
          console.error("🌐 Network Error: Verifica tu conexión a internet");
          return Promise.reject(
            new Error(
              "No se pudo conectar con el servidor. Verifica tu conexión."
            )
          );
        }

        if (status === 401) {
          console.warn("🔓 Sesión expirada o no autorizada");
          this.clearToken();
          if (typeof window !== "undefined") {
            setTimeout(() => {
              if (window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
            }, 100);
          }
        }

        if (status === 429) {
          console.warn("🚦 Rate limit excedido");
          return Promise.reject(
            new Error("Demasiadas solicitudes. Por favor, espera un momento.")
          );
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response) {
      const { data, status } = error.response;

      // ⭐ FastAPI validation errors (array) - CON TIPADO CORRECTO
      if (data?.detail && Array.isArray(data.detail)) {
        const messages = data.detail
          .map(
            (err: ValidationErrorDetail) =>
              `${err.loc?.[err.loc.length - 1]}: ${err.msg}`
          )
          .join(", ");
        return new Error(messages);
      }

      // Single error message
      if (data?.detail && typeof data.detail === "string") {
        return new Error(data.detail);
      }

      // Status-based messages
      if (status === 404) {
        return new Error("Recurso no encontrado");
      }
      if (status === 500) {
        return new Error("Error interno del servidor");
      }
      if (status === 502 || status === 503 || status === 504) {
        return new Error("Servicio temporalmente no disponible");
      }

      // ⭐ Manejar detail cuando no es string ni array
      const detailMessage =
        typeof data?.detail === "string"
          ? data.detail
          : `Error del servidor (${status})`;

      return new Error(detailMessage);
    } else if (error.request) {
      return new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
    } else {
      return new Error(error.message || "Error desconocido");
    }
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  private clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("current_user");
      sessionStorage.clear();
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  saveAuthData(token: string): void {
    this.setToken(token);
    console.log("🔐 Token guardado en cliente API");
  }

  clearAuthData(): void {
    this.clearToken();
    console.log("🔓 Token eliminado del cliente API");
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get("/health", { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
