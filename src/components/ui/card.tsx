import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Base - Colores sólidos sin transparencias
        "bg-card text-card-foreground",
        // Layout
        "flex flex-col gap-4 md:gap-6",
        // Bordes y radios responsivos
        "rounded-lg md:rounded-xl lg:rounded-2xl",
        "border-2 border-border/50",
        // Sombra adaptativa
        "shadow-sm hover:shadow-md",
        // Transiciones suaves
        "transition-all duration-300",
        // Padding responsivo
        "p-4 md:p-6",
        // Soporte para glass morphism (opcional)
        "[&.glass]:backdrop-blur-md [&.glass]:bg-card/95",
        // Soporte para hover effects
        "[&.hover\\:shadow-glow-primary]:hover:shadow-glow-primary",
        "[&.hover\\:shadow-glow-secondary]:hover:shadow-glow-secondary",
        // Degradados opcionales
        "[&.border-gradient]:border-gradient",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Container query para responsive interno
        "@container/card-header",
        // Grid layout para title + action
        "grid auto-rows-min grid-rows-[auto_auto] items-start",
        "gap-1.5 md:gap-2",
        // Cuando hay action, crear 2 columnas
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        // Padding negativo para compensar el padding del Card
        "-mx-4 md:-mx-6 px-4 md:px-6",
        // Cuando tiene borde inferior
        "[&.border-b]:border-b-2 [&.border-b]:border-border/50 [&.border-b]:pb-4 [&.border-b]:md:pb-6 [&.border-b]:mb-2 [&.border-b]:md:mb-4",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // Tipografía base
        "font-semibold leading-tight tracking-tight",
        // Tamaño responsivo
        "text-base md:text-lg lg:text-xl",
        // Color adaptativo
        "text-foreground",
        // Soporte para gradientes (opcional)
        "[&.text-gradient]:text-gradient",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        // Color muted para contraste
        "text-muted-foreground",
        // Tamaño responsivo
        "text-xs md:text-sm",
        // Line height óptimo
        "leading-relaxed",
        // Limitar líneas opcionales
        "[&.truncate-2]:truncate-2",
        "[&.truncate-3]:truncate-3",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        // Posicionamiento en el grid
        "col-start-2 row-span-2 row-start-1",
        "self-start justify-self-end",
        // Alineación
        "flex items-center gap-2",
        // Asegurar que los botones/íconos sean táctiles en móvil
        "[&>button]:min-h-[44px] [&>button]:min-w-[44px]",
        "[&>a]:min-h-[44px] [&>a]:min-w-[44px]",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // Padding negativo para compensar el del Card
        "-mx-4 md:-mx-6 px-4 md:px-6",
        // Espacio entre elementos internos
        "space-y-3 md:space-y-4",
        // Line height para lectura
        "leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Layout flexible
        "flex flex-col sm:flex-row items-stretch sm:items-center",
        "gap-2 md:gap-3",
        // Padding negativo para compensar el del Card
        "-mx-4 md:-mx-6 px-4 md:px-6",
        // Cuando tiene borde superior
        "[&.border-t]:border-t-2 [&.border-t]:border-border/50 [&.border-t]:pt-4 [&.border-t]:md:pt-6 [&.border-t]:mt-2 [&.border-t]:md:mt-4",
        // Justify end por defecto (botones a la derecha)
        "sm:justify-end",
        // Pero permitir override
        "[&.justify-start]:justify-start",
        "[&.justify-between]:justify-between",
        // Touch targets para botones
        "[&>button]:min-h-[44px]",
        "[&>a]:min-h-[44px]",
        className
      )}
      {...props}
    />
  );
}

// Variantes pre-construidas para casos comunes
const CardVariants = {
  // Card con efecto glass
  Glass: React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => (
      <Card ref={ref} className={cn("glass", className)} {...props} />
    )
  ),

  // Card con hover glow primary
  Interactive: React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => (
      <Card
        ref={ref}
        className={cn("hover:shadow-glow-primary cursor-pointer", className)}
        {...props}
      />
    )
  ),

  // Card con gradiente en borde
  Gradient: React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => (
      <Card ref={ref} className={cn("border-gradient", className)} {...props} />
    )
  ),

  // Card destacado (con fondo de color)
  Highlight: React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => (
      <Card
        ref={ref}
        className={cn("bg-primary/5 border-primary/20", className)}
        {...props}
      />
    )
  ),
};

CardVariants.Glass.displayName = "CardGlass";
CardVariants.Interactive.displayName = "CardInteractive";
CardVariants.Gradient.displayName = "CardGradient";
CardVariants.Highlight.displayName = "CardHighlight";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardVariants,
};
