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
    // pt-18 = altura da navbar fixa: cola a foto logo abaixo dela.
    // Sem altura fixa: a section acompanha a altura da foto (sem sobrar espaço).
    // min-h enquanto carrega só pra reservar espaço do shimmer; some quando a foto aparece.
    <section
      className={`relative w-full bg-white pt-18 ${!loaded ? "min-h-[60vh]" : ""}`}
    >
      {/* Efeito de carregamento (shimmer) enquanto a imagem não aparece */}
      {(!fallbackImage || !loaded) && (
        <div className="absolute inset-x-0 top-18 bottom-0 skeleton" aria-hidden="true" />
      )}

      {fallbackImage && (
        <picture className="block w-full">
          {/* Desktop (>= 768px): imagem horizontal */}
          {heroImage && (
            <source media="(min-width: 768px)" srcSet={heroImage} />
          )}
          {/* Celular: imagem vertical (ou a horizontal, se não houver vertical).
              w-full h-auto: nunca corta as laterais e a section acompanha a altura da foto. */}
          <img
            src={fallbackImage}
            alt={heroAlt}
            onLoad={() => setLoaded(true)}
            className={`block w-full h-auto transition-opacity duration-700 ${
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
