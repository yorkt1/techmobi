import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AdminLayout from "./Dashboard";
import { Building2, Handshake, TrendingUp, ArrowRight } from "lucide-react";

export default function AdminOverview() {
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 50),
    initialData: [],
  });
  const { data: partners } = useQuery({
    queryKey: ["partners"],
    queryFn: () => base44.entities.Partner.list(),
    initialData: [],
  });

  const forSale = properties.filter((p) => p.transaction === "venda").length;
  const forRent = properties.filter((p) => p.transaction === "aluguel").length;
  const recent = properties.slice(0, 5);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Visão Geral
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Resumo do painel de gerenciamento
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total de Imóveis", value: properties.length, icon: Building2 },
          { label: "Para Venda", value: forSale, icon: TrendingUp },
          { label: "Para Aluguel", value: forRent, icon: TrendingUp },
          { label: "Parceiros", value: partners.length, icon: Handshake },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border shadow-sm rounded-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
              <stat.icon className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent properties */}
      <div className="bg-white border border-border shadow-sm rounded-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-navy-900">
            Imóveis recentes
          </h3>
          <Link
            to="/admin/imoveis"
            className="text-xs font-medium text-slate-600 hover:text-slate-500 flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground p-5">
            Nenhum imóvel cadastrado.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-navy-900">
                    {p.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.city} ·{" "}
                    {p.transaction === "venda" ? "Venda" : "Aluguel"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-navy-900">
                  {p.price
                    ? p.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      })
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}