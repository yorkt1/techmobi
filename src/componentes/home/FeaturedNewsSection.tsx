import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

function formatDate(date?: string) {
  if (!date) return "";
  return date;
}

function SkeletonItem() {
  return (
    <article className="rounded-sm overflow-hidden border border-border bg-white shadow-sm">
      <div className="grid gap-5 grid-cols-1 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] items-center">
        <div className="h-52 bg-slate-100 skeleton" />
        <div className="min-w-0 p-6 space-y-4">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
      </div>
    </article>
  );
}

export default function FeaturedNewsSection() {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["featured-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section className="section-py">
      <div className="container-max section-px">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="section-label mb-2">Notícias</p>
            <h2 className="section-title">Notícias em destaque</h2>
          </div>
        </div>

        <div className="space-y-5">
          {isLoading ? (
            <>
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </>
          ) : news.length === 0 ? (
            <div className="rounded-sm border border-border bg-white p-6 text-sm text-muted-foreground">
              Nenhuma notícia cadastrada. Acesse o admin para adicionar notícias em destaque.
            </div>
          ) : (
            news.map((item) => (
              <Link
                key={item.id}
                to={`/noticia/${item.slug || item.id}`}
                className="group block"
              >
              <article className="rounded-sm overflow-hidden border border-border bg-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                <div className="grid gap-5 grid-cols-1 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] items-center">
                  <div className="relative overflow-hidden bg-slate-100 h-52 sm:h-60 md:h-72">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"}
                      alt={item.title}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="min-w-0 p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {formatDate(item.display_date)}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-foreground break-words">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">{item.excerpt}</p>
                  </div>
                </div>
              </article>
            </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
