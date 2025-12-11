import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MediLink - Plataforma de Salud",
    short_name: "MediLink",
    description:
      "Plataforma integral para gestión de salud, citas médicas y seguimiento de pacientes",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066cc",
    orientation: "portrait-primary",
    categories: ["health", "medical", "productivity"],
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile-1.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Vista de la página principal en móvil",
      },
      {
        src: "/screenshots/mobile-2.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Dashboard de paciente en móvil",
      },
      {
        src: "/screenshots/desktop-1.png",
        sizes: "1921x1080",
        type: "image/png",
        form_factor: "wide",
        label: "Vista de la página principal en escritorio",
      },
      {
        src: "/screenshots/desktop-2.png",
        sizes: "1921x1080",
        type: "image/png",
        form_factor: "wide",
        label: "Dashboard de paciente en escritorio",
      },
    ],
  };
}
