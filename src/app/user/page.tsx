// src/app/user/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NearbyDoctorsMap } from "@/features/dashboard-user/components/nearby-doctors-map";
import { QuickActionsSection } from "@/features/dashboard-user/components/quick-actions";
import { SpecialtiesSection } from "@/features/dashboard-user/components/specialties";
import { UpcomingAppointments } from "@/features/dashboard-user/components/upcoming-appointments";
import { DoctorList } from "@/features/search/components/DoctorList";
import { DoctorSearchSection } from "@/features/search/components/DoctorSearchSection";
import { useCitas } from "@/hooks/use-citas";
import { Doctor, SearchFilters, useDoctors } from "@/hooks/use-doctors";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function UserDashboardPage() {
  const { estadisticas, isLoadingEstadisticas } = useCitas();
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
      // Verificar múltiples condiciones para evitar ejecuciones innecesarias
      if (!hasLoadedInitial.current && isClient && !isLoading) {
        hasLoadedInitial.current = true;
        try {
          console.log("Cargando doctores mejor valorados iniciales...");
          const bestRated = await fetchBestRated();
          setSearchResults(bestRated);
        } catch (err) {
          console.error("Error cargando doctores iniciales:", err);
          // Opcional: Mostrar un toast de error
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

        // ⭐ FIX: Verificar que results sea un array
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
        setSearchResults([]); // ⭐ FIX: Establecer array vacío en caso de error
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

      // ⭐ FIX: Verificar que allDoctors sea un array
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
      setSearchResults([]); // ⭐ FIX: Establecer array vacío
      toast.error("Error al cargar doctores");
    }
  }, [fetchAllDoctors, isLoading]);

  // Cargar doctores mejor valorados - memoizado
  const handleLoadBestRated = useCallback(async () => {
    if (isLoading) return;

    try {
      console.log("Cargando doctores mejor valorados...");
      const bestRated = await fetchBestRated();

      // ⭐ FIX: Verificar que bestRated sea un array
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
      setSearchResults([]); // ⭐ FIX: Establecer array vacío
      toast.error("Error al cargar doctores");
    }
  }, [fetchBestRated, isLoading]);

  // Manejar agendar cita - memoizado
  const handleScheduleAppointment = useCallback((doctorId: number) => {
    console.log(`Cita solicitada para doctor ID: ${doctorId}`);
    // Si quieres hacer algo cuando se hace clic en agendar cita
    // puedes agregarlo aquí, como tracking o analytics
  }, []);

  // Mostrar loader de hidratación
  if (!isClient) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64 mb-4" />
        {/* Estadísticas Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Componente para mostrar estadísticas
  const renderEstadisticas = () => {
    if (isLoadingEstadisticas) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (!estadisticas) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {estadisticas.total}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Citas registradas
            </p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Pendientes
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
              {estadisticas.pendientes}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Por confirmar
            </p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Confirmadas
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
              {estadisticas.confirmadas}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Próximamente
            </p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Completadas
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              {estadisticas.completadas}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Historial
            </p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Canceladas
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-500">
              {estadisticas.canceladas}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total
            </p>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mi Dashboard de Salud
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus citas y encuentra doctores cerca de ti
          </p>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      {renderEstadisticas()}

      {/* Buscador principal */}
      <DoctorSearchSection onSearch={handleSearch} isLoading={isLoading} />

      {/* Acciones adicionales */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Doctores Disponibles
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {showAllDoctors ? "Todos los doctores" : "Doctores mejor valorados"}
            {isLoading && operationType && (
              <span className="ml-2 text-blue-500">
                (
                {operationType === "fetchBestRated"
                  ? "Cargando mejor valorados..."
                  : operationType === "searchDoctors"
                  ? "Buscando..."
                  : "Cargando..."}
                )
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleLoadAllDoctors}
            disabled={isLoading || showAllDoctors}
          >
            Ver todos los doctores
          </Button>
          <Button
            onClick={handleLoadBestRated}
            disabled={isLoading || !showAllDoctors}
            variant="secondary"
          >
            Ver mejor valorados
          </Button>
        </div>
      </div>

      {/* Lista de doctores usando el componente profesional */}
      <DoctorList
        doctors={searchResults}
        isLoading={isLoading}
        error={error}
        onScheduleAppointment={handleScheduleAppointment}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <NearbyDoctorsMap />
          <SpecialtiesSection />
        </div>

        {/* Sidebar derecho */}
        <div className="space-y-6">
          <QuickActionsSection />
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  );
}
