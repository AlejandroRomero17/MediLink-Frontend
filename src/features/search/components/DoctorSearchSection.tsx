// src/features/search/components/DoctorSearchSection.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

export interface SearchFilters {
  nombre?: string;
  especialidad?: string;
  ciudad?: string;
  estado?: string;
  precio_min?: number;
  precio_max?: number;
  calificacion_min?: number;
  acepta_seguro?: boolean;
  atiende_videollamada?: boolean;
  atiende_domicilio?: boolean;
}

interface DoctorSearchSectionProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

// ✅ VALORES EN MINÚSCULAS - coinciden con tu backend
const ESPECIALIDADES = [
  { value: "medicina_general", label: "Medicina General" },
  { value: "cardiologia", label: "Cardiología" },
  { value: "pediatria", label: "Pediatría" },
  { value: "dermatologia", label: "Dermatología" },
  { value: "ginecologia", label: "Ginecología" },
  { value: "traumatologia", label: "Traumatología" },
  { value: "oftalmologia", label: "Oftalmología" },
  { value: "neurologia", label: "Neurología" },
  { value: "psiquiatria", label: "Psiquiatría" },
  { value: "urologia", label: "Urología" },
  { value: "oncologia", label: "Oncología" },
  { value: "endocrinologia", label: "Endocrinología" },
];

export function DoctorSearchSection({
  onSearch,
  isLoading,
}: DoctorSearchSectionProps) {
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("all");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");

  const handleSearch = () => {
    const filters: SearchFilters = {};

    if (nombre.trim()) filters.nombre = nombre.trim();
    // Solo agregar especialidad si no es "all"
    if (especialidad && especialidad !== "all") {
      filters.especialidad = especialidad;
    }
    if (ciudad.trim()) filters.ciudad = ciudad.trim();
    if (estado.trim()) filters.estado = estado.trim();

    console.log("🔍 Buscando con filtros:", filters);
    onSearch(filters);
  };

  const handleClearFilters = () => {
    setNombre("");
    setEspecialidad("all");
    setCiudad("");
    setEstado("");
    onSearch({});
  };

  const hasFilters =
    nombre || (especialidad && especialidad !== "all") || ciudad || estado;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 border-none shadow-lg">
        <div className="space-y-4">
          {/* Título */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Encuentra tu doctor ideal
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Busca por especialidad, nombre o ubicación
            </p>
          </div>

          {/* Campos de búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Búsqueda por nombre */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre del doctor..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 h-12 bg-white dark:bg-slate-900"
                disabled={isLoading}
              />
            </div>

            {/* Especialidad */}
            <div className="md:col-span-3">
              <Select
                value={especialidad}
                onValueChange={setEspecialidad}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-slate-900">
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {ESPECIALIDADES.map((esp) => (
                    <SelectItem key={esp.value} value={esp.value}>
                      {esp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ciudad */}
            <div className="md:col-span-3 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 h-12 bg-white dark:bg-slate-900"
                disabled={isLoading}
              />
            </div>

            {/* Botón de búsqueda */}
            <div className="md:col-span-1">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Search className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleClearFilters}
              disabled={isLoading}
            >
              <Filter className="h-3 w-3 mr-2" />
              Ver todos
            </Button>

            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                <X className="h-3 w-3 mr-2" />
                Limpiar filtros
              </Button>
            )}

            {/* Filtros rápidos por especialidad - VALORES EN MINÚSCULAS */}
            {["cardiologia", "pediatria", "dermatologia"].map((esp) => {
              const espData = ESPECIALIDADES.find((e) => e.value === esp);
              return (
                <Button
                  key={esp}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setEspecialidad(esp);
                    onSearch({ especialidad: esp });
                  }}
                  disabled={isLoading}
                >
                  {espData?.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
