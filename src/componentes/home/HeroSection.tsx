import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function HeroSection() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("company_name, hero_image_url, hero_image_mobile_url")
        .single();
      if (error) throw error;
      return data ?? {};
    },
  });

  const heroImage = settings?.hero_image_url?.trim() ?? "";
  const heroMobileImage = settings?.hero_image_mobile_url?.trim() ?? "";
  const heroAlt = settings?.company_name || "Wagner Kaizer Consultoria Imobiliária";

  // Imagem exibida por padrão (fallback do <img>): celular usa a vertical se houver.
  const fallbackImage = heroMobileImage || heroImage;

  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-black">
      {fallbackImage && (
        <div className="absolute inset-0">
          <picture>
            {/* Desktop (>= 768px): imagem horizontal */}
            {heroImage && (
              <source media="(min-width: 768px)" srcSet={heroImage} />
            )}
            {/* Celular: imagem vertical (ou a horizontal, se não houver vertical) */}
            <img
              src={fallbackImage}
              alt={heroAlt}
              className="w-full h-full object-cover object-center"
              draggable={false}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>
      )}
    </section>
  );
}
