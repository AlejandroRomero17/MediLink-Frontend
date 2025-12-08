// src/features/auth/config/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ⭐ SOLUCIÓN: Usar process.env directamente EN LA CONFIGURACIÓN
// No intentar validarlo antes porque en build-time puede no estar disponible

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
          return null;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          if (!apiUrl) {
            console.error("❌ NEXT_PUBLIC_API_URL no definida");
            return null;
          }

          const res = await fetch(`${apiUrl}/api/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          return {
            id: data.usuario.id.toString(),
            email: data.usuario.email,
            name: `${data.usuario.nombre} ${data.usuario.apellido}`,
            tipo_usuario: data.usuario.tipo_usuario,
            telefono: data.usuario.telefono,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tipo_usuario = user.tipo_usuario;
        token.telefono = user.telefono;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.tipo_usuario = token.tipo_usuario as string;
        session.user.telefono = token.telefono as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  // ⭐⭐⭐ CRÍTICO: Poner el secret DIRECTAMENTE aquí
  // Vercel lo lee en runtime pero no en build-time
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
