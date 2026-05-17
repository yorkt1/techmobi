import React from "react";
import { base44 } from "@/api/base44Client";
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
    queryFn: () => base44.entities.Partner.filter({ active: true }),
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {partners.map((partner: any) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ partner }: { partner: any }) {
  const inner = (
    <div className="group bg-white border border-border rounded-sm overflow-hidden hover:border-muted-foreground/30 hover:shadow-md transition-all duration-300">
      {/* Foto */}
      <div className="relative h-48 bg-secondary overflow-hidden">
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground/30">
            {partner.name?.[0]?.toUpperCase()}
          </div>
        )}
        {/* Category tag */}
        {partner.category && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-sm bg-black/50 text-white backdrop-blur-sm">
              {CATEGORY_LABELS[partner.category] || partner.category}
            </span>
          </div>
        )}
        {/* Link icon */}
        {partner.website && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-7 h-7 rounded-sm bg-white/90 flex items-center justify-center shadow">
              <ExternalLink className="w-3.5 h-3.5 text-navy-900" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-semibold text-foreground text-sm leading-tight">{partner.name}</p>
        {partner.description && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {partner.description}
          </p>
        )}
      </div>
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}
