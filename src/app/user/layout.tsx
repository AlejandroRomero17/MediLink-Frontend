// src\app\(dashboard)\user\layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/features/dashboard-user/components/sidebar";
import { UserHeader } from "@/features/dashboard-user/components/header";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Contenedor que fuerza herencia de tema */}
      <div className="flex min-h-screen">
        {/* Sidebar - heredará colores del tema */}
        <UserSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <UserHeader />

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6 bg-background text-foreground">
            <div className="w-full space-y-6">
              {/* Debug: puedes verificar que los colores se apliquen */}
              <div className="hidden dark:block">
                {/* Este div solo se ve en modo oscuro */}
                <div className="absolute top-0 right-0 p-2 text-xs">
                  Modo oscuro activo
                </div>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
