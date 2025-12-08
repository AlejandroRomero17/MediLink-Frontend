// src/types/index.ts

/**
 * Exportación centralizada de todos los tipos de la aplicación
 *
 * Se exportan tipos específicos para evitar conflictos de nombres
 */

// ============ COMMON TYPES ============
export type {
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  ValidationError,
  LoadingState,
  FilterOptions,
  SelectOption,
  Coordinates,
  Address,
  DateRange,
  ToastNotification,
  ModalState,
  BreadcrumbItem,
  TabItem,
  BaseComponentProps,
  WithLoadingProps,
  WithErrorProps,
} from "./common.types";

// ============ API TYPES ============
export type {
  TipoUsuario,
  Genero,
  EstadoCita,
  Especialidad,
  UsuarioBase,
  UsuarioCreate,
  UsuarioResponse,
  UsuarioLogin,
  Token,
  PacienteBase,
  PacienteCreate,
  PacienteResponse,
  PacienteCompleto,
  DoctorBase,
  DoctorCreate,
  DoctorResponse,
  DoctorCompleto,
  CitaBase,
  CitaCreate,
  CitaUpdate,
  CitaResponse,
  CitaCompleta,
  ApiError,
} from "./api.types";

// ============ APPOINTMENTS TYPES ============
export type {
  AppointmentStatus,
  AppointmentType,
  UserAppointment,
} from "./appointments.types";

export {
  statusConfig,
  mapApiStatusToAppointmentStatus,
  mapAppointmentStatusToApiStatus,
  transformApiAppointmentToUser,
} from "./appointments.types";

// ============ AUTH TYPES ============
export type {
  LoginCredentials,
  PatientRegisterData,
  DoctorRegisterData,
  AuthState,
  AuthContextType,
  ProtectedRouteProps,
} from "./auth.types";

// ============ JWT TYPES ============
export type { JWTPayload } from "./jwt.types";

// ============ ALIASES ÚTILES ============
export type { UsuarioResponse as User } from "./api.types";
export type { UserAppointment as Appointment } from "./appointments.types";


