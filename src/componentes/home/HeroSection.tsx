import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Imagem padrão caso nenhuma capa tenha sido enviada pelo painel
const DEFAULT_HERO =
  "https://res.cloudinary.com/dqewxdbfx/image/upload/v1779223985/WhatsApp_Image_2026-05-19_at_10.03.40_ziifbg.jpg";

const INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Busca a capa cadastrada no painel admin (Configurações)
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").single();
      if (error) throw error;
      return data ?? {};
    },
  });

  const SLIDES = [
    {
      id: 1,
      image: settings?.hero_image_url || DEFAULT_HERO,
      alt: settings?.company_name || "Wagner Kaizer Consultoria Imobiliária",
    },
  ];

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));
  }, []);

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}

      {/* Arrows — só aparece com 2+ slides */}
      {SLIDES.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-sm bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-sm bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {SLIDES.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
              }}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
