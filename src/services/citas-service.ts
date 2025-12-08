// src/services/citas-service.ts
import { apiClient } from "@/lib/api/client";

export interface CitaCreate {
  doctor_id: number;
  fecha_hora: string; // ISO string
  motivo: string;
  sintomas?: string;
  notas_paciente?: string;
  es_videollamada?: boolean;
}

export interface CitaCancelar {
  motivo_cancelacion: string;
}

export interface Cita {
  id: number;
  paciente_id: number;
  doctor_id: number;
  fecha_hora: string;
  duracion_minutos: number;
  motivo: string;
  sintomas?: string;
  notas_paciente?: string;
  notas_doctor?: string;
  diagnostico?: string;
  tratamiento?: string;
  receta?: string;
  es_videollamada: boolean;
  url_videollamada?: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  costo?: number;
  motivo_cancelacion?: string;
  fecha_cancelacion?: string;
  fecha_creacion: string;
  doctor?: {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    consultorio?: string;
    telefono: string;
  };
}

export interface CitasEstadisticas {
  total: number;
  pendientes: number;
  confirmadas: number;
  completadas: number;
  canceladas: number;
  proxima_cita?: string;
}

export const citasService = {
  /**
   * Crear una nueva cita
   */
  async crearCita(data: CitaCreate): Promise<Cita> {
    return await apiClient.post<Cita>("/api/citas/", data);
  },

  /**
   * Obtener todas las citas del paciente actual
   */
  async obtenerMisCitas(params?: {
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    skip?: number;
    limit?: number;
  }): Promise<Cita[]> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append("estado", params.estado);
    if (params?.fecha_inicio)
      queryParams.append("fecha_inicio", params.fecha_inicio);
    if (params?.fecha_fin) queryParams.append("fecha_fin", params.fecha_fin);
    if (params?.skip !== undefined)
      queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined)
      queryParams.append("limit", params.limit.toString());

    const url = `/api/citas/mis-citas${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return await apiClient.get<Cita[]>(url);
  },

  /**
   * Obtener próximas citas del paciente
   */
  async obtenerProximasCitas(limit: number = 10): Promise<Cita[]> {
    return await apiClient.get<Cita[]>(`/api/citas/proximas?limit=${limit}`);
  },

  /**
   * Obtener detalle de una cita específica
   */
  async obtenerCitaPorId(citaId: number): Promise<Cita> {
    return await apiClient.get<Cita>(`/api/citas/${citaId}`);
  },

  /**
   * Cancelar una cita
   */
  async cancelarCita(
    citaId: number,
    data: CitaCancelar
  ): Promise<{ message: string; cita_id: number }> {
    return await apiClient.put(`/api/citas/${citaId}/cancelar`, data);
  },

  /**
   * Obtener estadísticas de citas
   */
  async obtenerEstadisticas(): Promise<CitasEstadisticas> {
    return await apiClient.get<CitasEstadisticas>(
      "/api/citas/estadisticas/mis-citas"
    );
  },
};
