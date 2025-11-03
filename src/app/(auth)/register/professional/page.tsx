//src\app\(auth)\register\professional\page.tsx
"use client";

import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ProfessionalRegisterForm } from "@/features/auth/components/ProfessionalRegisterForm";
import { useAuth } from "@/hooks/use-auth";
import type { ProfessionalSubmitData } from "@/features/auth/components/ProfessionalRegisterForm/types";

export default function ProfessionalRegisterPage() {
  const { registerDoctor, isRegisteringDoctor } = useAuth();

  const handleRegister = async (data: ProfessionalSubmitData) => {
    console.log("\n=== 🔍 DEBUGGING INICIO ===");
    console.log("📦 Datos completos recibidos:", JSON.stringify(data, null, 2));

    // Verificar tipos de datos
    console.log("\n=== 🔢 VERIFICACIÓN DE TIPOS ===");
    console.log(
      "usuario.tipo_usuario:",
      typeof data.usuario.tipo_usuario,
      "→",
      data.usuario.tipo_usuario
    );
    console.log(
      "doctor.costo_consulta:",
      typeof data.doctor.costo_consulta,
      "→",
      data.doctor.costo_consulta
    );

    if (data.doctor.duracion_cita_minutos !== undefined) {
      console.log(
        "doctor.duracion_cita_minutos:",
        typeof data.doctor.duracion_cita_minutos,
        "→",
        data.doctor.duracion_cita_minutos
      );
    }

    if (data.doctor.latitud !== undefined) {
      console.log(
        "doctor.latitud:",
        typeof data.doctor.latitud,
        "→",
        data.doctor.latitud
      );
    }

    if (data.doctor.longitud !== undefined) {
      console.log(
        "doctor.longitud:",
        typeof data.doctor.longitud,
        "→",
        data.doctor.longitud
      );
    }

    if (data.doctor.anos_experiencia !== undefined) {
      console.log(
        "doctor.anos_experiencia:",
        typeof data.doctor.anos_experiencia,
        "→",
        data.doctor.anos_experiencia
      );
    }

    console.log(
      "doctor.acepta_seguro:",
      typeof data.doctor.acepta_seguro,
      "→",
      data.doctor.acepta_seguro
    );
    console.log(
      "doctor.atiende_domicilio:",
      typeof data.doctor.atiende_domicilio,
      "→",
      data.doctor.atiende_domicilio
    );
    console.log(
      "doctor.atiende_videollamada:",
      typeof data.doctor.atiende_videollamada,
      "→",
      data.doctor.atiende_videollamada
    );

    // Verificar horarios
    console.log("\n=== 📅 HORARIOS ===");
    console.log("Total de horarios:", data.horarios.length);
    data.horarios.forEach((horario, index) => {
      console.log(`Horario ${index + 1}:`, {
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        activo: horario.activo,
      });
    });

    // Verificar campos requeridos
    console.log("\n=== ✅ CAMPOS REQUERIDOS ===");
    const camposRequeridos = {
      "usuario.nombre": !!data.usuario.nombre,
      "usuario.apellido": !!data.usuario.apellido,
      "usuario.email": !!data.usuario.email,
      "usuario.telefono": !!data.usuario.telefono,
      "usuario.password": !!data.usuario.password,
      "usuario.tipo_usuario": !!data.usuario.tipo_usuario,
      "doctor.especialidad": !!data.doctor.especialidad,
      "doctor.cedula_profesional": !!data.doctor.cedula_profesional,
      "doctor.consultorio": !!data.doctor.consultorio,
      "doctor.costo_consulta": !!data.doctor.costo_consulta,
    };

    const camposFaltantes = Object.entries(camposRequeridos)
      .filter(([_, presente]) => !presente)
      .map(([campo]) => campo);

    if (camposFaltantes.length > 0) {
      console.error("❌ CAMPOS REQUERIDOS FALTANTES:", camposFaltantes);
    } else {
      console.log("✅ Todos los campos requeridos presentes");
    }

    // Verificar campos opcionales presentes
    console.log("\n=== 📝 CAMPOS OPCIONALES PRESENTES ===");
    const opcionalesPresentes: string[] = [];
    if (data.doctor.direccion_consultorio)
      opcionalesPresentes.push("direccion_consultorio");
    if (data.doctor.ciudad) opcionalesPresentes.push("ciudad");
    if (data.doctor.estado) opcionalesPresentes.push("estado");
    if (data.doctor.codigo_postal) opcionalesPresentes.push("codigo_postal");
    if (data.doctor.latitud !== undefined) opcionalesPresentes.push("latitud");
    if (data.doctor.longitud !== undefined)
      opcionalesPresentes.push("longitud");
    if (data.doctor.anos_experiencia !== undefined)
      opcionalesPresentes.push("anos_experiencia");
    if (data.doctor.duracion_cita_minutos !== undefined)
      opcionalesPresentes.push("duracion_cita_minutos");
    if (data.doctor.universidad) opcionalesPresentes.push("universidad");
    if (data.doctor.biografia) opcionalesPresentes.push("biografia");
    if (data.doctor.foto_url) opcionalesPresentes.push("foto_url");

    console.log(
      "Opcionales enviados:",
      opcionalesPresentes.length > 0 ? opcionalesPresentes : "Ninguno"
    );

    // Verificar validaciones específicas
    console.log("\n=== 🎯 VALIDACIONES ESPECÍFICAS ===");
    const validaciones = {
      "Email válido": data.usuario.email.includes("@"),
      "Teléfono (min 10)": data.usuario.telefono.length >= 10,
      "Password (min 8)": data.usuario.password.length >= 8,
      "Cédula (min 5)": data.doctor.cedula_profesional.length >= 5,
      "Costo > 0": data.doctor.costo_consulta > 0,
      "Al menos 1 horario": data.horarios.length > 0,
    };

    Object.entries(validaciones).forEach(([nombre, valido]) => {
      console.log(`${valido ? "✅" : "❌"} ${nombre}`);
    });

    // Mostrar JSON final que se enviará
    console.log("\n=== 📤 JSON FINAL A ENVIAR ===");
    console.log(JSON.stringify(data, null, 2));

    console.log("\n=== 🚀 ENVIANDO AL BACKEND ===");

    try {
      // Llamar a la función registerDoctor del hook
      await registerDoctor(data);
      console.log("✅ Registro completado exitosamente");
    } catch (error: any) {
      console.error("\n=== ❌ ERROR CAPTURADO ===");
      console.error("Tipo de error:", error.constructor.name);
      console.error("Mensaje:", error.message);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);

        // Si es un error 422, mostrar detalles de validación
        if (error.response.status === 422 && error.response.data?.detail) {
          console.error("\n=== 📋 DETALLES DE VALIDACIÓN (422) ===");
          error.response.data.detail.forEach((err: any, index: number) => {
            console.error(`Error ${index + 1}:`, {
              ubicación: err.loc?.join(" → "),
              mensaje: err.msg,
              tipo: err.type,
            });
          });
        }
      }

      // Re-lanzar el error para que el hook lo maneje
      throw error;
    }

    console.log("=== 🏁 DEBUGGING FIN ===\n");
  };

  return (
    <div className="space-y-6 w-full">
      <AuthHeader />
      <div className="flex justify-center w-full">
        <ProfessionalRegisterForm
          onSubmit={handleRegister}
          isLoading={isRegisteringDoctor}
        />
      </div>
    </div>
  );
}
