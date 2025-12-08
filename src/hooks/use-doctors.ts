// src/hooks/use-doctors.ts
"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { getErrorMessage } from "@/types/api.types";


// Interfaces que coinciden EXACTAMENTE con tu backend
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_usuario: string;
  activo: boolean;
  fecha_registro: string;
}

export interface HorarioDoctor {
  id: number;
  doctor_id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

export interface Doctor {
  // Campos base
  id: number;
  usuario_id: number;
  especialidad: string;
  cedula_profesional: string;
  consultorio: string;
  direccion_consultorio: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;

  // Coordenadas opcionales
  latitud?: number;
  longitud?: number;

  // Horarios y costos
  horario_atencion?: string;
  costo_consulta: number;
  duracion_cita_minutos: number;

  // Información adicional
  anos_experiencia?: number;
  universidad?: string;
  biografia?: string;
  foto_url?: string;

  // Modalidades
  acepta_seguro: boolean;
  atiende_domicilio: boolean;
  atiende_videollamada: boolean;

  // Calificaciones
  calificacion_promedio: number;
  total_valoraciones: number;

  // Fecha de creación
  fecha_creacion: string;

  // Relaciones
  usuario: Usuario;
  horarios: HorarioDoctor[];
}

export interface SearchFilters {
  nombre?: string;
  especialidad?: string;
  ciudad?: string;
  estado?: string;
  precio_min?: number;
  precio_max?: number;
  calificacion_min?: number;
  acepta_seguro?: boolean;
  atiende_videollamada?: boolean;
  atiende_domicilio?: boolean;
  ordenar_por?: string;
  orden?: string;
}

// Interfaces para respuestas especiales del backend
export interface DoctorCercano {
  id: number;
  nombre_completo: string;
  especialidad: string;
  consultorio: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  costo_consulta: number;
  calificacion_promedio: number;
  total_valoraciones: number;
  acepta_seguro: boolean;
  atiende_videollamada: boolean;
  distancia_km: number;
  tiempo_estimado_minutos: number;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationType, setOperationType] = useState<string | null>(null);

  const startOperation = (type: string) => {
    setIsLoading(true);
    setError(null);
    setOperationType(type);
  };

  const endOperation = () => {
    setIsLoading(false);
    setOperationType(null);
  };

  // Buscar todos los doctores
  const fetchAllDoctors = useCallback(async () => {
    startOperation("fetchAllDoctors");
    try {
      console.log("Fetching all doctors from /api/doctores");
      const response = await apiClient.get<Doctor[]>("/api/doctores");
      console.log("Doctores recibidos:", response);
      setDoctors(response);
      return response;
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      return [];
    } finally {
      endOperation();
    }
  }, []);

