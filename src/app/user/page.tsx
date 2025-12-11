// src/app/user/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// ❌ REMOVIDO: import { PWAManager } from "@/components/shared";
import { NearbyDoctorsMap } from "@/features/dashboard-user/components/nearby-doctors-map";
import { QuickActionsSection } from "@/features/dashboard-user/components/quick-actions";
import { SpecialtiesSection } from "@/features/dashboard-user/components/specialties";
import { UpcomingAppointments } from "@/features/dashboard-user/components/upcoming-appointments";
import { DoctorList } from "@/features/search/components/DoctorList";
import { DoctorSearchSection } from "@/features/search/components/DoctorSearchSection";
import { useCitas } from "@/hooks/use-citas";
import { Doctor, SearchFilters, useDoctors } from "@/hooks/use-doctors";
// ❌ REMOVIDO: import { useAuth } from "@/hooks/use-auth";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function UserDashboardPage() {
  const { estadisticas, isLoadingEstadisticas } = useCitas();
  // ❌ REMOVIDO: const { user } = useAuth();
  const {
    searchDoctors,
    isLoading,
    error,
    operationType,
    fetchAllDoctors,
    fetchBestRated,
  } = useDoctors();
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const hasLoadedInitial = useRef(false);

  // Evitar hidratación - se ejecuta solo una vez
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar doctores mejor valorados solo una vez al montar
  useEffect(() => {
    const loadInitialDoctors = async () => {
      if (!hasLoadedInitial.current && isClient && !isLoading) {
        hasLoadedInitial.current = true;
        try {
          console.log("Cargando doctores mejor valorados iniciales...");
          const bestRated = await fetchBestRated();
          setSearchResults(bestRated);
        } catch (err) {
          console.error("Error cargando doctores iniciales:", err);
        }
      }
    };

    loadInitialDoctors();
  }, [isClient, fetchBestRated, isLoading]);

  // Manejar la búsqueda de doctores - memoizado
  const handleSearch = useCallback(
    async (filters: SearchFilters) => {
      try {
        console.log("Iniciando búsqueda con filtros:", filters);
        const results = await searchDoctors(filters);
        const doctoresArray = Array.isArray(results) ? results : [];

        setSearchResults(doctoresArray);
        setShowAllDoctors(false);

        if (doctoresArray.length > 0) {
          toast.success(`Encontrados ${doctoresArray.length} doctores`);
        } else {
          toast.info("No se encontraron doctores con esos criterios");
        }
      } catch (err) {
        console.error("Error en búsqueda:", err);
        setSearchResults([]);
        toast.error("Error al buscar doctores");
      }
    },
    [searchDoctors]
  );

  // Cargar todos los doctores - memoizado
  const handleLoadAllDoctors = useCallback(async () => {
    if (isLoading) return;

    try {
      console.log("Cargando todos los doctores...");
      const allDoctors = await fetchAllDoctors();
      const doctoresArray = Array.isArray(allDoctors) ? allDoctors : [];

      setSearchResults(doctoresArray);
      setShowAllDoctors(true);

      if (doctoresArray.length > 0) {
        toast.success(`${doctoresArray.length} doctores cargados`);
      } else {
        toast.info("No hay doctores disponibles");
      }
    } catch (err) {
      console.error("Error cargando todos los doctores:", err);
      setSearchResults([]);
      toast.error("Error al cargar doctores");
    }
  }, [fetchAllDoctors, isLoading]);

  // Cargar doctores mejor valorados - memoizado
  const handleLoadBestRated = useCallback(async () => {
    if (isLoading) return;

    try {
      console.log("Cargando doctores mejor valorados...");
      const bestRated = await fetchBestRated();
      const doctoresArray = Array.isArray(bestRated) ? bestRated : [];

      setSearchResults(doctoresArray);
      setShowAllDoctors(false);

      if (doctoresArray.length > 0) {
        toast.success(
          `${doctoresArray.length} doctores mejor valorados cargados`
        );
      } else {
        toast.info("No hay doctores mejor valorados disponibles");
      }
    } catch (err) {
      console.error("Error cargando doctores mejor valorados:", err);
      setSearchResults([]);
      toast.error("Error al cargar doctores");
    }
  }, [fetchBestRated, isLoading]);

  // Manejar agendar cita - memoizado
  const handleScheduleAppointment = useCallback((doctorId: number) => {
    console.log(`Cita solicitada para doctor ID: ${doctorId}`);
  }, []);

  // Mostrar loader de hidratación
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="section-padding space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
            <Skeleton className="h-4 w-64 md:w-96" />
          </div>

          {/* Estadísticas Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-3 md:p-4 glass">
                <div className="space-y-2 md:space-y-3">
                  <Skeleton className="h-4 w-4 md:h-5 md:w-5" />
                  <Skeleton className="h-6 md:h-8 w-full" />
                  <Skeleton className="h-3 md:h-4 w-16 md:w-20" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Componente para mostrar estadísticas
  const renderEstadisticas = () => {
    if (isLoadingEstadisticas) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-3 md:p-4 glass animate-pulse">
              <div className="space-y-2 md:space-y-3">
                <Skeleton className="h-4 w-4 md:h-5 md:w-5" />
                <Skeleton className="h-6 md:h-8 w-full" />
                <Skeleton className="h-3 md:h-4 w-16 md:w-20" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (!estadisticas) return null;

    const stats = [
      {
        icon: Calendar,
        label: "Total",
        value: estadisticas.total,
        description: "Citas registradas",
        color: "text-blue-500 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        valueColor: "text-blue-600 dark:text-blue-400",
      },
      {
        icon: Clock,
        label: "Pendientes",
        value: estadisticas.pendientes,
        description: "Por confirmar",
        color: "text-amber-500 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        valueColor: "text-amber-600 dark:text-amber-400",
      },
      {
        icon: Activity,
        label: "Confirmadas",
        value: estadisticas.confirmadas,
        description: "Próximamente",
        color: "text-emerald-500 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        valueColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: CheckCircle,
        label: "Completadas",
        value: estadisticas.completadas,
        description: "Historial",
        color: "text-cyan-500 dark:text-cyan-400",
        bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
        valueColor: "text-cyan-600 dark:text-cyan-400",
      },
      {
        icon: XCircle,
        label: "Canceladas",
        value: estadisticas.canceladas,
        description: "Total",
        color: "text-red-500 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        valueColor: "text-red-600 dark:text-red-400",
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="card-responsive glass hover:shadow-glow-primary group transition-all duration-300 animate-slide-up border-border/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div
                    className={`p-2 rounded-lg ${stat.bgColor} transition-transform group-hover:scale-110`}
                  >
                    <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>

                {/* Valor */}
                <p
                  className={`text-2xl md:text-3xl font-bold ${stat.valueColor} mb-1 md:mb-2 group-hover:scale-105 transition-transform`}
                >
                  {stat.value}
                </p>

                {/* Descripción */}
                <p className="text-[10px] md:text-xs text-muted-foreground mt-auto">
                  {stat.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="section-padding space-y-4 md:space-y-6 lg:space-y-8">
        {/* Header del Dashboard */}
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Mi Dashboard de Salud
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Gestiona tus citas y encuentra doctores cerca de ti
              </p>
            </div>

            {/* Badge decorativo - solo desktop */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Bienvenido de vuelta
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="animate-slide-up animation-delay-100">
          {renderEstadisticas()}
        </div>

        {/* ❌ SECCIÓN PWA REMOVIDA - Ahora está en el header */}

        {/* Buscador principal */}
        <div className="animate-slide-up animation-delay-200">
          <DoctorSearchSection onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Sección de Doctores */}
        <div className="space-y-4 md:space-y-6 animate-slide-up animation-delay-300">
          {/* Header de sección con acciones */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Doctores Disponibles
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {showAllDoctors ? (
                    <>
                      <Users className="h-3 w-3" />
                      Todos los doctores
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      Mejor valorados
                    </>
                  )}
                </span>
                {isLoading && operationType && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 animate-pulse">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                    {operationType === "fetchBestRated"
                      ? "Cargando mejor valorados..."
                      : operationType === "searchDoctors"
                      ? "Buscando..."
                      : "Cargando..."}
                  </span>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <Button
                variant="outline"
                onClick={handleLoadAllDoctors}
                disabled={isLoading || showAllDoctors}
                className="text-xs md:text-sm h-9 md:h-10 px-3 md:px-4 glass hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50"
              >
                <Users className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                Ver todos
              </Button>
              <Button
                onClick={handleLoadBestRated}
                disabled={isLoading || !showAllDoctors}
                variant="default"
                className="text-xs md:text-sm h-9 md:h-10 px-3 md:px-4 bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                Mejor valorados
              </Button>
            </div>
          </div>

          {/* Lista de doctores */}
          <DoctorList
            doctors={searchResults}
            isLoading={isLoading}
            error={error}
            onScheduleAppointment={handleScheduleAppointment}
          />
        </div>

        {/* Grid de secciones adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-slide-up animation-delay-500">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="glass rounded-xl md:rounded-2xl border border-border/50 overflow-hidden hover:shadow-glow-primary transition-all duration-300">
              <NearbyDoctorsMap />
            </div>
            <div className="glass rounded-xl md:rounded-2xl border border-border/50 overflow-hidden hover:shadow-glow-secondary transition-all duration-300">
              <SpecialtiesSection />
            </div>
          </div>

          {/* Sidebar derecho */}
          <div className="space-y-4 md:space-y-6">
            <div className="glass rounded-xl md:rounded-2xl border border-border/50 overflow-hidden hover:shadow-glow-primary transition-all duration-300">
              <QuickActionsSection />
            </div>
            <div className="glass rounded-xl md:rounded-2xl border border-border/50 overflow-hidden hover:shadow-glow-secondary transition-all duration-300">
              <UpcomingAppointments />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
