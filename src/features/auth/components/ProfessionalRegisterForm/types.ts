// src/features/auth/components/ProfessionalRegisterForm/types.ts
import { Especialidad } from "@/types/api.types";

export interface ProfessionalFormData {
  // Información básica
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;

  // Información profesional
  especialidad: Especialidad;
  cedula_profesional: string;
  consultorio: string;
  direccion_consultorio: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  costo_consulta: string;
  horario_atencion: string;
  anos_experiencia: string;
  universidad: string;
  biografia: string;
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
    consultorio?: string;
    direccion_consultorio?: string;
    ciudad?: string;
    estado?: string;
    codigo_postal?: string;
    horario_atencion?: string;
    costo_consulta?: number;
    anos_experiencia?: number;
    universidad?: string;
    biografia?: string;
  };
}