  // Buscar doctores con filtros
  const searchDoctors = useCallback(async (filters: SearchFilters) => {
    startOperation("searchDoctors");
    try {
      const params = new URLSearchParams();

      if (filters.nombre) params.append("nombre", filters.nombre);
      if (filters.especialidad && filters.especialidad !== "all") {
        params.append("especialidad", filters.especialidad);
      }
      if (filters.ciudad) params.append("ciudad", filters.ciudad);
      if (filters.estado) params.append("estado", filters.estado);
      if (filters.precio_min !== undefined)
        params.append("precio_min", filters.precio_min.toString());
      if (filters.precio_max !== undefined)
        params.append("precio_max", filters.precio_max.toString());
      if (filters.calificacion_min !== undefined)
        params.append("calificacion_min", filters.calificacion_min.toString());
      if (filters.acepta_seguro !== undefined)
        params.append("acepta_seguro", filters.acepta_seguro.toString());
      if (filters.atiende_videollamada !== undefined)
        params.append(
          "atiende_videollamada",
          filters.atiende_videollamada.toString()
        );
      if (filters.atiende_domicilio !== undefined)
        params.append(
          "atiende_domicilio",
          filters.atiende_domicilio.toString()
        );
      if (filters.ordenar_por)
        params.append("ordenar_por", filters.ordenar_por);
      if (filters.orden) params.append("orden", filters.orden);

      const queryString = params.toString();
      const url = `/api/busqueda/doctores${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Buscando doctores con URL:", url);
      const response = await apiClient.get<Doctor[]>(url);
      console.log("Resultados de búsqueda:", response);

      setDoctors(response);
      return response;
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Error searching doctors:", err);
      setDoctors([]);
      return [];
    } finally {
      endOperation();
    }
  }, []);

  // Obtener un doctor por ID
  const getDoctorById = useCallback(async (id: number) => {
    startOperation("getDoctorById");
    try {
      console.log(`Fetching doctor ${id}`);
      const response = await apiClient.get<Doctor>(`/api/doctores/${id}`);
      console.log("Doctor cargado:", response);
      return response;
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Error fetching doctor:", err);
      return null;
    } finally {
      endOperation();
    }
  }, []);

  // Buscar doctores por especialidad
  const searchBySpecialty = useCallback(
    async (especialidad: string) => {
      return searchDoctors({ especialidad });
    },
    [searchDoctors]
  );

  // Buscar doctores por ciudad
  const searchByCity = useCallback(
    async (ciudad: string) => {
      return searchDoctors({ ciudad });
    },
    [searchDoctors]
  );

  // Buscar doctores cercanos
  const searchNearby = useCallback(
    async (
      latitud: number,
      longitud: number,
      radio_km: number = 10
    ): Promise<DoctorCercano[]> => {
      startOperation("searchNearby");
      try {
        const params = new URLSearchParams({
          latitud: latitud.toString(),
          longitud: longitud.toString(),
          radio_km: radio_km.toString(),
        });

        const url = `/api/busqueda/doctores/cercanos?${params.toString()}`;
        console.log("Buscando doctores cercanos con URL:", url);
        const response = await apiClient.get<DoctorCercano[]>(url);
        console.log("Doctores cercanos:", response);
        return response;
      } catch (err: unknown) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        console.error("Error searching nearby doctors:", err);
        return [];
      } finally {
        endOperation();
      }
    },
    []
  );

  // Obtener doctores mejor valorados
  const fetchBestRated = useCallback(
    async (especialidad?: string, limit: number = 10): Promise<Doctor[]> => {
      startOperation("fetchBestRated");
      try {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (especialidad && especialidad !== "all") {
          params.append("especialidad", especialidad);
        }

        const url = `/api/busqueda/doctores/mejor-valorados?${params.toString()}`;
        console.log("Buscando doctores mejor valorados con URL:", url);
        const response = await apiClient.get<Doctor[]>(url);
        setDoctors(response);
        return response;
      } catch (err: unknown) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        console.error("Error fetching best rated doctors:", err);
        return [];
      } finally {
        endOperation();
      }
    },
    []
  );

  // Nueva función: obtener especialidades populares
  const fetchPopularSpecialties = useCallback(async (limit: number = 10) => {
    startOperation("fetchPopularSpecialties");
    try {
      const url = `/api/busqueda/especialidades/populares?limit=${limit}`;
      console.log("Obteniendo especialidades populares con URL:", url);
      const response = await apiClient.get<
        Array<{ especialidad: string; total_doctores: number }>
      >(url);
      return response;
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Error fetching popular specialties:", err);
      return [];
    } finally {
      endOperation();
    }
  }, []);

  // Nueva función: obtener doctores disponibles hoy
  const fetchAvailableToday = useCallback(
    async (especialidad?: string, hora_minima?: string, limit: number = 10) => {
      startOperation("fetchAvailableToday");
      try {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (especialidad && especialidad !== "all") {
          params.append("especialidad", especialidad);
        }
        if (hora_minima) {
          params.append("hora_minima", hora_minima);
        }

        const url = `/api/busqueda/doctores/disponibles-hoy?${params.toString()}`;
        console.log("Buscando doctores disponibles hoy con URL:", url);
        const response = await apiClient.get<Doctor[]>(url);
        return response;
      } catch (err: unknown) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        console.error("Error fetching available doctors:", err);
        return [];
      } finally {
        endOperation();
      }
    },
    []
  );

  return {
    doctors,
    isLoading,
    error,
    operationType,
    fetchAllDoctors,
    searchDoctors,
    getDoctorById,
    searchBySpecialty,
    searchByCity,
    searchNearby,
    fetchBestRated,
    fetchPopularSpecialties,
    fetchAvailableToday,
  };
}
