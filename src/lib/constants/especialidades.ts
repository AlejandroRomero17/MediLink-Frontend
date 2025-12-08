// src/lib/constants/especialidades.ts

export const ESPECIALIDADES = [
  { value: "medicina_general", label: "Medicina General" },
  { value: "cardiologia", label: "Cardiología" },
  { value: "dermatologia", label: "Dermatología" },
  { value: "ginecologia", label: "Ginecología" },
  { value: "neurologia", label: "Neurología" },
  { value: "oftalmologia", label: "Oftalmología" },
  { value: "pediatria", label: "Pediatría" },
  { value: "traumatologia", label: "Traumatología" },
  { value: "psiquiatria", label: "Psiquiatría" },
  { value: "urologia", label: "Urología" },
  { value: "oncologia", label: "Oncología" },
  { value: "endocrinologia", label: "Endocrinología" },
] as const;

export type EspecialidadValue = (typeof ESPECIALIDADES)[number]["value"];

/**
 * Normaliza una especialidad a su valor correcto del backend
 * @param especialidad - La especialidad en cualquier formato
 * @returns La especialidad normalizada o undefined si no es válida
 */
export function normalizeEspecialidad(
  especialidad: string | undefined
): string | undefined {
  if (!especialidad) return undefined;

  // Convertir a minúsculas y reemplazar espacios con guiones bajos
  const normalized = especialidad
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u");

  // Verificar si existe en las especialidades válidas
  const existe = ESPECIALIDADES.some((e) => e.value === normalized);

  if (!existe) {
    console.warn(
      `⚠️ Especialidad no válida: "${especialidad}" -> normalizada: "${normalized}"`
    );
    return undefined;
  }

  return normalized;
}

/**
 * Obtiene el label de una especialidad por su value
 */
export function getEspecialidadLabel(value: string): string {
  const especialidad = ESPECIALIDADES.find((e) => e.value === value);
  return especialidad?.label || value;
}

/**
 * Convierte un texto a formato de especialidad válido
 * Ejemplo: "CARDIOLOGIA" -> "cardiologia"
 * Ejemplo: "Medicina General" -> "medicina_general"
 */
export function toEspecialidadValue(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u");
}
