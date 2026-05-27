import React from "react";

const NEWS = [
  {
    id: "1",
    title: "Lançamento de novo condomínio na área Sul",
    excerpt:
      "O mercado imobiliário regional ganha mais um empreendimento com apartamentos modernos, área de lazer completa e localização estratégica próxima à praia.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
    date: "24 de maio de 2026",
  },
  {
    id: "2",
    title: "Aluguel residencial cresce 15% neste semestre",
    excerpt:
      "A demanda por imóveis para aluguel apresentou alta, impulsionada por profissionais que buscam flexibilidade e por famílias em transição.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80",
    date: "20 de maio de 2026",
  },
  {
    id: "3",
    title: "Dicas para valorizar seu imóvel antes da venda",
    excerpt:
      "Pequenas reformas e ajustes de apresentação podem elevar o valor do imóvel e acelerar a negociação com compradores qualificados.",
    image:
      "https://images.unsplash.com/photo-1465806821048-7a0ccc18e68d?w=900&q=80",
    date: "18 de maio de 2026",
  },
];

export default function FeaturedNewsSection() {
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
          {NEWS.map((news) => (
            <article
              key={news.id}
              className="rounded-sm overflow-hidden border border-border bg-white shadow-sm"
            >
              <div className="grid gap-5 md:grid-cols-[320px_minmax(0,1fr)] items-center">
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {news.date}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{news.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{news.excerpt}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
