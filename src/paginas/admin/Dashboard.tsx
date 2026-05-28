import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Handshake,
  Users,
  Settings,
  Newspaper,
} from "lucide-react";
import { Button } from "@/componentes/ui/button";

const NAV = [
  { label: "Visão Geral", to: "/admin", icon: LayoutDashboard },
  { label: "Imóveis", to: "/admin/imoveis", icon: Building2 },
  { label: "Parceiros", to: "/admin/parceiros", icon: Handshake },
  { label: "Notícias", to: "/admin/noticias", icon: Newspaper },
  { label: "Leads", to: "/admin/leads", icon: Users },
  { label: "Configurações", to: "/admin/configuracoes", icon: Settings },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: properties } = useQuery({
    queryKey: ["properties-count"],
    queryFn: () => base44.entities.Property.list(),
    initialData: [],
  });
  const { data: partners } = useQuery({
    queryKey: ["partners-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*");
      if (error) throw error;
      return data ?? [];
    },
    initialData: [],
  });

  const handleLogout = () => base44.auth.logout("/");

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex border-r border-white/5`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #94a3b8, #64748b)" }}
          >
            <span className="text-navy-900 font-bold text-xs select-none">WK</span>
          </div>
          <div>
            <span className="font-serif font-bold tracking-tight text-base block leading-none">Wagner Kaizer</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-medium">Consultoria Imobiliária</span>
          </div>
          <button
            className="ml-auto lg:hidden text-white/50 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 px-2 font-semibold">
            Menu Principal
          </p>
          {NAV.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-slate-500/10 text-slate-400 border border-slate-500/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-5 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            ← Ver site público
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden text-navy-800 hover:text-navy-600 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-navy-900 tracking-tight">
            Painel do Corretor
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-sm border border-border">
              {properties.length} imóveis · {partners.length} parceiros
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}