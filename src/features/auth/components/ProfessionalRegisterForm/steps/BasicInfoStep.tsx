// src/features/auth/components/ProfessionalRegisterForm/steps/BasicInfoStep.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfessionalFormData } from "../types";

interface BasicInfoStepProps {
  formData: ProfessionalFormData;
  onInputChange: (field: keyof ProfessionalFormData, value: string) => void;
  isLoading?: boolean;
}

export const BasicInfoStep = ({
  formData,
  onInputChange,
  isLoading,
}: BasicInfoStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="nombre"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Nombre *
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Input
              id="nombre"
              type="text"
              placeholder="Juan"
              value={formData.nombre}
              onChange={(e) => onInputChange("nombre", e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              required
              minLength={2}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="apellido"
            className="text-gray-900 dark:text-gray-200 font-medium"
          >
            Apellido *
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Input
              id="apellido"
              type="text"
              placeholder="Pérez"
              value={formData.apellido}
              onChange={(e) => onInputChange("apellido", e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              required
              minLength={2}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Correo electrónico *
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="doctor@email.com"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label
          htmlFor="telefono"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Teléfono *
        </Label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="telefono"
            type="tel"
            placeholder="5512345678"
            value={formData.telefono}
            onChange={(e) => onInputChange("telefono", e.target.value)}
            className="pl-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            required
            minLength={10}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Contraseña *
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className="pl-12 pr-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            required
            minLength={8}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirmar Contraseña */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-gray-900 dark:text-gray-200 font-medium"
        >
          Confirmar contraseña *
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            className="pl-12 pr-12 h-12 rounded-xl border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            required
            minLength={8}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};
