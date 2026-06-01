import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "@/componentes/layout/Header";
import { useSEO } from "@/lib/useSEO";
import { supabase } from "@/lib/supabase";

function formatDate(date?: string) {
  return date ?? "";
}

export default function News() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    initialData: [],
  });

  useSEO({
    title: "Notícias",
    description: "Veja as últimas notícias e atualizações do mercado imobiliário.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container-max section-px">
          <div className="mb-10">
            <p className="section-label mb-2">Notícias</p>
            <h1 className="section-title">Todas as notícias</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-2xl">
              Leia as notícias mais recentes, com conteúdo formatado e imagens exibidas sem corte.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-5">
              <div className="h-48 rounded-sm bg-slate-100 animate-pulse" />
              <div className="h-48 rounded-sm bg-slate-100 animate-pulse" />
            </div>
          ) : news.length === 0 ? (
            <div className="rounded-sm border border-border bg-white p-6 text-sm text-muted-foreground">
              Nenhuma notícia disponível no momento.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to={`/noticia/${item.slug || item.id}`}
                  className="group block rounded-sm overflow-hidden border border-border bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative overflow-hidden bg-slate-100 h-52 sm:h-60 md:h-64">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"}
                      alt={item.title}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {formatDate(item.display_date)}
                    </p>
                    <h2 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
