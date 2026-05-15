import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "./PropertyCard";
import { ArrowRight } from "lucide-react";

export default function RecentProperties() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["recent-properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 6),
    initialData: [],
  });

  return (
    <section className="section-py">
      <div className="container-max section-px">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">Portfólio</p>
            <h2 className="section-title">Imóveis em destaque</h2>
          </div>
          <Link
            to="/imoveis"
            className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors group"
            style={{ color: "#64748b" }}
          >
            Ver todos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm overflow-hidden" style={{ background: "rgba(17,34,64,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="skeleton aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-7 w-32" />
                  <div className="skeleton h-4 w-48" />
                  <div className="skeleton h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div
            className="text-center py-20 rounded-sm"
            style={{ border: "1px dashed rgba(197,160,89,0.2)", background: "rgba(197,160,89,0.03)" }}
          >
            <p className="text-muted-foreground text-sm">Nenhum imóvel cadastrado ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-2">Os imóveis aparecerão aqui quando forem adicionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#64748b" }}
          >
            Ver todos os imóveis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
