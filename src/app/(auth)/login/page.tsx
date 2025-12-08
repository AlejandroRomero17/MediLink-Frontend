// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, AuthHeader, AuthFooter } from "@/features/auth/components";
import { authService } from "@/services/auth-service";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    email: string,
    password: string,
  ) => {
    setIsLoading(true);

    try {
      console.log("🔵 Iniciando login...");

      // Llamar al servicio de autenticación
      const response = await authService.login({ email, password });

      console.log("✅ Login exitoso:", response.usuario);

      toast({
        title: "✅ Inicio de sesión exitoso",
        description: `Bienvenido ${response.usuario.nombre}`,
      });

      // Redirigir según el tipo de usuario
      const redirectTo =
        response.usuario.tipo_usuario === "doctor" ? "/doctor" : "/user";

      console.log("🔄 Redirigiendo a:", redirectTo);

      // Usar window.location para forzar recarga completa y que el middleware detecte la cookie
      window.location.href = redirectTo;
    } catch (error: unknown) {
  console.error("❌ Error en login:", error);

  let errorMessage = "Credenciales inválidas";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: { detail?: string } } };
    errorMessage = axiosError.response?.data?.detail || errorMessage;
  }

  toast({
    title: "❌ Error al iniciar sesión",
    description: errorMessage,
    variant: "destructive",
  });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="space-y-6 w-full">
      <AuthHeader />
      <div className="flex justify-center w-full">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Iniciando sesión...
              </p>
            </div>
          </div>
        ) : (
          <LoginForm
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
          />
        )}
      </div>
      <AuthFooter />
    </div>
  );
}
