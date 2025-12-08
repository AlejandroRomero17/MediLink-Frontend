// src/features/search/components/DoctorList.tsx
"use client";

import { DoctorCard } from "./DoctorCard";
import { AlertCircle, SearchX, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import type { Doctor } from "@/hooks/use-doctors";

interface DoctorListProps {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
  onScheduleAppointment?: (doctorId: number) => void;
}

export function DoctorList({
  doctors,
  isLoading,
  error,
  onScheduleAppointment,
}: DoctorListProps) {
  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-600" />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          Buscando doctores disponibles...
        </p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar doctores</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Sin resultados
  if (!doctors || doctors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-4"
      >
        <SearchX className="h-16 w-16 text-gray-400" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron doctores
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Intenta ajustar los filtros de búsqueda, buscar por otra
            especialidad o verifica la ubicación.
          </p>
        </div>
      </motion.div>
    );
  }

  // Lista de doctores
  return (
    <div className="space-y-6">
      {/* Contador de resultados */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between border-b pb-3"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resultados de búsqueda
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {doctors.length}{" "}
            {doctors.length === 1
              ? "doctor encontrado"
              : "doctores encontrados"}
          </p>
        </div>
      </motion.div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <DoctorCard
              doctor={doctor}
              onScheduleAppointment={onScheduleAppointment}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
