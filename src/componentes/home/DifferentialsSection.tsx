import React from "react";
import { Users, ShieldCheck, Zap, Headphones, MapPin } from "lucide-react";

const DIFFERENTIALS = [
  {
    icon: Users,
    title: "Atendimento personalizado",
    description: "Acompanhamento dedicado em cada etapa do processo.",
  },
  {
    icon: ShieldCheck,
    title: "Imóveis verificados",
    description: "Todos os imóveis são checados e documentados.",
  },
  {
    icon: Zap,
    title: "Facilidade no processo",
    description: "Processos simplificados para compra e locação.",
  },
  {
    icon: Headphones,
    title: "Suporte rápido",
    description: "Resposta ágil por WhatsApp, telefone ou e-mail.",
  },
  {
    icon: MapPin,
    title: "Atendimento regional",
    description: "Conhecimento profundo do mercado local.",
  },
];

export default function DifferentialsSection() {
  return (
    <section className="section-py relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--navy-900) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative container-max section-px">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-slate-600 tracking-wider uppercase mb-3">Nossos diferenciais</p>
          <h2 className="text-3xl font-serif font-bold text-navy-900">Por que escolher Wagner Kaizer</h2>
          <div className="w-24 h-0.5 mx-auto mt-5 bg-slate-500 opacity-60" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DIFFERENTIALS.map((item, i) => (
            <div
              key={item.title}
              className="group text-center p-6 rounded-sm bg-white border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-500/30"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div className="w-12 h-12 mx-auto rounded-sm flex items-center justify-center mb-4 transition-all duration-300 bg-slate-500/10 border border-slate-500/20 group-hover:bg-slate-500 group-hover:text-white text-slate-600">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
