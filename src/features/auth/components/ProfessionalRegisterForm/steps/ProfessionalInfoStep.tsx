// src/features/auth/components/ProfessionalRegisterForm/steps/ProfessionalInfoStep.tsx
"use client";

import { Stethoscope, Award, Building, DollarSign, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfessionalFormData } from "../types";

interface ProfessionalInfoStepProps {
  formData: ProfessionalFormData;
  onInputChange: (field: keyof ProfessionalFormData, value: string) => void;
  isLoading?: boolean;
}

const ESPECIALIDADES_MAP: { value: string; label: string }[] = [
  { value: "medicina_general", label: "Medicina General" },
  { value: "cardiologia", label: "Cardiología" },
  { value: "dermatologia", label: "Dermatología" },
  { value: "ginecologia", label: "Ginecología" },
  { value: "neurologia", label: "Neurología" },
  { value: "oftalmologia", label: "Oftalmología" },
  { value: "pediatria", label: "Pediatría" },
  { value: "traumatologia", label: "Traumatología" },
];

export const ProfessionalInfoStep = ({
  formData,
  onInputChange,
  isLoading,
}: ProfessionalInfoStepProps) => {
  return (
    <>
      {/* Especialidad */}
      <div className="space-y-2">
        <Label
          htmlFor="especialidad"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Especialidad *
        </Label>
        <div className="relative">
          <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select
            id="especialidad"
            value={formData.especialidad}
            onChange={(e) => onInputChange("especialidad", e.target.value)}
            className="w-full pl-12 h-12 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white"
            required
            disabled={isLoading}
          >
            <option value="">Selecciona tu especialidad</option>
            {ESPECIALIDADES_MAP.map((esp) => (
              <option key={esp.value} value={esp.value}>
                {esp.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cédula Profesional */}
      <div className="space-y-2">
        <Label
          htmlFor="cedula_profesional"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Cédula Profesional *
        </Label>
        <div className="relative">
          <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="cedula_profesional"
            type="text"
            placeholder="Número de cédula profesional"
            value={formData.cedula_profesional}
            onChange={(e) =>
              onInputChange("cedula_profesional", e.target.value)
            }
            className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            required
            minLength={5}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Consultorio */}
      <div className="space-y-2">
        <Label
          htmlFor="consultorio"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Consultorio/Hospital *
        </Label>
        <div className="relative">
          <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="consultorio"
            type="text"
            placeholder="Nombre del consultorio o hospital"
            value={formData.consultorio}
            onChange={(e) => onInputChange("consultorio", e.target.value)}
            className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            required
            minLength={3}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Horario y Costo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="horario_atencion"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Horario de Atención *
          </Label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Input
              id="horario_atencion"
              type="text"
              placeholder="Lun-Vie 9:00-18:00"
              value={formData.horario_atencion}
              onChange={(e) =>
                onInputChange("horario_atencion", e.target.value)
              }
              className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              required
              minLength={5}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="costo_consulta"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Costo de Consulta *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Input
              id="costo_consulta"
              type="number"
              placeholder="500"
              min="0"
              step="0.01"
              value={formData.costo_consulta}
              onChange={(e) => onInputChange("costo_consulta", e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};
