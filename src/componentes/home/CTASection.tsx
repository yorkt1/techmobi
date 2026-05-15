import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contato" className="section-py">
      <div className="container-max section-px">
        <div
          className="relative overflow-hidden rounded-sm p-10 lg:p-16 text-center bg-navy-900 text-white"
        >
          {/* Decorative orb */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #64748b, transparent)" }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4" style={{ color: "#64748b" }} />
              <p className="section-label">Entre em contato</p>
              <Sparkles className="w-4 h-4" style={{ color: "#64748b" }} />
            </div>

            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground max-w-2xl mx-auto">
              Precisa de ajuda para encontrar o imóvel ideal?
            </h2>

            <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-base leading-relaxed">
              Entre em contato e receba atendimento personalizado. Nosso corretor vai te ajudar em cada etapa do processo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                  color: "#001529",
                  boxShadow: "0 0 30px rgba(197,160,89,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 50px rgba(197,160,89,0.6)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(197,160,89,0.4)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
              <a
                href="tel:+5511999999999"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                style={{ border: "1px solid rgba(197,160,89,0.25)", background: "rgba(197,160,89,0.05)" }}
              >
                (11) 99999-9999
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
