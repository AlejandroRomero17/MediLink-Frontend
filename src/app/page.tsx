"use client";
import { Categories } from "@/features/marketing/components/sections/Categories";
import { FeaturedProfessionals } from "@/features/marketing/components/sections/featured-professionals";
import { HeroSection } from "@/features/marketing/components/sections/HeroSection";
import { HowItWorks } from "@/features/marketing/components/sections/hot-it-works";
import { ProfessionalCTA } from "@/features/marketing/components/sections/professional-cta";
import { Testimonials } from "@/features/marketing/components/sections/testimonials";
import { Footer } from "@/features/marketing/components/ui/Footer";
import { Navigation } from "@/features/marketing/components/ui/Navigation";
import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    if (!document.body.className.includes("bg-")) {
      document.body.className +=
        " min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800";
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <HeroSection />
      <Categories />
      <HowItWorks />
      <FeaturedProfessionals />
      <Testimonials />
      <ProfessionalCTA />
      <Footer />
    </div>
  );
}

