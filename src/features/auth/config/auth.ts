// ============================================
// 📁 src/features/auth/config/auth.ts
// ============================================
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Credenciales faltantes");
          return null;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          if (!apiUrl) {
            console.error("❌ NEXT_PUBLIC_API_URL no está definida");
            throw new Error("Configuración del servidor incorrecta");
          }

          console.log(
            "🔄 Intentando login en:",
            `${apiUrl}/api/usuarios/login`
          );

          // ⭐ LLAMADA A TU API DE FASTAPI
          const res = await fetch(`${apiUrl}/api/usuarios/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("📡 Respuesta del backend:", res.status);

          if (!res.ok) {
            const error = await res
              .json()
              .catch(() => ({ detail: "Error desconocido" }));
            console.error("❌ Error del backend:", error);
            return null;
          }

          const data = await res.json();
          console.log("✅ Login exitoso:", {
            email: data.usuario.email,
            tipo: data.usuario.tipo_usuario,
          });

          // ⭐ RETORNAR EN EL FORMATO QUE TU API ENVÍA
          return {
            id: data.usuario.id.toString(),
            email: data.usuario.email,
            name: `${data.usuario.nombre} ${data.usuario.apellido}`,
            tipo_usuario: data.usuario.tipo_usuario, // "paciente", "doctor", "admin"
            telefono: data.usuario.telefono,
            accessToken: data.access_token, // JWT de tu API
          };
        } catch (error) {
          console.error("❌ Error en authorize:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Redirigir errores al login
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutos (igual que ACCESS_TOKEN_EXPIRE_MINUTES en tu API)
  },

  callbacks: {
    async jwt({ token, user }) {
      // Primera vez que el usuario se loguea
      if (user) {
        token.id = user.id;
        token.tipo_usuario = user.tipo_usuario;
        token.telefono = user.telefono;
        token.accessToken = user.accessToken; // ⭐ Guardar el JWT de FastAPI
      }
      return token;
    },

    async session({ session, token }) {
      // Pasar datos del token a la sesión
      if (session.user) {
        session.user.id = token.id as string;
        session.user.tipo_usuario = token.tipo_usuario as string;
        session.user.telefono = token.telefono as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  // ⭐ CRÍTICO: El secret
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // Debug solo en desarrollo
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

// Exportar handlers, auth, signIn, signOut
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
