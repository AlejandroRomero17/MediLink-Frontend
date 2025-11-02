// src/features/auth/components/ProfessionalRegisterForm/index.tsx
"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ProfessionalInfoStep } from "./steps/ProfessionalInfoStep";
import { AdditionalInfoStep } from "./steps/AdditionalInfoStep";
import { SocialAuthButtons } from "../SocialAuthButtons";
import type { ProfessionalFormData, ProfessionalSubmitData } from "./types";

interface ProfessionalRegisterFormProps {
  onSubmit: (data: ProfessionalSubmitData) => void;
  isLoading?: boolean;
}

const STEP_TITLES = {
  1: "Información básica",
  2: "Información profesional",
  3: "Información adicional",
};

const STEP_DESCRIPTIONS = {
  1: "Completa tus datos personales",
  2: "Datos principales de tu práctica",
  3: "Ubicación y experiencia (opcional)",
};

export const ProfessionalRegisterForm = ({
  onSubmit,
  isLoading,
}: ProfessionalRegisterFormProps) => {
  const [step, setStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState<ProfessionalFormData>({
    // Paso 1 - Información básica
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    // Paso 2 - Información profesional
    especialidad: "" as any,
    cedula_profesional: "",
    consultorio: "",
    costo_consulta: "",
    horario_atencion: "",
    // Paso 3 - Información adicional (opcional)
    direccion_consultorio: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    anos_experiencia: "",
    universidad: "",
    biografia: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ==================== PASO 1 ====================
    if (step === 1) {
      // Validar que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      // Validar que aceptó los términos
      if (!acceptTerms) {
        alert("Debes aceptar los términos y condiciones");
        return;
      }

      // Avanzar al paso 2
      setStep(2);
      return;
    }

    // ==================== PASO 2 ====================
    if (step === 2) {
      // Validar que todos los campos requeridos estén llenos
      if (
        !formData.especialidad ||
        !formData.cedula_profesional ||
        !formData.consultorio ||
        !formData.costo_consulta ||
        !formData.horario_atencion
      ) {
        alert("Por favor completa todos los campos profesionales requeridos");
        return;
      }

      // Validar que el costo sea válido
      const costoNumerico = parseFloat(formData.costo_consulta);
      if (isNaN(costoNumerico) || costoNumerico <= 0) {
        alert("Por favor ingresa un costo de consulta válido");
        return;
      }

      // Avanzar al paso 3
      setStep(3);
      return;
    }

    // ==================== PASO 3 - ENVIAR ====================
    const submitData: ProfessionalSubmitData = {
      usuario: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        tipo_usuario: "doctor",
      },
      doctor: {
        // Campos requeridos del paso 2
        especialidad: formData.especialidad,
        cedula_profesional: formData.cedula_profesional,
        consultorio: formData.consultorio,
        horario_atencion: formData.horario_atencion,
        costo_consulta: parseFloat(formData.costo_consulta),
        // Campos opcionales del paso 3
        direccion_consultorio: formData.direccion_consultorio || undefined,
        ciudad: formData.ciudad || undefined,
        estado: formData.estado || undefined,
        codigo_postal: formData.codigo_postal || undefined,
        anos_experiencia: formData.anos_experiencia
          ? parseInt(formData.anos_experiencia)
          : undefined,
        universidad: formData.universidad || undefined,
        biografia: formData.biografia || undefined,
      },
    };

    console.log("Datos a enviar:", submitData);
    onSubmit(submitData);
  };

  const handleInputChange = (
    field: keyof ProfessionalFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validación del paso 1
  const isStep1Valid = () => {
    return (
      formData.nombre.length >= 2 &&
      formData.apellido.length >= 2 &&
      formData.email.includes("@") &&
      formData.telefono.length >= 10 &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      acceptTerms
    );
  };

  // Validación del paso 2
  const isStep2Valid = () => {
    return (
      formData.especialidad &&
      formData.cedula_profesional.length >= 5 &&
      formData.consultorio.length >= 3 &&
      formData.costo_consulta &&
      parseFloat(formData.costo_consulta) > 0 &&
      formData.horario_atencion.length >= 5
    );
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <ProfessionalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <AdditionalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  // Texto del botón según el paso
  const getButtonText = () => {
    if (isLoading) return "Creando cuenta...";
    if (step === 1) return "Continuar";
    if (step === 2) return "Siguiente";
    return "Completar registro";
  };

  return (
    <div className="w-full max-w-6xl grid lg:grid-cols-2 min-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 mx-auto border border-gray-200 dark:border-slate-800">
      {/* ==================== LADO IZQUIERDO ==================== */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="absolute inset-0">
          <Image
            src="/assets/landing/img_profesionistas.png"
            alt="Profesionales de la salud"
            fill
            sizes="(max-width: 1024px) 0vw, 50vw"
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="relative z-10 text-white p-12 space-y-6 max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <Stethoscope className="h-12 w-12 text-white" />
            <span className="text-3xl font-bold text-white">
              Medi<span className="text-blue-200">Link</span>
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Únete como profesional
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Expande tu práctica y conecta con miles de pacientes que buscan tus
            servicios profesionales.
          </p>

          <div className="pt-8 space-y-4">
            {[
              {
                title: "Gestión de pacientes",
                desc: "Administra tu consulta desde una sola plataforma",
              },
              {
                title: "Agenda inteligente",
                desc: "Control total de tus citas y horarios",
              },
              {
                title: "Perfil verificado",
                desc: "Aumenta tu credibilidad y confianza",
              },
              {
                title: "Sin comisiones",
                desc: "Cobra directamente por tus servicios",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== LADO DERECHO ==================== */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-6">
          {/* Header con título y progreso */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {STEP_TITLES[step as keyof typeof STEP_TITLES]}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {STEP_DESCRIPTIONS[step as keyof typeof STEP_DESCRIPTIONS]}
            </p>

            {/* Indicador de progreso (3 bolitas) */}
            <div className="flex justify-center lg:justify-start space-x-2 mt-4">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step === stepNum
                      ? "bg-blue-500"
                      : step > stepNum
                      ? "bg-blue-300 dark:bg-blue-700"
                      : "bg-gray-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Renderizar el paso actual */}
            {renderStep()}

            {/* Términos y condiciones (solo en paso 1) */}
            {step === 1 && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                  className="border-gray-300 dark:border-slate-700 mt-1"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Acepto los{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    términos y condiciones
                  </a>{" "}
                  para profesionales
                </Label>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex gap-3">
              {/* Botón Atrás (solo si no es el paso 1) */}
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  disabled={isLoading}
                >
                  Atrás
                </Button>
              )}

              {/* Botón Continuar/Siguiente/Completar */}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (step === 1 && !isStep1Valid()) ||
                  (step === 2 && !isStep2Valid())
                }
                className={`${
                  step > 1 ? "flex-1" : "w-full"
                } h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {getButtonText()}
              </Button>
            </div>
          </form>

          {/* Social auth y links (solo en paso 1) */}
          {step === 1 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 dark:bg-slate-950 px-4 text-gray-600 dark:text-gray-400">
                    o continúa con
                  </span>
                </div>
              </div>

              <SocialAuthButtons />

              <div className="space-y-3 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
                <div className="pt-2 border-t border-gray-200 dark:border-slate-800">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    <Stethoscope className="h-4 w-4" />
                    ¿Eres paciente? Regístrate aquí
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
