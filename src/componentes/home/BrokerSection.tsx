import React from "react";
import { MessageCircle, Phone } from "lucide-react";

const BROKER_IMAGE = "https://res.cloudinary.com/dqewxdbfx/image/upload/v1778807059/Design_sem_nome_9_sm276u.png";

export default function BrokerSection() {
  return (
    <section id="sobre" className="section-py">
      <div className="container-max section-px">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Photo */}
          <div className="relative flex justify-center lg:justify-start">
            {/* Decorative element behind photo */}
            <div
              className="absolute -top-4 -left-4 w-full h-full max-w-xs rounded-sm border-2 border-muted"
              style={{ zIndex: 0 }}
            />
            <div className="relative z-10 overflow-hidden rounded-sm max-w-xs w-full border border-border bg-muted/20">
              <img
                src={BROKER_IMAGE}
                alt="Wagner Kaizer - Corretor de imóveis"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
            </div>
            {/* CRECI badge */}
            <div className="absolute -bottom-4 -right-4 z-20 bg-background border border-border px-4 py-3 rounded-sm text-center shadow-sm">
              <p className="text-sm font-bold font-serif text-foreground">CRECI 71853 F</p>
              <p className="text-xs font-bold font-serif text-muted-foreground mt-0.5">CNAI 55130</p>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Seu corretor</p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Wagner Kaizer
            </h2>

            {/* Divider */}
            <div className="w-16 h-0.5 mt-4 mb-6 bg-muted-foreground/30" />

            <p className="text-muted-foreground leading-relaxed text-base">
              Profissional com mais de <strong className="text-foreground">10 anos de experiência</strong> no mercado imobiliário.
              Especializado em imóveis residenciais e comerciais na região, com atendimento
              personalizado e foco total na satisfação do cliente.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { number: "500+", label: "Clientes atendidos" },
                { number: "10+", label: "Anos de mercado" },
                { number: "200+", label: "Imóveis vendidos" },
              ].map(({ number, label }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-sm bg-muted/30 border border-border"
                >
                  <p className="text-2xl font-bold font-serif text-foreground">{number}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              <a
                href="https://wa.me/554891932966"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-sm transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
              <a
                href="tel:+554891932966"
                className="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-sm transition-all duration-200 border border-border bg-secondary text-foreground hover:bg-muted"
              >
                <Phone className="w-4 h-4" />
                (48) 9193-2966
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
