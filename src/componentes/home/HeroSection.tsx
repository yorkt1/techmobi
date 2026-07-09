import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function HeroSection() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("company_name, hero_image_url")
        .single();
      if (error) throw error;
      return data ?? {};
    },
  });

  const heroImage = settings?.hero_image_url?.trim() ?? "";
  const heroAlt = settings?.company_name || "Wagner Kaizer Consultoria Imobiliária";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {heroImage && (
        <div
          className="absolute inset-0"
          aria-hidden={false}
        >
          <img
            src={heroImage}
            alt={heroAlt}
            className="w-full h-full object-cover"
            draggable={false}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
    </section>
  );
}
