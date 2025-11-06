// En src/features/auth/components/ProfessionalRegisterForm/types.ts
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

  // Información adicional (Paso 3) - AHORA OBLIGATORIOS
  direccion_consultorio: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  anos_experiencia: string;
  universidad: string;
  biografia: string;
  foto_url: string;

  // Opciones de servicio (Paso 3) - AHORA OBLIGATORIOS
  acepta_seguro: boolean;
  atiende_domicilio: boolean;
  atiende_videollamada: boolean;

  // Coordenadas (opcionales)
  latitud: string;
  longitud: string;
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
    // Campos requeridos
    especialidad: Especialidad;
    cedula_profesional: string;
    consultorio: string;

    // ✅ AHORA OBLIGATORIOS (según tu modelo de backend)
    direccion_consultorio: string;
    ciudad: string;
    estado: string;
    codigo_postal: string;
    anos_experiencia: number;
    duracion_cita_minutos: number;
    universidad: string;

    // Campos de servicio ✅ OBLIGATORIOS
    acepta_seguro: boolean;
    atiende_domicilio: boolean;
    atiende_videollamada: boolean;

    // Campos obligatorios del modelo
    costo_consulta: number;

    // Campos opcionales
    biografia?: string;
    foto_url?: string;
    latitud?: number;
    longitud?: number;
  };
  horarios: HorarioDoctor[];
}
