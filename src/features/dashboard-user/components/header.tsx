"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  PanelLeftIcon,
  User,
  Settings,
  LogOut,
  MapPin,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Badge } from "@/components/ui/badge";
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
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

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

        const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token JWT
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Datos del usuario:", data);
          setUserData(data);
        } else if (response.status === 401) {
          console.error("Token inválido o expirado");
          toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
          // Opcional: redirigir al login
          localStorage.removeItem("access_token");
        } else {
          console.error("Error al obtener datos del usuario:", response.status);
          toast.error("No se pudieron cargar los datos del usuario");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error al conectar con el servidor");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  // Detectar ubicación del usuario
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoading(true);

        // Intentar con la API del navegador primero
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0,
                });
              }
            );

            // Usar Nominatim con mayor detalle
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

              console.log("Datos de ubicación:", address);

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

              toast.success(`Ubicación detectada: ${city}`);
              return;
            }
          } catch (geoError) {
            console.error("Error con geolocalización del navegador:", geoError);
          }
        }

        // Fallback: usar IP para ubicación aproximada
        try {
          const ipResponse = await fetch("https://ipapi.co/json/");
          if (ipResponse.ok) {
            const data = await ipResponse.json();
            setLocation({
              city: data.city || "Ubicación desconocida",
              region: data.region || "",
              country: data.country_name || "México",
              isDetected: false,
            });
            toast.info("Ubicación aproximada detectada por IP");
          } else {
            throw new Error("Error con API de IP");
          }
        } catch (ipError) {
          console.error("Error con detección por IP:", ipError);
          setLocation({
            city: "No detectada",
            region: "",
            country: "",
            isDetected: false,
          });
          toast.warning("No se pudo detectar tu ubicación");
        }
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const handleRefreshLocation = async () => {
    toast.info("Actualizando ubicación...");
    setLoading(true);

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

              toast.success("Ubicación actualizada");
            }
          } catch (error) {
            console.error("Error actualizando ubicación:", error);
            toast.error("No se pudo actualizar la ubicación");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error de geolocalización:", error);
          toast.error("Activa los permisos de ubicación");
          setLoading(false);
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
    // Opcional: redirigir al login
    window.location.href = "/login";
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
                    {loading ? (
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <p className="text-xs md:text-sm">
                          Detectando ubicación...
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs md:text-sm truncate max-w-[180px]">
                          {location.city}
                          {location.region && `, ${location.region}`}
                        </p>
                        {!location.isDetected && (
                          <span className="text-[10px] text-muted-foreground/70 italic">
                            (aprox.)
                          </span>
                        )}
                      </>
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
                {loading ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      Detectando...
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {location.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección Derecha - Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
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

                {/* Theme Toggle in Dropdown - Only on mobile */}
                <div className="sm:hidden">
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
                      {loading
                        ? "Detectando..."
                        : `${location.city}${
                            location.region ? `, ${location.region}` : ""
                          }`}
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
