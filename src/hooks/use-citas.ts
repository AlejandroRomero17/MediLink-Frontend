// src/hooks/use-citas.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  citasService,
  CitaCreate,
  CitaCancelar,
} from "@/services/citas-service";
import { useToast } from "@/hooks/use-toast";
import { ApiError, ValidationError } from "@/types/api.types";

// Tipo para errores de Axios
interface AxiosError {
  response?: {
    data?: ApiError;
  };
  message: string;
}

// Tipo para verificar si un error es de Axios
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    (("response" in error && typeof error.response === "object") || true)
  );
}

// ⭐ Helper para extraer mensaje de error
function extractErrorMessage(
  detail: string | ValidationError[] | undefined
): string {
  if (!detail) return "Error desconocido";

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    // Tomar el primer error de validación
    const firstError = detail[0];
    return firstError.msg || "Error de validación";
  }

  return "Error desconocido";
}

export function useCitas() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Verificar si hay token antes de hacer queries
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("access_token");

  console.log("🔍 [useCitas] Token disponible:", hasToken);

  // Query: Obtener todas las citas
  const {
    data: citas,
    isLoading: isLoadingCitas,
    refetch: refetchCitas,
    error: errorCitas,
  } = useQuery({
    queryKey: ["citas"],
    queryFn: () => citasService.obtenerMisCitas(),
    enabled: hasToken,
    retry: 1,
  });

  // Query: Obtener próximas citas
  const {
    data: proximasCitas,
    isLoading: isLoadingProximas,
    error: errorProximas,
  } = useQuery({
    queryKey: ["citas", "proximas"],
    queryFn: () => citasService.obtenerProximasCitas(5),
    enabled: hasToken,
    retry: 1,
  });

  // Query: Obtener estadísticas
  const {
    data: estadisticas,
    isLoading: isLoadingEstadisticas,
    error: errorEstadisticas,
  } = useQuery({
    queryKey: ["citas", "estadisticas"],
    queryFn: () => citasService.obtenerEstadisticas(),
    enabled: hasToken,
    retry: 1,
  });

  // Log de errores
  if (errorCitas) console.error("❌ Error citas:", errorCitas);
  if (errorProximas) console.error("❌ Error próximas:", errorProximas);
  if (errorEstadisticas)
    console.error("❌ Error estadísticas:", errorEstadisticas);

  // Mutation: Crear cita
  const crearCitaMutation = useMutation({
    mutationFn: (data: CitaCreate) => citasService.crearCita(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      queryClient.invalidateQueries({ queryKey: ["citas", "proximas"] });
      queryClient.invalidateQueries({ queryKey: ["citas", "estadisticas"] });

      toast({
        title: "✅ Cita creada",
        description: "Tu cita ha sido agendada exitosamente.",
      });
    },
    onError: (error: unknown) => {
      let errorMessage = "No se pudo crear la cita.";

      if (isAxiosError(error)) {
        // ⭐ Usar helper para extraer mensaje
        const detail = error.response?.data?.detail;
        errorMessage =
          extractErrorMessage(detail) || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "❌ Error al crear cita",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Mutation: Cancelar cita
  const cancelarCitaMutation = useMutation({
    mutationFn: ({ citaId, data }: { citaId: number; data: CitaCancelar }) =>
      citasService.cancelarCita(citaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      queryClient.invalidateQueries({ queryKey: ["citas", "proximas"] });
      queryClient.invalidateQueries({ queryKey: ["citas", "estadisticas"] });

      toast({
        title: "🚫 Cita cancelada",
        description: "La cita ha sido cancelada exitosamente.",
      });
    },
    onError: (error: unknown) => {
      let errorMessage = "No se pudo cancelar la cita.";

      if (isAxiosError(error)) {
        // ⭐ Usar helper para extraer mensaje
        const detail = error.response?.data?.detail;
        errorMessage =
          extractErrorMessage(detail) || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "❌ Error al cancelar",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Función para crear cita con callbacks
  const crearCita = (
    citaData: CitaCreate,
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  ) => {
    crearCitaMutation.mutate(citaData, {
      onSuccess: () => {
        options?.onSuccess?.();
      },
      onError: (error: unknown) => {
        options?.onError?.(error);
      },
    });
  };

  return {
    // Data
    citas: citas || [],
    proximasCitas: proximasCitas || [],
    estadisticas,

    // Loading states
    isLoadingCitas,
    isLoadingProximas,
    isLoadingEstadisticas,

    // Actions
    crearCita,
    cancelarCita: (citaId: number, motivo: string) =>
      cancelarCitaMutation.mutate({
        citaId,
        data: { motivo_cancelacion: motivo },
      }),
    refetchCitas,

    // Mutation states
    isCreatingCita: crearCitaMutation.isPending,
    isCancelingCita: cancelarCitaMutation.isPending,
  };
}
