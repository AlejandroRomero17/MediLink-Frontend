//src\app\(auth)\register\professional\page.tsx
"use client";

import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { ProfessionalRegisterForm } from "@/features/auth/components/ProfessionalRegisterForm";
import { useAuth } from "@/hooks/use-auth";
import type { ProfessionalSubmitData } from "@/features/auth/components/ProfessionalRegisterForm/types";

export default function ProfessionalRegisterPage() {
  const { registerDoctor, isRegisteringDoctor } = useAuth();

  const handleRegister = (data: ProfessionalSubmitData) => {
    console.log("Datos recibidos en ProfessionalRegisterPage:", data);
    registerDoctor(data);
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
