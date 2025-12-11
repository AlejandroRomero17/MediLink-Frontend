// src/app/layout.tsx - CON SOPORTE PWA
import AOSInitializer from "@/components/shared/AOSInitializer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

// Metadata principal con PWA
export const metadata: Metadata = {
  title: "MediLink - Plataforma de Salud",
  description:
    "Plataforma integral para gestión de salud, citas médicas y seguimiento de pacientes",
  applicationName: "MediLink",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MediLink",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

// Viewport para PWA
export const viewport: Viewport = {
  themeColor: "#0066cc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
      suppressHydrationWarning
    >
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="MediLink" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-TileColor" content="#0066cc" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
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
