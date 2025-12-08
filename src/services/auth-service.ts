// src/services/auth-service.ts
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/config/env";
import {
  UsuarioLogin,
  UsuarioResponse,
  Token,
  getErrorMessage,
} from "@/types/api.types";
import { JWTPayload } from "@/types/jwt.types";
import { PatientRegisterData, DoctorRegisterData } from "@/types/auth.types";

// Helper para manejar cookies - PRODUCCIÓN
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const isHttps = window.location.protocol === "https:";
  const secureFlag = isHttps ? ";Secure" : "";
  const sameSite = isHttps ? "None" : "Lax";

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=${sameSite}${secureFlag}`;

  if (process.env.NODE_ENV === "development") {
    console.log(
      `🍪 Cookie '${name}' configurada - HTTPS: ${isHttps}, SameSite: ${sameSite}`
    );
  }
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;

  const isHttps = window.location.protocol === "https:";
  const secureFlag = isHttps ? ";Secure" : "";
  const sameSite = isHttps ? "None" : "Lax";

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=${sameSite}${secureFlag}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`🗑️ Cookie '${name}' eliminada`);
  }
};

export const authService = {
  /**
   * Register a new patient
   */
  async registerPatient(data: PatientRegisterData): Promise<Token> {
    console.log("📋 Registrando paciente...");

    try {
      const response = await apiClient.post<Token>(
        API_ENDPOINTS.REGISTRO.PACIENTE,
        data
      );

      if (response.access_token) {
        this.saveAuthToken(response.access_token);
        this.setCurrentUser(response.usuario);
        console.log("✅ Paciente registrado exitosamente");
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("❌ Error en registro de paciente:", errorMessage);
      throw error;
    }
  },

  /**
   * Register a new doctor
   */
  async registerDoctor(data: DoctorRegisterData): Promise<Token> {
    console.log("🔵 Registrando doctor...");

    try {
      const response = await apiClient.post<Token>(
        API_ENDPOINTS.REGISTRO.DOCTOR,
        data
      );

      console.log("✅ Doctor registrado:", response);

      if (response.access_token) {
        this.saveAuthToken(response.access_token);
        this.setCurrentUser(response.usuario);
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("❌ Error en registro de doctor:", errorMessage);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(credentials: UsuarioLogin): Promise<Token> {
    console.log("🔵 Iniciando sesión...");

    try {
      const response = await apiClient.post<Token>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log("✅ Sesión iniciada");

      if (response.access_token) {
        this.saveAuthToken(response.access_token);
        this.setCurrentUser(response.usuario);

        if (process.env.NODE_ENV === "development") {
          console.log("👤 Tipo de usuario:", response.usuario.tipo_usuario);
        }
      }

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("❌ Error en login:", errorMessage);
      throw error;
    }
  },

  /**
   * Save auth token
   */
  saveAuthToken(token: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("access_token", token);
    setCookie("access_token", token, 7);
    apiClient.saveAuthData(token);

    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Token almacenado en localStorage y cookie");
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UsuarioResponse> {
    try {
      return await apiClient.get<UsuarioResponse>(
        API_ENDPOINTS.AUTH.GET_USER(userId)
      );
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("❌ Error obteniendo usuario por ID:", errorMessage);
      throw error;
    }
  },

  /**
   * Get current user from API
   */
  async getCurrentUserFromAPI(): Promise<UsuarioResponse> {
    try {
      const user = await apiClient.get<UsuarioResponse>(API_ENDPOINTS.AUTH.ME);
      this.setCurrentUser(user);
      return user;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("❌ Error obteniendo usuario actual:", errorMessage);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    apiClient.clearAuthData();
    deleteCookie("access_token");

    if (typeof window !== "undefined") {
      localStorage.removeItem("current_user");
      localStorage.removeItem("access_token");
      sessionStorage.clear();
    }

    console.log("🚪 Sesión cerrada");
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): UsuarioResponse | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("current_user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Set current user in localStorage
   */
  setCurrentUser(user: UsuarioResponse): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("current_user", JSON.stringify(user));
      if (process.env.NODE_ENV === "development") {
        console.log("👤 Usuario guardado en localStorage:", user.email);
      }
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = this.getToken();
    if (!token) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 No hay token encontrado");
      }
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload) {
        if (process.env.NODE_ENV === "development") {
          console.log("🔍 Token inválido o no decodificable");
        }
        return false;
      }

      const isExpired = Date.now() >= payload.exp * 1000;
      if (isExpired) {
        if (process.env.NODE_ENV === "development") {
          console.log("🔍 Token expirado");
        }
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Error decodificando token:", error);
      return false;
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    const localStorageToken = localStorage.getItem("access_token");
    if (localStorageToken) return localStorageToken;

    return getCookie("access_token");
  },

  /**
   * Decode JWT token
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64)) as JWTPayload;
      return payload;
    } catch (error) {
      console.error("❌ Error decodificando token:", error);
      return null;
    }
  },

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
