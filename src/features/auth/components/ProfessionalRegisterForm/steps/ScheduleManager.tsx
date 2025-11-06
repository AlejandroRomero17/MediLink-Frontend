"use client";

import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { HorarioDoctor, DiaSemana } from "../types";

interface ScheduleManagerProps {
  horarios: HorarioDoctor[];
  onChange: (horarios: HorarioDoctor[]) => void;
  isLoading?: boolean;
}

const DIAS_SEMANA: DiaSemana[] = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
];

const DIAS_LABELS: Record<DiaSemana, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

// Función para obtener el próximo día disponible
const obtenerProximoDia = (horariosExistentes: HorarioDoctor[]): DiaSemana => {
  const diasUsados = new Set(horariosExistentes.map((h) => h.dia_semana));

  // Buscar el primer día no usado
  for (const dia of DIAS_SEMANA) {
    if (!diasUsados.has(dia)) {
      return dia;
    }
  }

  // Si todos los días están usados, empezar desde LUNES otra vez
  return "LUNES";
};

// Función para detectar horarios duplicados
const detectarHorariosDuplicados = (horarios: HorarioDoctor[]): number[] => {
  const indicesDuplicados: number[] = [];

  horarios.forEach((horario, index) => {
    const esDuplicado = horarios.some(
      (h, i) =>
        i !== index &&
        h.dia_semana === horario.dia_semana &&
        h.hora_inicio === horario.hora_inicio &&
        h.hora_fin === horario.hora_fin
    );

    if (esDuplicado) {
      indicesDuplicados.push(index);
    }
  });

  return indicesDuplicados;
};

export const ScheduleManager = ({
  horarios,
  onChange,
  isLoading,
}: ScheduleManagerProps) => {
  // Detectar horarios duplicados
  const indicesDuplicados = detectarHorariosDuplicados(horarios);
  const tieneDuplicados = indicesDuplicados.length > 0;

  const agregarHorario = () => {
    const proximoDia = obtenerProximoDia(horarios);

    const nuevoHorario: HorarioDoctor = {
      dia_semana: proximoDia,
      hora_inicio: "09:00",
      hora_fin: "18:00",
      activo: true,
    };

    // Agregar directamente sin validación previa
    // La validación solo es para mostrar advertencias
    onChange([...horarios, nuevoHorario]);
  };

  const eliminarHorario = (index: number) => {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    onChange(nuevosHorarios);
  };

  // ✅ CORREGIDO: Tipos específicos en lugar de any
  const actualizarHorario = (
    index: number,
    campo: keyof HorarioDoctor,
    valor: string | boolean | DiaSemana
  ) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = { ...nuevosHorarios[index], [campo]: valor };
    onChange(nuevosHorarios);
  };

  const configuracionRapida = () => {
    const horariosLunesViernes: HorarioDoctor[] = [
      {
        dia_semana: "LUNES",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "MARTES",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "MIERCOLES",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "JUEVES",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "VIERNES",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
    ];
    onChange(horariosLunesViernes);
  };

  // Función para limpiar duplicados automáticamente
  const limpiarDuplicados = () => {
    const horariosUnicos: HorarioDoctor[] = [];
    const vistos = new Set();

    horarios.forEach((horario) => {
      const clave = `${horario.dia_semana}-${horario.hora_inicio}-${horario.hora_fin}`;
      if (!vistos.has(clave)) {
        vistos.add(clave);
        horariosUnicos.push(horario);
      }
    });

    onChange(horariosUnicos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-gray-900 dark:text-gray-200 font-medium">
          Horarios de Atención *
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={configuracionRapida}
          disabled={isLoading}
          className="text-xs"
        >
          Lun-Vie 9:00-18:00
        </Button>
      </div>

      {/* Alerta de horarios duplicados */}
      {tieneDuplicados && (
        <Alert
          variant="destructive"
          className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
        >
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-300">
            <div className="flex items-center justify-between">
              <span>
                Tienes horarios duplicados. Se eliminarán automáticamente al
                enviar.
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={limpiarDuplicados}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-300 dark:border-yellow-700 dark:hover:bg-yellow-900"
              >
                Limpiar ahora
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {horarios.map((horario, index) => {
          const esDuplicado = indicesDuplicados.includes(index);

          return (
            <div
              key={index}
              className={`p-4 border rounded-lg space-y-3 bg-white dark:bg-slate-900 ${
                esDuplicado
                  ? "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20"
                  : "border-gray-300 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={horario.activo}
                    onCheckedChange={(checked) =>
                      actualizarHorario(index, "activo", checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <span
                    className={`text-sm font-medium ${
                      esDuplicado
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {esDuplicado && "⚠️ "}Horario{" "}
                    {DIAS_LABELS[horario.dia_semana]}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarHorario(index)}
                  disabled={isLoading}
                  className={`${
                    esDuplicado
                      ? "text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                      : "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label
                    className={`text-xs ${
                      esDuplicado
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    Día
                  </Label>
                  <select
                    value={horario.dia_semana}
                    onChange={(e) =>
                      actualizarHorario(
                        index,
                        "dia_semana",
                        e.target.value as DiaSemana
                      )
                    }
                    className={`w-full h-10 rounded-lg border px-3 text-sm focus:ring-2 text-gray-900 dark:text-white ${
                      esDuplicado
                        ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30"
                        : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                    disabled={isLoading}
                  >
                    {DIAS_SEMANA.map((dia) => (
                      <option key={dia} value={dia}>
                        {DIAS_LABELS[dia]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label
                    className={`text-xs ${
                      esDuplicado
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    Hora Inicio
                  </Label>
                  <Input
                    type="time"
                    value={horario.hora_inicio}
                    onChange={(e) =>
                      actualizarHorario(index, "hora_inicio", e.target.value)
                    }
                    className={`h-10 rounded-lg text-gray-900 dark:text-white ${
                      esDuplicado
                        ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30"
                        : "border-gray-300 dark:border-slate-700"
                    }`}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    className={`text-xs ${
                      esDuplicado
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    Hora Fin
                  </Label>
                  <Input
                    type="time"
                    value={horario.hora_fin}
                    onChange={(e) =>
                      actualizarHorario(index, "hora_fin", e.target.value)
                    }
                    className={`h-10 rounded-lg text-gray-900 dark:text-white ${
                      esDuplicado
                        ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30"
                        : "border-gray-300 dark:border-slate-700"
                    }`}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {esDuplicado && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ Este horario está duplicado (mismo día y horario)
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={agregarHorario}
        disabled={isLoading}
        className="w-full h-10 rounded-lg border-dashed border-2 border-gray-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Horario
      </Button>

      {horarios.length === 0 && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Debes agregar al menos un horario de atención
        </p>
      )}

      {/* Información sobre días disponibles */}
      {horarios.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Los nuevos horarios se asignan automáticamente a días no utilizados
        </p>
      )}
    </div>
  );
};
