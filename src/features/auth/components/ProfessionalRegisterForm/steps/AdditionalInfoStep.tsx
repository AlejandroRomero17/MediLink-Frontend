// src/features/auth/components/ProfessionalRegisterForm/steps/AdditionalInfoStep.tsx
"use client";

import { MapPin, GraduationCap, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfessionalFormData } from "../types";

interface AdditionalInfoStepProps {
  formData: ProfessionalFormData;
  onInputChange: (field: keyof ProfessionalFormData, value: string) => void;
  isLoading?: boolean;
}

export const AdditionalInfoStep = ({
  formData,
  onInputChange,
  isLoading,
}: AdditionalInfoStepProps) => {
  return (
    <>
      {/* Mensaje informativo */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-2">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Los siguientes campos son <strong>opcionales</strong> pero te ayudarán
          a completar tu perfil profesional.
        </p>
      </div>

      {/* Dirección del Consultorio */}
      <div className="space-y-2">
        <Label
          htmlFor="direccion_consultorio"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Dirección del Consultorio
        </Label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="direccion_consultorio"
            type="text"
            placeholder="Calle, número, colonia"
            value={formData.direccion_consultorio}
            onChange={(e) =>
              onInputChange("direccion_consultorio", e.target.value)
            }
            className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Ciudad, Estado y Código Postal */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="ciudad"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Ciudad
          </Label>
          <Input
            id="ciudad"
            type="text"
            placeholder="CDMX"
            value={formData.ciudad}
            onChange={(e) => onInputChange("ciudad", e.target.value)}
            className="h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="estado"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Estado
          </Label>
          <Input
            id="estado"
            type="text"
            placeholder="Estado"
            value={formData.estado}
            onChange={(e) => onInputChange("estado", e.target.value)}
            className="h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="codigo_postal"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            C.P.
          </Label>
          <Input
            id="codigo_postal"
            type="text"
            placeholder="12345"
            maxLength={5}
            value={formData.codigo_postal}
            onChange={(e) => onInputChange("codigo_postal", e.target.value)}
            className="h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Universidad y Años de Experiencia */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="universidad"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Universidad
          </Label>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Input
              id="universidad"
              type="text"
              placeholder="UNAM, IPN, etc."
              value={formData.universidad}
              onChange={(e) => onInputChange("universidad", e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="anos_experiencia"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Años de Experiencia
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Input
              id="anos_experiencia"
              type="number"
              placeholder="5"
              min="0"
              max="50"
              value={formData.anos_experiencia}
              onChange={(e) =>
                onInputChange("anos_experiencia", e.target.value)
              }
              className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Biografía */}
      <div className="space-y-2">
        <Label
          htmlFor="biografia"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Biografía Profesional
        </Label>
        <textarea
          id="biografia"
          placeholder="Describe tu experiencia profesional, formación académica, especialidades, certificaciones, etc."
          value={formData.biografia}
          onChange={(e) => onInputChange("biografia", e.target.value)}
          className="w-full h-32 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Esta información ayudará a los pacientes a conocer más sobre tu
          experiencia y formación.
        </p>
      </div>
    </>
  );
};
