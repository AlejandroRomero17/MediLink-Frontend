// src/lib/config/env.ts
// Configuración para producción

// Validar que las variables críticas estén definidas
const validateEnv = () => {
  if (typeof window !== "undefined") {
    // Solo en cliente
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("❌ CRÍTICO: NEXT_PUBLIC_API_URL no está definido");
      console.error("   Agrega NEXT_PUBLIC_API_URL a tus variables de entorno");
    }
  }
};

validateEnv();

export const ENV = {
  // ⭐ PRODUCCIÓN: Siempre usar la variable de entorno
  // No usar valores por defecto locales en producción
  API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : ""),

  APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"),

  // Método para debug
  logEnvironment() {
    if (typeof window !== "undefined") {
      console.log("🌐 ENV Configuration:");
      console.log("   API_URL:", this.API_URL);
      console.log("   APP_URL:", this.APP_URL);
      console.log("   NODE_ENV:", process.env.NODE_ENV);
    }
  },
} as const;

// Log en desarrollo
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  ENV.logEnvironment();
}

export const API_ENDPOINTS = {
  // Registro combinado
  REGISTRO: {
    PACIENTE: "/api/registro/paciente",
    DOCTOR: "/api/registro/doctor",
    ADMIN: "/api/registro/admin",
  },

  // Auth endpoints (usuarios)
  AUTH: {
    REGISTER: "/api/usuarios/registro",
    LOGIN: "/api/usuarios/login",
    ME: "/api/usuarios/me",
    GET_USERS: "/api/usuarios",
    GET_USER: (id: string) => `/api/usuarios/${id}`,
    UPDATE_USER: (id: string) => `/api/usuarios/${id}`,
    DEACTIVATE_USER: (id: string) => `/api/usuarios/${id}`,
  },

  // Doctor endpoints
  DOCTORS: {
    CREATE: "/api/doctores",
    LIST: "/api/doctores",
    GET: (id: string) => `/api/doctores/${id}`,
    UPDATE: (id: string) => `/api/doctores/${id}`,
    BY_USER: (userId: string) => `/api/doctores/usuario/${userId}`,
    BY_SPECIALTY: (specialty: string) =>
      `/api/doctores/especialidad/${specialty}`,
  },

  // Patient endpoints
  PATIENTS: {
    CREATE: "/api/pacientes",
    LIST: "/api/pacientes",
    GET: (id: string) => `/api/pacientes/${id}`,
    UPDATE: (id: string) => `/api/pacientes/${id}`,
    BY_USER: (userId: string) => `/api/pacientes/usuario/${userId}`,
  },

  // Appointments endpoints (citas)
  APPOINTMENTS: {
    CREATE: "/api/citas",
    LIST: "/api/citas",
    GET: (id: string) => `/api/citas/${id}`,
    UPDATE: (id: string) => `/api/citas/${id}`,
    CANCEL: (id: string) => `/api/citas/${id}`,
    BY_PATIENT: (patientId: string) => `/api/citas/paciente/${patientId}`,
    BY_DOCTOR: (doctorId: string) => `/api/citas/doctor/${doctorId}`,
    CONFIRM: (id: string) => `/api/citas/${id}/confirmar`,
    COMPLETE: (id: string) => `/api/citas/${id}/completar`,
  },

  // Búsqueda y disponibilidad
  SEARCH: {
    DOCTORS: "/api/busqueda/doctores",
    NEARBY_DOCTORS: "/api/busqueda/doctores/cercanos",
    POPULAR_SPECIALTIES: "/api/busqueda/especialidades/populares",
    TOP_RATED_DOCTORS: "/api/busqueda/doctores/mejor-valorados",
  },

  AVAILABILITY: {
    DOCTOR_AVAILABILITY: (doctorId: string) =>
      `/api/disponibilidad/doctor/${doctorId}`,
    UPCOMING_AVAILABILITY: (doctorId: string) =>
      `/api/disponibilidad/doctor/${doctorId}/proximos-disponibles`,
    MY_SCHEDULE: "/api/disponibilidad/mis-horarios",
    STATISTICS: (doctorId: string) =>
      `/api/disponibilidad/estadisticas/doctor/${doctorId}`,
  },

  HEALTH: "/health",
} as const;
