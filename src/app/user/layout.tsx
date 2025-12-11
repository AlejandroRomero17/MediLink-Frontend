// src\app\(dashboard)\user\layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserHeader } from "@/features/dashboard-user/components/header";
import { UserSidebar } from "@/features/dashboard-user/components/sidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <UserSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header con PWA integrado */}
          <UserHeader />

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6 bg-background text-foreground">
            <div className="w-full space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
