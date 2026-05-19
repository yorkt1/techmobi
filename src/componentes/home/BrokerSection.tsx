import { Link } from "react-router-dom";
import { MessageCircle, Phone, ClipboardList } from "lucide-react";

const BROKER_IMAGE = "https://res.cloudinary.com/dqewxdbfx/image/upload/v1778982461/Design_sem_nome_11_jekthr.png";

export default function BrokerSection() {
  return (
    <section id="sobre" className="section-py">
      <div className="container-max section-px">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Photo */}
          <div className="relative flex justify-center lg:justify-start">
            <div
              className="absolute -top-4 -left-4 w-full h-full max-w-xs rounded-sm border-2 border-muted"
              style={{ zIndex: 0 }}
            />
            <div className="relative z-10 overflow-hidden rounded-sm max-w-xs w-full border border-border bg-muted/20">
              <img
                src={BROKER_IMAGE}
                alt="Wagner Kaizer - Corretor de imóveis em Florianópolis"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
            </div>
            {/* CRECI badge */}
            <div className="absolute -bottom-4 -right-4 z-20 bg-background border border-border px-4 py-3 rounded-sm text-center shadow-sm">
              <p className="text-sm font-extrabold text-foreground">CRECI 71853 F</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">CNAI 55130</p>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="section-label mb-3">Seu Especialista em Florianópolis</p>
            <h2 className="font-sans text-3xl lg:text-4xl font-extrabold text-foreground normal-case tracking-normal">
              Wagner Kaizer
            </h2>

            <div className="w-16 h-0.5 mt-4 mb-6 bg-muted-foreground/30" />

            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              <p>
                Há <strong className="text-foreground">10 anos vivendo em Florianópolis</strong>, lhe ofereço um serviço de consultoria imobiliária pautado em real conhecimento da região, com transparência, profissionalismo e resultados.
              </p>
              <p>
                Sou seu Corretor e Avaliador de Imóveis com os registros{" "}
                <strong className="text-foreground">CRECI 71853F</strong> e{" "}
                <strong className="text-foreground">CNAI 55130</strong>, garantindo total segurança jurídica.
              </p>
              <p>
                Com uma sólida experiência de mais de{" "}
                <strong className="text-foreground">12 anos no Jornalismo e Comunicação</strong>{" "}
                (MTE 16446/RS), utilizo uma abordagem de marketing estratégico diferenciada para maximizar a visibilidade e o valor de sua transação.
              </p>
              <p>
                Especialista no <strong className="text-foreground">Norte da Ilha</strong>, minha curadoria técnica e o acesso exclusivo ao mercado{" "}
                <strong className="text-foreground">Off-Market</strong> proporcionam oportunidades únicas e personalizadas para cada cliente.
              </p>
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

            <Link
              to="/formulario"
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-sm transition-all duration-200 border border-border bg-secondary text-foreground hover:bg-muted"
            >
              <ClipboardList className="w-4 h-4" />
              Preencher Formulário de Pretensão de Compra
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
