import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PropertyCard from "./PropertyCard";

async function queryProperties(filter?: { transaction: string }, limit = 6) {
  let q = supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(limit);
  if (filter) q = q.eq("transaction", filter.transaction);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-sm overflow-hidden border border-border bg-white">
          <div className="skeleton aspect-[4/3] w-full" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-7 w-32" />
            <div className="skeleton h-4 w-48" />
            <div className="skeleton h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="text-center py-16 rounded-sm"
      style={{ border: "1px dashed rgba(100,116,139,0.2)", background: "rgba(100,116,139,0.03)" }}
    >
      <p className="text-muted-foreground text-sm">Nenhum imóvel disponível no momento.</p>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="section-label mb-2">{label}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <Link
        to={href}
        className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors group"
        style={{ color: "#64748b" }}
      >
        Ver todos
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function PropertyGrid({ properties }: { properties: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}

export default function RecentProperties() {
  const { data: featured = [], isLoading: loadingFeatured } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => queryProperties(undefined, 3),
    initialData: [],
  });

  const { data: venda = [], isLoading: loadingVenda } = useQuery({
    queryKey: ["venda-properties"],
    queryFn: () => queryProperties({ transaction: "venda" }, 6),
    initialData: [],
  });

  const { data: aluguel = [], isLoading: loadingAluguel } = useQuery({
    queryKey: ["aluguel-properties"],
    queryFn: () => queryProperties({ transaction: "aluguel" }, 6),
    initialData: [],
  });

  const featuredIds = new Set(featured.map((p: any) => p.id));

  const vendaDisplay = (() => {
    const deduped = venda.filter((p: any) => !featuredIds.has(p.id));
    return deduped.length >= 2 ? deduped : venda;
  })();

  const aluguelDisplay = (() => {
    const deduped = aluguel.filter((p: any) => !featuredIds.has(p.id));
    return deduped.length >= 2 ? deduped : aluguel;
  })();

  return (
    <>
      {/* ── Destaques ── */}
      <section className="section-py">
        <div className="container-max section-px">
          <SectionHeader label="Portfólio" title="Veja alguns imóveis na região" href="/imoveis" />
          {loadingFeatured ? (
            <SkeletonGrid count={3} />
          ) : featured.length === 0 ? (
            <EmptyState />
          ) : (
            <PropertyGrid properties={featured} />
          )}
        </div>
      </section>

      {/* ── Venda ── */}
      <section className="section-py bg-muted/30">
        <div className="container-max section-px">
          <SectionHeader label="Comprar" title="Imóveis à Venda" href="/imoveis?transaction=venda" />
          {loadingVenda ? (
            <SkeletonGrid count={3} />
          ) : vendaDisplay.length === 0 ? (
            <EmptyState />
          ) : (
            <PropertyGrid properties={vendaDisplay} />
          )}
          <div className="mt-6 sm:hidden text-center">
            <Link
              to="/imoveis?transaction=venda"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "#64748b" }}
            >
              Ver todos à venda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Aluguel ── */}
      <section className="section-py">
        <div className="container-max section-px">
          <SectionHeader label="Alugar" title="Imóveis para Alugar" href="/imoveis?transaction=aluguel" />
          {loadingAluguel ? (
            <SkeletonGrid count={3} />
          ) : aluguelDisplay.length === 0 ? (
            <EmptyState />
          ) : (
            <PropertyGrid properties={aluguelDisplay} />
          )}
          <div className="mt-6 sm:hidden text-center">
            <Link
              to="/imoveis?transaction=aluguel"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "#64748b" }}
            >
              Ver todos para alugar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
