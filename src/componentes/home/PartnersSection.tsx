import React from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  financiamento: "Financiamento",
  construtora: "Construtora",
  cartório: "Cartório",
  advocacia: "Advocacia",
  outros: "Outros",
};

export default function PartnersSection() {
  const { data: partners = [] } = useQuery({
    queryKey: ["partners-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    initialData: [],
  });

  if (partners.length === 0) return null;

  return (
    <section className="section-py bg-muted/20">
      <div className="container-max section-px">
        <div className="text-center mb-12">
          <p className="section-label mb-2">Ecossistema</p>
          <h2 className="section-title">Nossos Parceiros</h2>
          <p className="section-desc mx-auto text-center">
            Empresas parceiras que garantem um processo seguro, ágil e completo para você
          </p>
        </div>

        {/* Small icon strip: show first 3 partners as compact logos */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {partners.slice(0, 3).map((p: any) => (
            <div key={p.id} className="w-28 h-12 flex items-center justify-center bg-white border border-border rounded-sm overflow-hidden">
              {p.logo_url ? (
                // logo as contained image
                <img src={p.logo_url} alt={p.name} className="max-h-10 object-contain" />
              ) : (
                <div className="text-sm text-muted-foreground">{p.name}</div>
              )}
            </div>
          ))}
        </div>

        {/* Full partners grid (up to 7) with smaller photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {partners.slice(0, 7).map((partner: any) => (
            <PartnerCard key={partner.id} partner={partner} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ partner, compact = false }: { partner: any; compact?: boolean }) {
  const imgClass = compact ? "w-full h-24 object-contain" : "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500";

  const inner = (
    <div className={`group bg-white border border-border rounded-sm overflow-hidden hover:border-muted-foreground/30 hover:shadow-md transition-all duration-300 ${compact ? "" : ""}`}>
      <div className={`relative bg-secondary overflow-hidden ${compact ? "h-24" : "h-48"}`}>
        {partner.logo_url ? (
          <img src={partner.logo_url} alt={partner.name} className={imgClass} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground/30">
            {partner.name?.[0]?.toUpperCase()}
          </div>
        )}
        {partner.website && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-7 h-7 rounded-sm bg-white/90 flex items-center justify-center shadow">
              <ExternalLink className="w-3.5 h-3.5 text-navy-900" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="font-semibold text-foreground text-sm leading-tight">{partner.name}</p>
        {partner.description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {partner.description}
          </p>
        )}
      </div>
    </div>
  );

  if (partner.website) return <a href={partner.website} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return inner;
}
