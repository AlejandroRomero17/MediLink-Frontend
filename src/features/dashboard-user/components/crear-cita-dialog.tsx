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
  X,
  CheckCircle2,
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
        setValidationError(null);
      }
    }
    setOpen(newOpen);
  };

  return (
    <>
      {trigger && <div onClick={() => handleOpenChange(true)}>{trigger}</div>}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-border/50 shadow-2xl">
          {/* Header mejorado */}
          <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-primary">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">
                    Agendar Nueva Cita
                  </DialogTitle>
                  <DialogDescription className="text-sm md:text-base text-muted-foreground mt-1">
                    {doctorNombre ? (
                      <span className="flex items-center gap-2 mt-1">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {doctorNombre}
                        </span>
                      </span>
                    ) : (
                      "Completa la información para agendar tu cita"
                    )}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Alert de validación */}
          {validationError && (
            <Alert
              variant="destructive"
              className="animate-slide-up border-red-200 dark:border-red-900"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {validationError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 py-2">
            {/* Fecha y Hora */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Fecha y Hora de la Cita
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fecha"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
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
                    className="w-full h-11 bg-background text-foreground border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="hora"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
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
                    className="w-full h-11 bg-background text-foreground border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label
                htmlFor="motivo"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
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
                className="w-full h-24 rounded-lg border-2 border-input bg-background text-foreground px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                minLength={10}
                maxLength={500}
                required
                disabled={isCreatingCita}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Mínimo 10 caracteres
                </p>
                <p
                  className={`text-xs font-medium ${
                    formData.motivo.length >= 10
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {formData.motivo.length}/500
                </p>
              </div>
            </div>

            {/* Síntomas */}
            <div className="space-y-2">
              <Label
                htmlFor="sintomas"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Síntomas
                <span className="text-xs text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <textarea
                id="sintomas"
                value={formData.sintomas}
                onChange={(e) =>
                  setFormData({ ...formData, sintomas: e.target.value })
                }
                placeholder="Describe tus síntomas: duración, intensidad, frecuencia..."
                className="w-full h-20 rounded-lg border-2 border-input bg-background text-foreground px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                disabled={isCreatingCita}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.sintomas.length}/300
              </p>
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label
                htmlFor="notas"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Notas Adicionales
                <span className="text-xs text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <textarea
                id="notas"
                value={formData.notas_paciente}
                onChange={(e) =>
                  setFormData({ ...formData, notas_paciente: e.target.value })
                }
                placeholder="Preferencias de horario, alergias, medicamentos actuales..."
                className="w-full h-20 rounded-lg border-2 border-input bg-background text-foreground px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                disabled={isCreatingCita}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.notas_paciente.length}/200
              </p>
            </div>

            {/* Videollamada */}
            <div className="space-y-2">
              <div
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                  formData.es_videollamada
                    ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                    : "bg-muted/30 border-border/50 hover:border-border"
                }`}
              >
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
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="videollamada"
                    className="cursor-pointer font-medium text-foreground flex items-center gap-2 mb-1"
                  >
                    <Video
                      className={`h-4 w-4 ${
                        formData.es_videollamada
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-muted-foreground"
                      }`}
                    />
                    Consulta por videollamada
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    La consulta se realizará de forma remota a través de
                    videollamada
                  </p>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isCreatingCita}
                className="w-full sm:w-auto order-2 sm:order-1 h-11 border-2 hover:bg-muted/50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreatingCita}
                className="w-full sm:w-auto order-1 sm:order-2 h-11 min-w-[160px] bg-gradient-primary hover:shadow-glow-primary transition-all"
              >
                {isCreatingCita ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Agendar Cita
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
