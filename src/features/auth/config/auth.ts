// src/features/auth/config/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL

          if (!apiUrl) {
            console.error("❌ API URL no definida")
            return null
          }

          const res = await fetch(`${apiUrl}/api/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            return null
          }

          const data = await res.json()

          return {
            id: data.usuario.id.toString(),
            email: data.usuario.email,
            name: `${data.usuario.nombre} ${data.usuario.apellido}`,
            tipo_usuario: data.usuario.tipo_usuario,
            telefono: data.usuario.telefono,
            accessToken: data.access_token,
          }
        } catch (error) {
          console.error("Error en authorize:", error)
          return null
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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tipo_usuario = user.tipo_usuario
        token.telefono = user.telefono
        token.accessToken = user.accessToken
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.tipo_usuario = token.tipo_usuario as string
        session.user.telefono = token.telefono as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
  },
})
