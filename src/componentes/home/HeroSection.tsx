import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
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
    <section className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-white flex items-center justify-center">
      {/* Efeito de carregamento (shimmer) enquanto a imagem não aparece */}
      {(!fallbackImage || !loaded) && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {fallbackImage && (
        <picture className="w-full flex items-center justify-center">
          {/* Desktop (>= 768px): imagem horizontal */}
          {heroImage && (
            <source media="(min-width: 768px)" srcSet={heroImage} />
          )}
          {/* Celular: imagem vertical (ou a horizontal, se não houver vertical).
              w-full h-auto: nunca corta as laterais; se sobrar altura, o fundo branco preenche. */}
          <img
            src={fallbackImage}
            alt={heroAlt}
            onLoad={() => setLoaded(true)}
            className={`w-full h-auto transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      )}
    </section>
  );
}
