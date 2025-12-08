// ============================================
// 📁 src/app/api/auth/[...nextauth]/route.ts
// ============================================
import { handlers } from "@/features/auth/config/auth";

export const { GET, POST } = handlers;

// ⭐ IMPORTANTE: Especificar el runtime
export const runtime = "nodejs";
