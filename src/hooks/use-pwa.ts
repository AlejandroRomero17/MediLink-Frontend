import { useState, useEffect, useCallback } from "react";
import { subscribeUser, unsubscribeUser } from "@/app/actions/pwa-actions";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function usePWA() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = async () => {
      // Verificar soporte de PWA
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      // Detectar si es iOS
      const ios =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window & typeof globalThis & { MSStream?: unknown })
          .MSStream;
      setIsIOS(ios);

      // Detectar si ya está instalado (modo standalone)
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as NavigatorWithStandalone).standalone === true;
      setIsStandalone(standalone);

      // Si ya está instalado, no necesitamos el prompt
      if (standalone) {
        setIsInstallable(false);
      }

      if (supported) {
        await registerServiceWorker();
        await checkSubscription();
      }

      setIsReady(true);
    };

    init();
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = async () => {
    try {
      // Verificar si ya hay uno registrado
      const existingRegistration =
        await navigator.serviceWorker.getRegistration("/");

      if (existingRegistration) {
        console.log("[PWA] Service Worker ya registrado");
        setSwRegistration(existingRegistration);

        // Escuchar actualizaciones
        existingRegistration.addEventListener("updatefound", () => {
          console.log("[PWA] Nueva versión del Service Worker disponible");
        });

        return existingRegistration;
      }

      // Registrar nuevo Service Worker
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      console.log(
        "[PWA] Service Worker registrado exitosamente:",
        registration
      );
      setSwRegistration(registration);

      // Esperar a que esté activo
      await navigator.serviceWorker.ready;
      console.log("[PWA] Service Worker listo");

      // Escuchar actualizaciones
      registration.addEventListener("updatefound", () => {
        console.log("[PWA] Nueva versión del Service Worker disponible");
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated") {
              console.log("[PWA] Nueva versión activada");
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error("[PWA] Error al registrar Service Worker:", error);
      return null;
    }
  };

  // Verificar suscripción existente
  const checkSubscription = async () => {
    try {
      // Esperar a que el Service Worker esté listo
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();

      setSubscription(sub);
      setIsSubscribed(!!sub);

      if (sub) {
        console.log("[PWA] Suscripción existente encontrada");
      }
    } catch (error) {
      console.error("[PWA] Error al verificar suscripción:", error);
    }
  };

  // Manejar el evento beforeinstallprompt
  useEffect(() => {
    // Solo si no está instalado
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      console.log("[PWA] beforeinstallprompt event disparado");
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Guardar en localStorage que el prompt está disponible
      localStorage.setItem("pwa-installable", "true");
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Restaurar estado de localStorage
    const wasInstallable = localStorage.getItem("pwa-installable");
    if (wasInstallable === "true" && !isStandalone) {
      setIsInstallable(true);
    }

    // Detectar si ya fue instalado
    window.addEventListener("appinstalled", () => {
      console.log("[PWA] App instalada exitosamente");
      setIsInstallable(false);
      setIsStandalone(true);
      localStorage.removeItem("pwa-installable");
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isStandalone]);

  // Convertir VAPID key de base64 a Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Suscribirse a notificaciones push
  const subscribe = useCallback(
    async (userId?: string) => {
      try {
        console.log("[PWA] Iniciando suscripción a notificaciones...");

        // Verificar que el Service Worker esté listo
        if (!swRegistration) {
          console.log("[PWA] Esperando registro del Service Worker...");
          const reg = await navigator.serviceWorker.ready;
          setSwRegistration(reg);
        }

        const registration =
          swRegistration || (await navigator.serviceWorker.ready);

        // Verificar VAPID key
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
          console.error("[PWA] VAPID key no configurada");
          return {
            success: false,
            error: "Configuración de notificaciones incompleta",
          };
        }

        console.log("[PWA] Solicitando suscripción push...");
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        console.log("[PWA] Suscripción exitosa:", sub);
        setSubscription(sub);
        setIsSubscribed(true);

        // Enviar suscripción al servidor
        const serializedSub = JSON.parse(JSON.stringify(sub));
        const result = await subscribeUser(serializedSub, userId);

        if (result.success) {
          console.log("[PWA] Suscripción guardada en el servidor");
        } else {
          console.warn(
            "[PWA] Error al guardar suscripción en servidor:",
            result.error
          );
        }

        return result;
      } catch (error) {
        console.error("[PWA] Error al suscribirse:", error);

        // Mensajes de error más específicos
        let errorMessage = "Error al suscribirse a notificaciones";

        if (error instanceof Error) {
          if (error.name === "NotAllowedError") {
            errorMessage = "Permisos de notificación denegados";
          } else if (error.name === "NotSupportedError") {
            errorMessage = "Notificaciones no soportadas en este navegador";
          } else if (error.message.includes("subscription")) {
            errorMessage = "Error al crear la suscripción";
          }
        }

        return { success: false, error: errorMessage };
      }
    },
    [swRegistration]
  );

  // Desuscribirse de notificaciones push
  const unsubscribe = useCallback(
    async (userId?: string) => {
      try {
        console.log("[PWA] Desuscribiendo de notificaciones...");

        if (subscription) {
          await subscription.unsubscribe();
          setSubscription(null);
          setIsSubscribed(false);
          console.log("[PWA] Desuscripción exitosa");

          const result = await unsubscribeUser(userId);
          return result;
        }

        return { success: false, error: "No hay suscripción activa" };
      } catch (error) {
        console.error("[PWA] Error al desuscribirse:", error);
        return {
          success: false,
          error: "Error al desuscribirse de notificaciones",
        };
      }
    },
    [subscription]
  );

  // Mostrar prompt de instalación
  const promptInstall = useCallback(async () => {
    console.log("[PWA] Intentando mostrar prompt de instalación...");

    if (!deferredPrompt) {
      console.warn("[PWA] No hay prompt disponible");

      // Si es iOS, dar instrucciones
      if (isIOS) {
        return {
          success: false,
          error: "En iOS debes usar: Compartir → Añadir a pantalla de inicio",
        };
      }

      return {
        success: false,
        error: "El prompt de instalación no está disponible en este momento",
      };
    }

    try {
      console.log("[PWA] Mostrando prompt...");
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      console.log("[PWA] Resultado del prompt:", outcome);

      setDeferredPrompt(null);

      if (outcome === "accepted") {
        setIsInstallable(false);
        localStorage.removeItem("pwa-installable");
      }

      return {
        success: true,
        outcome,
        message:
          outcome === "accepted"
            ? "App instalada correctamente"
            : "Instalación cancelada",
      };
    } catch (error) {
      console.error("[PWA] Error al mostrar prompt:", error);
      return {
        success: false,
        error: "Error al instalar la aplicación",
      };
    }
  }, [deferredPrompt, isIOS]);

  // Verificar permisos de notificación
  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      return {
        success: false,
        error: "Este navegador no soporta notificaciones",
      };
    }

    try {
      console.log("[PWA] Permiso actual:", Notification.permission);

      // Si ya está concedido, no preguntar de nuevo
      if (Notification.permission === "granted") {
        return {
          success: true,
          permission: "granted",
          message: "Permisos ya concedidos",
        };
      }

      console.log("[PWA] Solicitando permisos de notificación...");
      const permission = await Notification.requestPermission();
      console.log("[PWA] Resultado:", permission);

      return {
        success: permission === "granted",
        permission,
        message:
          permission === "granted"
            ? "Permisos concedidos"
            : "Permisos denegados",
      };
    } catch (error) {
      console.error("[PWA] Error al solicitar permisos:", error);
      return {
        success: false,
        error: "Error al solicitar permisos",
      };
    }
  }, []);

  return {
    // Estados
    isSupported,
    isSubscribed,
    subscription,
    isInstallable,
    isStandalone,
    isIOS,
    isReady,

    // Métodos
    subscribe,
    unsubscribe,
    promptInstall,
    requestNotificationPermission,
  };
}
