// src/features/dashboard-user/components/upcoming-appointments.tsx
"use client";

import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCitas } from "@/hooks/use-citas";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function UpcomingAppointments() {
  const { proximasCitas, isLoadingProximas, cancelarCita, isCancelingCita } =
    useCitas();

  const handleCancelar = (citaId: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      const motivo = prompt("Por favor indica el motivo de la cancelación:");
      if (motivo && motivo.length >= 10) {
        cancelarCita(citaId, motivo);
      } else if (motivo) {
        alert("El motivo debe tener al menos 10 caracteres");
      }
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      pendiente: (
        <Badge
          variant="outline"
          className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
        >
          ⏳ Pendiente
        </Badge>
      ),
      confirmada: (
        <Badge
          variant="outline"
          className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
        >
          ✅ Confirmada
        </Badge>
      ),
      completada: (
        <Badge
          variant="outline"
          className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
        >
          📋 Completada
        </Badge>
      ),
      cancelada: (
        <Badge
          variant="outline"
          className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
        >
          🚫 Cancelada
        </Badge>
      ),
    };
    return badges[estado as keyof typeof badges] || null;
  };

  if (isLoadingProximas) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!proximasCitas || proximasCitas.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No tienes citas próximas
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Agenda una cita con tu doctor de confianza
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Próximas Citas</h3>
        <Badge variant="outline">{proximasCitas.length} citas</Badge>
      </div>

      <div className="space-y-3">
        {proximasCitas.map((cita) => (
          <div
            key={cita.id}
            className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {cita.doctor?.nombre} {cita.doctor?.apellido}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cita.doctor?.especialidad}
                </p>
              </div>
              {getEstadoBadge(cita.estado)}
            </div>

            {/* Fecha y Hora */}
            <div className="flex items-center gap-4 text-sm mb-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(cita.fecha_hora), "EEEE, d 'de' MMMM", {
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(cita.fecha_hora), "HH:mm")}h</span>
              </div>
            </div>

            {/* Tipo de consulta */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              {cita.es_videollamada ? (
                <>
                  <Video className="h-4 w-4 text-blue-500" />
                  <span>Videollamada</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{cita.doctor?.consultorio || "Consultorio"}</span>
                </>
              )}
            </div>

            {/* Motivo */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {cita.motivo}
            </p>

            {/* Acciones */}
            {(cita.estado === "pendiente" || cita.estado === "confirmada") && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelar(cita.id)}
                  disabled={isCancelingCita}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button size="sm" className="flex-1">
                  Ver Detalles
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
