// src/services/auth-service.ts
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/config/env";
import { UsuarioLogin, UsuarioResponse, Token } from "@/types/api.types";
import { JWTPayload } from "@/types/jwt.types";
import {
  PatientRegisterData,
  DoctorRegisterData,
  LegacyRegisterData,
} from "@/types/auth.types";

export const authService = {
  /**
   * Register a new patient (REGISTRO COMBINADO - RECOMENDADO)
   */
  async registerPatient(data: PatientRegisterData): Promise<Token> {
    const response = await apiClient.post<Token>(
      API_ENDPOINTS.REGISTRO.PACIENTE,
      data
    );

    if (response.access_token) {
      apiClient.saveAuthData(response.access_token);
      this.setCurrentUser(response.usuario);
    }

    return response;
  },

  /**
   * Register a new doctor (REGISTRO COMBINADO - CORREGIDO) ✅
   */
  async registerDoctor(data: DoctorRegisterData): Promise<Token> {
    console.log("🔵 [auth-service] Datos recibidos:", data);
    console.log(
      "🟢 [auth-service] Enviando a API:",
      JSON.stringify(data, null, 2)
    );

    // ✅ Enviar los datos exactamente como vienen
    const response = await apiClient.post<Token>(
      API_ENDPOINTS.REGISTRO.DOCTOR,
      data
    );

    console.log("✅ [auth-service] Respuesta recibida:", response);

    if (response.access_token) {
      apiClient.saveAuthData(response.access_token);
      this.setCurrentUser(response.usuario);
    }

    return response;
  },

  /**
   * Legacy register (solo crea usuario, NO PERFIL)
   */
  async registerLegacy(data: LegacyRegisterData): Promise<Token> {
    const response = await apiClient.post<Token>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    if (response.access_token) {
      apiClient.saveAuthData(response.access_token);
      this.setCurrentUser(response.usuario);
    }

    return response;
  },

  /**
   * Login user (returns Token with JWT and usuario)
   */
  async login(credentials: UsuarioLogin): Promise<Token> {
    const response = await apiClient.post<Token>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.access_token) {
      apiClient.saveAuthData(response.access_token);
      this.setCurrentUser(response.usuario);
    }

    return response;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<UsuarioResponse> {
    return await apiClient.get<UsuarioResponse>(
      API_ENDPOINTS.AUTH.GET_USER(userId.toString())
    );
  },

  /**
   * Get current user from API (using token)
   */
  async getCurrentUserFromAPI(): Promise<UsuarioResponse> {
    return await apiClient.get<UsuarioResponse>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Logout user
   */
  logout(): void {
    apiClient.clearAuthData();
    if (typeof window !== "undefined") {
      localStorage.removeItem("current_user");
    }
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
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      if (!payload) return false;
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  /**
   * Decode JWT token safely and typed
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;
      return payload;
    } catch {
      return null;
    }
  },
};
