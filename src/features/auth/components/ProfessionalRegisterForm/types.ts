// src/features/auth/components/ProfessionalRegisterForm/types.ts
import { Especialidad } from "@/types/api.types";

export type DiaSemana =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO"
  | "DOMINGO";

export interface HorarioDoctor {
  dia_semana: DiaSemana;
  hora_inicio: string; // formato "HH:mm" ej: "09:00"
  hora_fin: string; // formato "HH:mm" ej: "18:00"
  activo: boolean;
}

export interface ProfessionalFormData {
  // Información básica (Paso 1)
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;

  // Información profesional (Paso 2)
  especialidad: Especialidad;
  cedula_profesional: string;
  consultorio: string;
  costo_consulta: string;
  duracion_cita_minutos: string;
  horarios: HorarioDoctor[];

  // Información adicional (Paso 3)
  direccion_consultorio: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  latitud: string;
  longitud: string;
  anos_experiencia: string;
  universidad: string;
  biografia: string;
  foto_url: string;

  // Opciones de servicio (Paso 3)
  acepta_seguro: boolean;
  atiende_domicilio: boolean;
  atiende_videollamada: boolean;
}

export interface ProfessionalSubmitData {
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    password: string;
    tipo_usuario: "doctor";
  };
  doctor: {
    especialidad: Especialidad;
    cedula_profesional: string;
    consultorio: string;
    direccion_consultorio?: string;
    ciudad?: string;
    estado?: string;
    codigo_postal?: string;
    anos_experiencia?: number;
    latitud?: number;
    longitud?: number;
    costo_consulta: number;
    duracion_cita_minutos?: number;
    universidad?: string;
    biografia?: string;
    foto_url?: string;
    acepta_seguro?: boolean;
    atiende_domicilio?: boolean;
    atiende_videollamada?: boolean;
  };
  horarios: HorarioDoctor[];
}
