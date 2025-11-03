// src/types/auth.types.ts
import { UsuarioResponse, PacienteBase } from "./api.types";
import type { ProfessionalSubmitData } from "@/features/auth/components/ProfessionalRegisterForm/types";

/**
 * Datos para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Datos para registro COMBINADO de paciente (NUEVO)
 */
export interface PatientRegisterData {
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    tipo_usuario: "paciente";
  };
  paciente: PacienteBase;
}

/**
 * Datos para registro COMBINADO de doctor (NUEVO) ✅
 * Usa la misma estructura que ProfessionalSubmitData
 */
export interface DoctorRegisterData {
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono: string;
    tipo_usuario: "doctor";
  };
  doctor: {
    // Campos requeridos
    especialidad: string;
    cedula_profesional: string;
    consultorio: string;
    costo_consulta: number;

    // Campos opcionales
    direccion_consultorio?: string;
    ciudad?: string;
    estado?: string;
    codigo_postal?: string;
    anos_experiencia?: number;
    latitud?: number;
    longitud?: number;
    duracion_cita_minutos?: number;
    universidad?: string;
    biografia?: string;
    foto_url?: string;
    acepta_seguro: boolean;
    atiende_domicilio: boolean;
    atiende_videollamada: boolean;
  };
  horarios: Array<{
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
  }>;
}

/**
 * Re-exportar ProfessionalSubmitData como alias
 * Para compatibilidad y claridad
 */
export type { ProfessionalSubmitData };

/**
 * Datos para registro LEGACY (solo usuario)
 */
export interface LegacyRegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  tipo_usuario: "paciente" | "doctor" | "admin";
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: UsuarioResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Contexto de autenticación
 */
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  registerPatient: (data: PatientRegisterData) => Promise<void>;
  registerDoctor: (data: DoctorRegisterData) => Promise<void>;
  registerLegacy: (data: LegacyRegisterData) => Promise<void>;
}

/**
 * Props para componentes protegidos
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "paciente" | "doctor" | "admin";
  redirectTo?: string;
}
