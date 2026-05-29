import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function ServicesSection() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("services_image_url").single();
      if (error) throw error;
      return data;
    },
  });

  const imageUrl = settings?.services_image_url ?? "";

  return (
    <section className="section-py relative overflow-hidden bg-white">
      <div className="relative container-max section-px">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-slate-600 tracking-wider uppercase mb-3">Nossos serviços</p>
          <h2 className="text-3xl font-serif font-bold text-navy-900">Nossos Serviços Imobiliários</h2>
          <div className="w-24 h-0.5 mx-auto mt-5 bg-slate-500 opacity-60" />
        </div>

        <div className="w-full overflow-hidden rounded-sm border border-border shadow-sm" style={{ height: "clamp(180px, 28vw, 360px)" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Nossos Serviços Imobiliários"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
              Aguardando imagem
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
