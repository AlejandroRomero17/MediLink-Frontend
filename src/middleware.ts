// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔍 DEBUG: Ver todas las cookies disponibles
  const allCookies = request.cookies.getAll();
  console.log("🍪 Todas las cookies:", allCookies);

  // Obtener token de las cookies
  const token = request.cookies.get("access_token")?.value;
  console.log("🔑 Token encontrado:", token ? "SÍ" : "NO");

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/register/professional",
    "/forgot-password",
  ];

  // Rutas de API y assets que no deben ser protegidas
  const isPublicPath =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") || // ⭐ Cambié esto para incluir TODAS las rutas de API
    pathname.startsWith("/assets") ||
    pathname.includes(".");

  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    console.log("✅ Ruta pública permitida:", pathname);
    return NextResponse.next();
  }

  // Si no hay token y está intentando acceder a una ruta protegida
  if (!token) {
    console.log("🔒 No hay token - redirigiendo a login desde:", pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token, verificar rutas específicas por rol
  try {
    // Decodificar el JWT (solo la parte del payload)
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    console.log("👤 Payload decodificado:", payload);

    const userType = payload.tipo_usuario;
    console.log("🏷️ Tipo de usuario:", userType);

    // Proteger rutas de doctor para solo doctores
    if (pathname.startsWith("/doctor") && userType !== "doctor") {
      console.log("⛔ Usuario tipo", userType, "intentando acceder a /doctor");
      return NextResponse.redirect(new URL("/user", request.url));
    }

    // Proteger rutas de user/paciente para solo pacientes
    if (pathname.startsWith("/user") && userType !== "paciente") {
      console.log("⛔ Usuario tipo", userType, "intentando acceder a /user");
      return NextResponse.redirect(new URL("/doctor", request.url));
    }

    console.log("✅ Acceso permitido a:", pathname);
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Error al decodificar token:", error);
    // Token inválido, redirigir a login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
