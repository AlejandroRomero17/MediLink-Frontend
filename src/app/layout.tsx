// src/app/layout.tsx - VERSIÓN SIMPLIFICADA
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      // Quita suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>
          {children}
          <AOSInitializer />

          {/* Debug solo en desarrollo */}
          {process.env.NODE_ENV !== "production" && (
            <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded">
              API: {process.env.NEXT_PUBLIC_API_URL ? "✅" : "❌"}
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
