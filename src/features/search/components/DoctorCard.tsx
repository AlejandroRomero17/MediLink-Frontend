// src/features/search/components/DoctorCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Stethoscope,
  Award,
  Building,
  Video,
  Home,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Doctor } from "@/hooks/use-doctors";
import { CrearCitaDialog } from "@/features/dashboard-user/components/crear-cita-dialog";
import { toast } from "sonner";

interface DoctorCardProps {
  doctor: Doctor;
  onScheduleAppointment?: (doctorId: number) => void;
}

// ✅ Mapeo de especialidades en MINÚSCULAS
const ESPECIALIDAD_LABELS: Record<string, string> = {
  medicina_general: "Medicina General",
  cardiologia: "Cardiología",
  pediatria: "Pediatría",
  dermatologia: "Dermatología",
  ginecologia: "Ginecología",
  traumatologia: "Traumatología",
  oftalmologia: "Oftalmología",
  neurologia: "Neurología",
  psiquiatria: "Psiquiatría",
  urologia: "Urología",
  oncologia: "Oncología",
  endocrinologia: "Endocrinología",
};

// ✅ Tipo para errores con mensaje
interface ErrorWithMessage {
  message: string;
}

// ✅ Función helper para verificar si es un error con mensaje
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export function DoctorCard({ doctor, onScheduleAppointment }: DoctorCardProps) {
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);

  const doctorName = doctor.usuario
    ? `Dr. ${doctor.usuario.nombre} ${doctor.usuario.apellido}`
    : "Doctor";

  const initials = doctor.usuario
    ? `${doctor.usuario.nombre[0]}${doctor.usuario.apellido[0]}`
    : "DR";

  // ✅ Normalizar especialidad a minúsculas para buscar
  const especialidadNormalizada = doctor.especialidad.toLowerCase();
  const especialidadLabel =
    ESPECIALIDAD_LABELS[especialidadNormalizada] || doctor.especialidad;

  const handleAppointmentClick = () => {
    console.log(
      `🗓️ Abriendo diálogo para agendar cita con doctor ${doctor.id}`
    );
    // Primero llama al callback del padre si existe
    onScheduleAppointment?.(doctor.id);
    // Luego abre el dialog
    setShowAppointmentDialog(true);
  };

  const handleAppointmentSuccess = () => {
    console.log(`✅ Cita agendada exitosamente con doctor ${doctor.id}`);
    setShowAppointmentDialog(false);

    // ✅ Mostrar toast de éxito
    toast.success("¡Cita agendada exitosamente!", {
      description: `Tu cita con ${doctorName} ha sido programada`,
      duration: 5000,
    });
  };

  const handleAppointmentError = (error: unknown) => {
    console.error("Error al crear cita:", error);

    // ✅ Mejor manejo de mensajes de error
    let errorMessage =
      "No se pudo agendar la cita. Por favor, inténtalo de nuevo.";
    let errorTitle = "Error al agendar cita";

    if (error instanceof Error) {
      // Manejo específico de tipos de error comunes
      if (
        error.message.includes("network") ||
        error.message.includes("Network")
      ) {
        errorTitle = "Error de conexión";
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else if (
        error.message.includes("timeout") ||
        error.message.includes("Time")
      ) {
        errorTitle = "Tiempo de espera agotado";
        errorMessage =
          "La solicitud está tardando demasiado. Intenta nuevamente.";
      } else if (
        error.message.includes("auth") ||
        error.message.includes("Auth")
      ) {
        errorTitle = "Error de autenticación";
        errorMessage = "Necesitas iniciar sesión para agendar una cita.";
      } else {
        errorMessage = error.message;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (isErrorWithMessage(error)) {
      errorMessage = error.message;
    }

    // ✅ Mostrar toast de error con mejor información
    toast.error(errorTitle, {
      description: errorMessage,
      duration: 7000,
      action: {
        label: "Reintentar",
        onClick: () => {
          setShowAppointmentDialog(true);
        },
      },
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-4 text-white">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={doctor.foto_url} alt={doctorName} />
                <AvatarFallback className="bg-white text-blue-600 font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="text-xl font-bold">{doctorName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Stethoscope className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {especialidadLabel}
                  </span>
                </div>

                {/* Calificación */}
                {doctor.calificacion_promedio &&
                doctor.calificacion_promedio > 0 ? (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.calificacion_promedio || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm ml-1">
                      {doctor.calificacion_promedio.toFixed(1)} (
                      {doctor.total_valoraciones || 0})
                    </span>
                  </div>
                ) : (
                  <p className="text-sm mt-2 opacity-80">
                    Sin valoraciones aún
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4 space-y-3">
            {/* Cédula profesional */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Award className="h-4 w-4 flex-shrink-0" />
              <span>Cédula: {doctor.cedula_profesional}</span>
            </div>

            {/* Consultorio */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building className="h-4 w-4 flex-shrink-0" />
              <span>{doctor.consultorio}</span>
            </div>

            {/* Dirección completa */}
            {doctor.direccion_consultorio && (
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{doctor.direccion_consultorio}</p>
                  {(doctor.ciudad || doctor.estado) && (
                    <p className="text-xs">
                      {doctor.ciudad}
                      {doctor.ciudad && doctor.estado && ", "}
                      {doctor.estado}
                      {doctor.codigo_postal && ` • CP ${doctor.codigo_postal}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ubicación simple si no hay dirección */}
            {!doctor.direccion_consultorio &&
              (doctor.ciudad || doctor.estado) && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {doctor.ciudad}
                    {doctor.ciudad && doctor.estado && ", "}
                    {doctor.estado}
                  </span>
                </div>
              )}

            {/* Horario */}
            {doctor.horario_atencion && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{doctor.horario_atencion}</span>
              </div>
            )}

            {/* Costo */}
            {doctor.costo_consulta && doctor.costo_consulta > 0 && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span>${doctor.costo_consulta.toFixed(2)} MXN</span>
              </div>
            )}

            {/* Badges de información */}
            <div className="flex flex-wrap gap-2">
              {doctor.anos_experiencia && doctor.anos_experiencia > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {doctor.anos_experiencia} años de experiencia
                </Badge>
              )}

              {doctor.acepta_seguro && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Acepta seguro
                </Badge>
              )}

              {doctor.atiende_videollamada && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Video className="h-3 w-3" />
                  Videollamada
                </Badge>
              )}

              {doctor.atiende_domicilio && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Home className="h-3 w-3" />A domicilio
                </Badge>
              )}
            </div>

            {/* Universidad */}
            {doctor.universidad && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                🎓 {doctor.universidad}
              </p>
            )}

            {/* Biografía */}
            {doctor.biografia && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 pt-2 border-t">
                {doctor.biografia}
              </p>
            )}
          </div>

          {/* Footer con botón */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={handleAppointmentClick}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Cita
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Dialog para crear cita */}
      <CrearCitaDialog
        doctorId={doctor.id}
        doctorNombre={doctorName}
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        onSuccess={handleAppointmentSuccess}
        onError={handleAppointmentError}
      />
    </>
  );
}
