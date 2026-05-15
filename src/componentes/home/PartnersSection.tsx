import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

const CATEGORY_LABELS = {
  financiamento: "Financiamento",
  construtora: "Construtora",
  cartório: "Cartório",
  advocacia: "Advocacia",
  outros: "Outros",
};

export default function PartnersSection() {
  const { data: partners } = useQuery({
    queryKey: ["partners-active"],
    queryFn: () => base44.entities.Partner.filter({ active: true }),
    initialData: [],
  });

  if (partners.length === 0) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Nossos parceiros
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Empresas parceiras que garantem um processo seguro e completo
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ partner }) {
  const content = (
    <div className="group border border-border rounded-sm p-5 flex flex-col items-center text-center hover:border-muted-foreground/30 transition-colors">
      {partner.logo_url ? (
        <img
          src={partner.logo_url}
          alt={partner.name}
          className="h-12 max-w-full object-contain mb-3"
        />
      ) : (
        <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground mb-3">
          {partner.name?.[0]?.toUpperCase()}
        </div>
      )}
      <p className="text-sm font-semibold text-foreground">{partner.name}</p>
      {partner.category && (
        <p className="text-xs text-muted-foreground mt-1">
          {CATEGORY_LABELS[partner.category] || partner.category}
        </p>
      )}
      {partner.description && (
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
          {partner.description}
        </p>
      )}
      {partner.website && (
        <span className="mt-3 text-xs text-muted-foreground group-hover:text-foreground flex items-center gap-1 transition-colors">
          <ExternalLink className="w-3 h-3" /> Visitar site
        </span>
      )}
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
