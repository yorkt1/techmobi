import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/componentes/layout/Header";
import { useSEO } from "@/lib/useSEO";
import { supabase } from "@/lib/supabase";

function formatDate(date?: string) {
  return date ?? "";
}

export default function NewsDetail() {
  const { slug } = useParams();

  const { data: news, isLoading } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(slug),
  });

  useSEO({
    title: news ? news.title : "Notícia",
    description: news?.excerpt ?? "Detalhes da notícia.",
    image: news?.image_url ?? undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container-max section-px">
          {isLoading ? (
            <div className="rounded-sm border border-border bg-white p-6">Carregando...</div>
          ) : !news ? (
            <div className="rounded-sm border border-border bg-white p-6">
              <h1 className="text-xl font-semibold text-foreground">Notícia não encontrada</h1>
              <p className="mt-2 text-sm text-muted-foreground">A notícia solicitada não está disponível.</p>
              <Link
                to="/noticias"
                className="mt-4 inline-flex items-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Voltar para notícias
              </Link>
            </div>
          ) : (
            <article className="rounded-sm border border-border bg-white shadow-sm overflow-hidden">
              <div className="relative overflow-hidden bg-slate-100 h-72 sm:h-80 md:h-96 lg:h-[420px]">
                <img
                  src={news.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"}
                  alt={news.title}
                  className="h-full w-full object-contain object-center"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {formatDate(news.display_date)}
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">{news.title}</h1>
                <div className="mt-6 prose max-w-none prose-slate text-sm leading-7 text-muted-foreground">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: news.content ?? news.excerpt ?? "",
                    }}
                  />
                </div>
                <Link
                  to="/noticias"
                  className="mt-8 inline-flex items-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Voltar para notícias
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
