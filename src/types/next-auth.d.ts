// ============================================
// 📁 src/types/next-auth.d.ts
// ============================================
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tipo_usuario?: string; // ← Cambiado de "role" a "tipo_usuario" (tu API usa esto)
      telefono?: string;
      accessToken?: string; // ← Necesario para llamadas a la API
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    tipo_usuario?: string; // ← Debe coincidir con tu API
    telefono?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tipo_usuario?: string;
    telefono?: string;
    accessToken?: string;
  }
}
