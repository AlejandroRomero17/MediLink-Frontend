"use client";

import { ModeToggle } from "@/components/shared/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePWA } from "@/hooks/use-pwa";
import {
  Bell,
  BellOff,
  ChevronDown,
  Download,
  Loader2,
  LogOut,
  MapPin,
  PanelLeftIcon,
  RefreshCw,
  Settings,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LocationData {
  city: string;
  region: string;
  country: string;
  isDetected: boolean;
}

interface UserData {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  correo_electronico: string;
  foto_perfil?: string;
  tipo_usuario: string;
}

export function UserHeader() {
  const [location, setLocation] = useState<LocationData>({
    city: "Detectando...",
    region: "",
    country: "",
    isDetected: false,
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // PWA Hook
  const {
    isSupported,
    isSubscribed,
    isInstallable,
    isStandalone,
    isIOS,
    isReady,
    subscribe,
    unsubscribe,
    promptInstall,
    requestNotificationPermission,
  } = usePWA();

  const [pwaLoading, setPwaLoading] = useState(false);

  // Detectar si estamos en producción o desarrollo
  const API_BASE_URL =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000/api"
      : "https://medilink-backend-7ivn.onrender.com/api";

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);

        // Obtener el token del localStorage
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.warn("No hay token de autenticación");
          setUserLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

        const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else if (response.status === 401) {
          console.error("Token inválido o expirado");
          localStorage.removeItem("access_token");
          // No mostrar toast para no molestar al usuario
        } else {
          console.error("Error al obtener datos del usuario:", response.status);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.warn("Timeout al conectar con el servidor");
          } else {
            console.warn("No se pudo conectar con el servidor. Modo offline.");
          }
        }
        // No mostrar toast para evitar spam
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  // Detectar ubicación del usuario - Solo una vez al cargar
  useEffect(() => {
    let mounted = true;

    const detectLocation = async () => {
      try {
        // Primero intentar con navegador
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              if (!mounted) return;

              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
                  {
                    headers: {
                      "Accept-Language": "es",
                    },
                  }
                );

                if (response.ok && mounted) {
                  const data = await response.json();
                  const address = data.address;

                  const city =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.municipality ||
                    address.county ||
                    address.suburb ||
                    "Ubicación desconocida";

                  setLocation({
                    city: city,
                    region: address.state || address.region || "",
                    country: address.country || "México",
                    isDetected: true,
                  });
                }
              } catch (error) {
                console.error("Error con Nominatim:", error);
              }
            },
            async (error) => {
              console.warn("Geolocalización no disponible:", error);
              // Fallback a IP
              try {
                const ipResponse = await fetch("https://ipapi.co/json/");
                if (ipResponse.ok && mounted) {
                  const data = await ipResponse.json();
                  setLocation({
                    city: data.city || "No detectada",
                    region: data.region || "",
                    country: data.country_name || "México",
                    isDetected: false,
                  });
                }
              } catch (ipError) {
                console.warn("Error con detección por IP:", ipError);
                if (mounted) {
                  setLocation({
                    city: "No detectada",
                    region: "",
                    country: "",
                    isDetected: false,
                  });
                }
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 300000, // 5 minutos
            }
          );
        }
      } catch (error) {
        console.error("Error detectando ubicación:", error);
      }
    };

    detectLocation();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRefreshLocation = async () => {
    if (loading) return;

    setLoading(true);
    toast.info("Actualizando ubicación...", { duration: 1000 });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  "Accept-Language": "es",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const address = data.address;

              const city =
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                address.county ||
                address.suburb ||
                "Ubicación desconocida";

              setLocation({
                city: city,
                region: address.state || address.region || "",
                country: address.country || "México",
                isDetected: true,
              });

              toast.success("Ubicación actualizada", { duration: 2000 });
            }
          } catch (error) {
            console.error("Error actualizando ubicación:", error);
            toast.error("No se pudo actualizar");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error de geolocalización:", error);
          toast.error("Activa los permisos de ubicación");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      toast.error("Tu navegador no soporta geolocalización");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    toast.success("Sesión cerrada correctamente");
    window.location.href = "/login";
  };

  // PWA Handlers
  const handleToggleNotifications = async () => {
    if (pwaLoading) return;

    setPwaLoading(true);

    try {
      if (isSubscribed) {
        // Desuscribir
        const result = await unsubscribe(userData?.id.toString());
        if (result.success) {
          toast.success("Notificaciones desactivadas", {
            description: "Ya no recibirás notificaciones push",
          });
        } else {
          toast.error("Error al desactivar", {
            description: result.error || "Intenta de nuevo",
          });
        }
      } else {
        // Primero solicitar permisos
        console.log("Solicitando permisos de notificación...");
        const permissionResult = await requestNotificationPermission();

        if (!permissionResult.success) {
          toast.error("Permisos denegados", {
            description:
              "Habilita las notificaciones en la configuración de tu navegador",
            duration: 5000,
          });
          setPwaLoading(false);
          return;
        }

        // Luego suscribir
        console.log("Suscribiendo a notificaciones...");
        const result = await subscribe(userData?.id.toString());

        if (result.success) {
          toast.success("¡Notificaciones activadas!", {
            description: "Recibirás notificaciones sobre citas y alertas",
          });
        } else {
          toast.error("Error al activar", {
            description: result.error || "Intenta de nuevo más tarde",
          });
        }
      }
    } catch (error) {
      console.error("Error con notificaciones:", error);
      toast.error("Error inesperado", {
        description: "No se pudieron gestionar las notificaciones",
      });
    } finally {
      setPwaLoading(false);
    }
  };

  const handleInstallApp = async () => {
    if (pwaLoading) return;

    setPwaLoading(true);

    try {
      console.log("Intentando instalar app...");
      const result = await promptInstall();

      if (result.success) {
        if (result.outcome === "accepted") {
          toast.success("¡App instalada!", {
            description: "Ahora puedes acceder desde tu pantalla de inicio",
          });
        } else {
          toast.info("Instalación cancelada");
        }
      } else {
        // Si es iOS, mostrar instrucciones
        if (isIOS) {
          toast.info("Instalar en iOS", {
            description:
              "Toca el botón Compartir y selecciona 'Añadir a pantalla de inicio'",
            duration: 6000,
          });
        } else {
          toast.error("No disponible", {
            description:
              result.error || "La instalación no está disponible ahora",
          });
        }
      }
    } catch (error) {
      console.error("Error instalando app:", error);
      toast.error("Error al instalar", {
        description: "No se pudo instalar la aplicación",
      });
    } finally {
      setPwaLoading(false);
    }
  };

  // Generar iniciales del usuario
  const getUserInitials = () => {
    if (!userData) return "U";
    const firstInitial = userData.nombre?.charAt(0) || "";
    const lastInitial = userData.apellido_paterno?.charAt(0) || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Obtener nombre completo
  const getFullName = () => {
    if (!userData) return "Usuario";
    const nombres = [
      userData.nombre,
      userData.apellido_paterno,
      userData.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");
    return nombres || "Usuario";
  };

  // Obtener primer nombre
  const getFirstName = () => {
    if (!userData) return "Usuario";
    return userData.nombre || "Usuario";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Sección Izquierda */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
            {/* Mobile Menu Trigger */}
            <SidebarTrigger className="lg:hidden flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Abrir menú"
              >
                <PanelLeftIcon className="h-5 w-5" />
              </Button>
            </SidebarTrigger>

            {/* Title + Location */}
            <div className="min-w-0 flex-1">
              {/* Title */}
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate leading-tight">
                Encuentra tu Doctor Ideal
              </h1>

              {/* Location - Hidden on small mobile */}
              <div className="hidden sm:flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 text-muted-foreground group">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs md:text-sm truncate max-w-[180px]">
                      {location.city}
                      {location.region && `, ${location.region}`}
                    </p>
                    {!location.isDetected && (
                      <span className="text-[10px] text-muted-foreground/70 italic">
                        (aprox.)
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRefreshLocation}
                    disabled={loading}
                    title="Actualizar ubicación"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {/* Location Badge - Only on small mobile */}
              <div className="flex sm:hidden items-center gap-1.5 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {location.city}
                </span>
              </div>
            </div>
          </div>

          {/* Sección Derecha - Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* PWA Actions - Solo mostrar si está soportado */}
            {isSupported && isReady && (
              <>
                {/* Notification Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex h-10 w-10"
                  onClick={handleToggleNotifications}
                  disabled={pwaLoading}
                  title={
                    isSubscribed
                      ? "Desactivar notificaciones"
                      : "Activar notificaciones"
                  }
                >
                  {pwaLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isSubscribed ? (
                    <Bell className="h-5 w-5 text-green-600 dark:text-green-500" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>

                {/* Install Button - Solo si NO está instalado Y (es instalable O es iOS) */}
                {!isStandalone && (isInstallable || isIOS) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-10 w-10"
                    onClick={handleInstallApp}
                    disabled={pwaLoading}
                    title={
                      isIOS
                        ? "Instrucciones de instalación"
                        : "Instalar aplicación"
                    }
                  >
                    {pwaLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5 text-primary" />
                    )}
                  </Button>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-10 px-2 md:px-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg group"
                  aria-label="Menú de usuario"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    {userData?.foto_perfil ? (
                      <AvatarImage
                        src={userData.foto_perfil}
                        alt={getFullName()}
                      />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-sm">
                      {userLoading ? "..." : getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-foreground">
                    {userLoading ? "Cargando..." : getFirstName()}
                  </span>
                  <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 bg-popover/95 backdrop-blur-md border border-border shadow-xl rounded-xl p-2"
              >
                {/* User Info Header */}
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                      {userData?.foto_perfil ? (
                        <AvatarImage
                          src={userData.foto_perfil}
                          alt={getFullName()}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-base">
                        {userLoading ? "..." : getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {userLoading ? (
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                        </div>
                      ) : userData ? (
                        <>
                          <p className="font-semibold text-foreground truncate">
                            {getFullName()}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {userData.correo_electronico}
                          </p>
                          <Badge
                            variant="outline"
                            className="mt-1.5 text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                          >
                            {userData.tipo_usuario === "paciente"
                              ? "Paciente"
                              : userData.tipo_usuario === "doctor"
                              ? "Doctor"
                              : "Admin"}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-foreground">
                            No autenticado
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Inicia sesión
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-border" />

                {/* Menu Items */}
                <DropdownMenuItem className="p-3 cursor-pointer rounded-lg focus:bg-accent focus:text-accent-foreground transition-colors">
                  <User className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Mi Perfil</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-3 cursor-pointer rounded-lg focus:bg-accent focus:text-accent-foreground transition-colors">
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Configuración</span>
                </DropdownMenuItem>

                {/* PWA Options in Mobile Menu */}
                {isSupported && (
                  <>
                    <div className="sm:hidden">
                      <DropdownMenuSeparator className="bg-border" />

                      <DropdownMenuItem
                        className="p-3 cursor-pointer rounded-lg focus:bg-accent focus:text-accent-foreground transition-colors"
                        onClick={handleToggleNotifications}
                        disabled={pwaLoading}
                      >
                        {isSubscribed ? (
                          <>
                            <Bell className="mr-3 h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              Notificaciones Activas
                            </span>
                          </>
                        ) : (
                          <>
                            <BellOff className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              Activar Notificaciones
                            </span>
                          </>
                        )}
                      </DropdownMenuItem>

                      {!isStandalone && (isInstallable || isIOS) && (
                        <DropdownMenuItem
                          className="p-3 cursor-pointer rounded-lg focus:bg-accent focus:text-accent-foreground transition-colors"
                          onClick={handleInstallApp}
                          disabled={pwaLoading}
                        >
                          <Download className="mr-3 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Instalar App</span>
                        </DropdownMenuItem>
                      )}
                    </div>
                  </>
                )}

                {/* Theme Toggle in Dropdown - Only on mobile */}
                <div className="sm:hidden">
                  <DropdownMenuSeparator className="bg-border" />
                  <div className="p-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">Tema</span>
                      <ModeToggle />
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-border" />

                {/* Location Info in Dropdown */}
                <div className="p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Ubicación actual
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="text-sm text-foreground truncate">
                      {location.city}
                      {location.region && `, ${location.region}`}
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-border" />

                {/* Logout */}
                <DropdownMenuItem
                  className="p-3 cursor-pointer rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
