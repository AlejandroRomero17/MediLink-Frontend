// src/hooks/use-auth.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { UsuarioLogin, UsuarioResponse } from "@/types/api.types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { RegisterSubmitData } from "@/features/auth/components/RegisterForm/types";
import type { ProfessionalSubmitData } from "@/features/auth/components/ProfessionalRegisterForm/types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UsuarioResponse | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Register patient mutation
  const registerPatientMutation = useMutation({
    mutationFn: async (data: RegisterSubmitData) => {
      const patientData = {
        usuario: {
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
          email: data.usuario.email,
          telefono: data.usuario.telefono,
          password: data.usuario.password,
          tipo_usuario: "paciente" as const,
        },
        paciente: {
          fecha_nacimiento: data.paciente.fecha_nacimiento,
          genero: data.paciente.genero,
          direccion: data.paciente.direccion,
          ciudad: data.paciente.ciudad,
          estado: data.paciente.estado,
          codigo_postal: data.paciente.codigo_postal,
          numero_seguro: data.paciente.numero_seguro,
          alergias: data.paciente.alergias,
          tipo_sangre: data.paciente.tipo_sangre,
        },
      };

      console.log("Enviando datos de paciente:", patientData);
      const tokenResponse = await authService.registerPatient(patientData);
      return tokenResponse;
    },
    onSuccess: (response) => {
      setCurrentUser(response.usuario);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente.",
      });
      router.push("/user");
    },
    onError: (error: Error) => {
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo completar el registro.",
        variant: "destructive",
      });
    },
  });

  // Register doctor mutation - CORREGIDO ✅
  const registerDoctorMutation = useMutation({
    mutationFn: async (data: ProfessionalSubmitData) => {
      console.log("🔵 [useAuth] Datos recibidos:", data);
      console.log(
        "🟢 [useAuth] Enviando al servicio:",
        JSON.stringify(data, null, 2)
      );

      // ✅ Enviar los datos SIN transformar
      const tokenResponse = await authService.registerDoctor(data);
      return tokenResponse;
    },
    onSuccess: (response) => {
      setCurrentUser(response.usuario);

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta profesional ha sido creada.",
      });
      router.push("/doctor");
    },
    onError: (error: any) => {
      console.error("❌ Error en registro:", error);

      if (error.response?.status === 422) {
        console.error("📋 Error de validación:", error.response.data);
      }

      toast({
        title: "Error en el registro",
        description:
          error.response?.data?.detail?.[0]?.msg ||
          error.message ||
          "No se pudo completar el registro.",
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: UsuarioLogin) => {
      const response = await authService.login(credentials);
      return response;
    },
    onSuccess: (response) => {
      setCurrentUser(response.usuario);

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido ${response.usuario.nombre}`,
      });

      const redirectPath =
        response.usuario.tipo_usuario === "doctor" ? "/doctor" : "/user";
      router.push(redirectPath);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales inválidas.",
        variant: "destructive",
      });
    },
  });

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    queryClient.clear();

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    router.push("/login");
  };

  return {
    // User data
    user: currentUser,
    isAuthenticated: authService.isAuthenticated() && !!currentUser,

    // Mutations
    registerPatient: registerPatientMutation.mutate,
    registerDoctor: registerDoctorMutation.mutate,
    login: loginMutation.mutate,
    logout,

    // Mutation states
    isRegisteringPatient: registerPatientMutation.isPending,
    isRegisteringDoctor: registerDoctorMutation.isPending,
    isLoggingIn: loginMutation.isPending,

    // Errors
    registerPatientError: registerPatientMutation.error,
    registerDoctorError: registerDoctorMutation.error,
    loginError: loginMutation.error,
  };
}
