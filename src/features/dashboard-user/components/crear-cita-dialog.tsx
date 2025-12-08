// src/features/dashboard-user/components/crear-cita-dialog.tsx
"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Video,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCitas } from "@/hooks/use-citas";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CrearCitaDialogProps {
  doctorId: number;
  doctorNombre?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  // onError?: (error: Error) => void;
  onError?: (error: unknown) => void;
}

export function CrearCitaDialog({
  doctorId,
  doctorNombre,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess: externalOnSuccess,
  onError: externalOnError,
}: CrearCitaDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { crearCita, isCreatingCita } = useCitas();
  const [validationError, setValidationError] = useState<string | null>(null);

  // Determinar si usar control interno o externo
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen =
    isControlled && externalOnOpenChange
      ? externalOnOpenChange
      : setInternalOpen;

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    motivo: "",
    sintomas: "",
    notas_paciente: "",
    es_videollamada: false,
  });

  const validateForm = (): boolean => {
    setValidationError(null);

    if (!formData.fecha || !formData.hora) {
      setValidationError("Por favor selecciona fecha y hora");
      return false;
    }

    if (formData.motivo.length < 10) {
      setValidationError("El motivo debe tener al menos 10 caracteres");
      return false;
    }

    // Combinar fecha y hora
    const fechaHora = `${formData.fecha}T${formData.hora}:00`;

    // Validar que sea fecha futura
    const fechaSeleccionada = new Date(fechaHora);
    const ahora = new Date();

    if (fechaSeleccionada <= ahora) {
      setValidationError("La fecha y hora deben ser en el futuro");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Combinar fecha y hora
    const fechaHora = `${formData.fecha}T${formData.hora}:00`;

    crearCita(
      {
        doctor_id: doctorId,
        fecha_hora: fechaHora,
        motivo: formData.motivo,
        sintomas: formData.sintomas || undefined,
        notas_paciente: formData.notas_paciente || undefined,
        es_videollamada: formData.es_videollamada,
      },
      {
        onSuccess: () => {
          // Cierra el dialog
          setOpen(false);

          // Resetea el formulario
          setFormData({
            fecha: "",
            hora: "",
            motivo: "",
            sintomas: "",
            notas_paciente: "",
            es_videollamada: false,
          });

          // Llama al callback de éxito
          externalOnSuccess?.();
        },
        onError: (error: unknown) => {
          externalOnError?.(error);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Al abrir, resetear errores
      setValidationError(null);
    } else {
      // Al cerrar, resetear formulario si no está en proceso
      if (!isCreatingCita) {
        setFormData({
          fecha: "",
          hora: "",
          motivo: "",
          sintomas: "",
          notas_paciente: "",
          es_videollamada: false,
        });
      }
    }
    setOpen(newOpen);
  };

  return (
    <>
      {trigger && <div onClick={() => handleOpenChange(true)}>{trigger}</div>}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agendar Nueva Cita</DialogTitle>
            <DialogDescription>
              {doctorNombre
                ? `Agendar cita con ${doctorNombre}`
                : "Completa la información para agendar tu cita"}
            </DialogDescription>
          </DialogHeader>

          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Fecha *
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => {
                    setFormData({ ...formData, fecha: e.target.value });
                    setValidationError(null);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  disabled={isCreatingCita}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Hora *
                </Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => {
                    setFormData({ ...formData, hora: e.target.value });
                    setValidationError(null);
                  }}
                  required
                  disabled={isCreatingCita}
                  className="w-full"
                />
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label htmlFor="motivo">
                <Stethoscope className="h-4 w-4 inline mr-2" />
                Motivo de la Consulta *
              </Label>
              <textarea
                id="motivo"
                value={formData.motivo}
                onChange={(e) => {
                  setFormData({ ...formData, motivo: e.target.value });
                  setValidationError(null);
                }}
                placeholder="Describe el motivo principal de tu consulta (mínimo 10 caracteres)"
                className="w-full h-24 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                minLength={10}
                maxLength={500}
                required
                disabled={isCreatingCita}
              />
              <p className="text-xs text-gray-500 flex justify-between">
                <span>Mínimo 10 caracteres</span>
                <span>{formData.motivo.length}/500 caracteres</span>
              </p>
            </div>

            {/* Síntomas */}
            <div className="space-y-2">
              <Label htmlFor="sintomas">
                <FileText className="h-4 w-4 inline mr-2" />
                Síntomas (opcional)
              </Label>
              <textarea
                id="sintomas"
                value={formData.sintomas}
                onChange={(e) =>
                  setFormData({ ...formData, sintomas: e.target.value })
                }
                placeholder="Describe tus síntomas actuales, duración, intensidad, etc."
                className="w-full h-20 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreatingCita}
              />
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notas">Notas Adicionales (opcional)</Label>
              <textarea
                id="notas"
                value={formData.notas_paciente}
                onChange={(e) =>
                  setFormData({ ...formData, notas_paciente: e.target.value })
                }
                placeholder="Alguna preferencia u observación adicional que quieras compartir con el doctor"
                className="w-full h-16 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreatingCita}
              />
            </div>

            {/* Videollamada */}
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Checkbox
                id="videollamada"
                checked={formData.es_videollamada}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    es_videollamada: checked as boolean,
                  })
                }
                disabled={isCreatingCita}
              />
              <Label htmlFor="videollamada" className="cursor-pointer">
                <Video className="h-4 w-4 inline mr-2" />
                Esta cita será por videollamada
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isCreatingCita}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreatingCita}
                className="min-w-[120px]"
              >
                {isCreatingCita ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Agendando...
                  </>
                ) : (
                  "Agendar Cita"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
