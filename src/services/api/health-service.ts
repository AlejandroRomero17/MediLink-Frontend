// src/services/api/health-service.ts
import { apiClient } from "@/lib/api/client";

export const healthService = {
  async checkHealth() {
    try {
      // ⭐ CORRECCIÓN: apiClient.get ya devuelve los datos directamente
      const response = await apiClient.get<{ message: string }>("/health");
      return response;
    } catch (error) {
      console.error("Error checking API health:", error);
      throw error;
    }
  },
};
