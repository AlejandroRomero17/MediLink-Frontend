// src/app/layout.tsx - AGREGAR ESTO
import AOSInitializer from "@/components/shared/AOSInitializer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CliniData",
  description: "Aplicación de monitoreo de salud",
};

// Componente para debug (solo en desarrollo)
function EnvDebug() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded opacity-70 hover:opacity-100 transition-opacity"
      style={{ fontFamily: "monospace" }}
    >
      API: {process.env.NEXT_PUBLIC_API_URL ? "✅" : "❌"}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('${GeistSans.variable}', '${GeistMono.variable}');

                  var savedTheme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  document.body.className = theme === 'dark'
                    ? 'dark:bg-background dark:text-foreground'
                    : 'bg-background text-foreground';

                  // Debug: Log environment variables
                  console.log('🌐 Frontend URL:', window.location.origin);
                  console.log('🔧 NODE_ENV:', '${process.env.NODE_ENV}');
                } catch (e) {
                  document.documentElement.classList.add('${GeistSans.variable}', '${GeistMono.variable}');
                  document.body.className = 'bg-background text-foreground';
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <AOSInitializer />
          <EnvDebug /> {/* 👈 Agregar este componente */}
        </Providers>

        {/* Script para debug en consola */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('=== Environment Debug ===');
              console.log('API URL:', '${process.env.NEXT_PUBLIC_API_URL}');
              console.log('Build Mode:', '${process.env.NODE_ENV}');
              console.log('====================');
            `,
          }}
        />
      </body>
    </html>
  );
}
