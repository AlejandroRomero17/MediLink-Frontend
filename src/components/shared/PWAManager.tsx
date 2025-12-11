"use client";

import { useEffect, useState } from "react";
import { usePWA } from "@/hooks/use-pwa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Bell,
  BellOff,
  Download,
  Smartphone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface PWAManagerProps {
  userId?: string;
  showInstallPrompt?: boolean;
  showNotificationToggle?: boolean;
}

export function PWAManager({
  userId,
  showInstallPrompt = true,
  showNotificationToggle = true,
}: PWAManagerProps) {
  const {
    isSupported,
    isSubscribed,
    isInstallable,
    isStandalone,
    isIOS,
    subscribe,
    unsubscribe,
    promptInstall,
    requestNotificationPermission,
  } = usePWA();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setMessage(null);

    const permissionResult = await requestNotificationPermission();
    if (!permissionResult.success) {
      setMessage({
        type: "error",
        text: "Debes permitir las notificaciones en tu navegador",
      });
      setIsLoading(false);
      return;
    }

    const result = await subscribe(userId);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.success
        ? "Notificaciones activadas correctamente"
        : result.error || "Error",
    });
    setIsLoading(false);
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setMessage(null);

    const result = await unsubscribe(userId);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.success
        ? "Notificaciones desactivadas"
        : result.error || "Error",
    });
    setIsLoading(false);
  };

  const handleInstall = async () => {
    setIsLoading(true);
    const result = await promptInstall();
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message || result.error || "Error al instalar",
    });
    setIsLoading(false);
  };

  // Auto-ocultar mensajes después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Mensaje de estado */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {message.type === "success" ? "Éxito" : "Error"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Prompt de instalación */}
      {showInstallPrompt && !isStandalone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Instalar Aplicación
            </CardTitle>
            <CardDescription>
              {isIOS
                ? "Instala MediLink en tu pantalla de inicio para una mejor experiencia"
                : "Instala MediLink como aplicación para acceso rápido"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Para instalar en iOS:
                </p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>
                    Toca el botón de compartir{" "}
                    <span className="font-semibold">⎋</span>
                  </li>
                  <li>
                    Desplázate y toca &ldquo;Añadir a pantalla de inicio&rdquo;{" "}
                    <span className="font-semibold">➕</span>
                  </li>
                  <li>Confirma tocando &ldquo;Añadir&rdquo;</li>
                </ol>
              </div>
            ) : isInstallable ? (
              <Button
                onClick={handleInstall}
                disabled={isLoading}
                className="w-full"
              >
                <Smartphone className="mr-2 h-4 w-4" />
                {isLoading ? "Instalando..." : "Instalar Aplicación"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                La aplicación ya está instalada o no se puede instalar en este
                momento.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Toggle de notificaciones */}
      {showNotificationToggle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isSubscribed ? (
                <Bell className="h-5 w-5 text-green-600" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              Notificaciones Push
            </CardTitle>
            <CardDescription>
              {isSubscribed
                ? "Recibirás notificaciones sobre citas, alertas de salud y recordatorios"
                : "Activa las notificaciones para estar al día con tus citas y alertas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <div className="space-y-3">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Notificaciones Activas</AlertTitle>
                  <AlertDescription>
                    Estás recibiendo notificaciones de MediLink
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleUnsubscribe}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <BellOff className="mr-2 h-4 w-4" />
                  {isLoading ? "Desactivando..." : "Desactivar Notificaciones"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full"
              >
                <Bell className="mr-2 h-4 w-4" />
                {isLoading ? "Activando..." : "Activar Notificaciones"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
