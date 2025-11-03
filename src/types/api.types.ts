// src/types/api.types.ts

// ============ ENUMS ============
// Los valores deben coincidir EXACTAMENTE con los del backend (minúsculas)
export type TipoUsuario = "paciente" | "doctor" | "admin";
export type Genero = "masculino" | "femenino" | "otro";
export type EstadoCita =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada";
export type Especialidad =
  | "medicina_general"
  | "cardiologia"
  | "dermatologia"
  | "pediatria"
  | "ginecologia"
  | "traumatologia"
  | "oftalmologia"
  | "neurologia";

// ============ USUARIOS ============
export interface UsuarioBase {
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  tipo_usuario: TipoUsuario;
}

export interface UsuarioCreate extends UsuarioBase {
  password: string;
}

export interface UsuarioResponse extends UsuarioBase {
  id: number;
  activo: boolean;
  fecha_registro: string; // ISO datetime
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

// ============ PACIENTES ============
export interface PacienteBase {
  fecha_nacimiento: string; // ISO date
  genero: Genero;
  direccion?: string;
  numero_seguro?: string;
  alergias?: string;
  tipo_sangre?: string; // A+, A-, B+, B-, AB+, AB-, O+, O-
}

export interface PacienteCreate extends PacienteBase {
  usuario_id: number;
}

export interface PacienteResponse extends PacienteBase {
  id: number;
  usuario_id: number;
  fecha_creacion: string;
}

export interface PacienteCompleto extends PacienteResponse {
  usuario: UsuarioResponse;
}

// ============ DOCTORES ============
export interface DoctorBase {
  especialidad: Especialidad;
  cedula_profesional: string;
  consultorio?: string;
  horario_atencion?: string;
  costo_consulta?: number;
}

export interface DoctorCreate extends DoctorBase {
  usuario_id: number;
}

export interface DoctorResponse extends DoctorBase {
  id: number;
  usuario_id: number;
  fecha_creacion: string;
}

export interface DoctorCompleto extends DoctorResponse {
  usuario: UsuarioResponse;
}

// ============ CITAS ============
export interface CitaBase {
  fecha_hora: string; // ISO datetime
  motivo: string;
  notas?: string;
}

export interface CitaCreate extends CitaBase {
  paciente_id: number;
  doctor_id: number;
}

export interface CitaUpdate {
  fecha_hora?: string;
  motivo?: string;
  notas?: string;
  diagnostico?: string;
  receta?: string;
  estado?: EstadoCita;
}

export interface CitaResponse extends CitaBase {
  id: number;
  paciente_id: number;
  doctor_id: number;
  diagnostico?: string;
  receta?: string;
  estado: EstadoCita;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CitaCompleta extends CitaResponse {
  paciente: PacienteCompleto;
  doctor: DoctorCompleto;
}

// ============ API ERROR TYPES ============
export interface ApiError {
  detail: string | ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}
// ============ TOKEN ============
export interface Token {
  access_token: string;
  token_type: string;
  usuario: UsuarioResponse;  // ← Más completo que jwt.types
}




