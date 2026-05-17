import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Lock, MessageCircle } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-bg dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-sm bg-primary text-primary-foreground"
              >
                <span className="font-bold text-sm select-none">WK</span>
              </div>
              <div>
                <p className="font-serif font-bold text-base text-foreground leading-none">Wagner Kaizer</p>
                <p className="text-[10px] uppercase tracking-widest mt-0.5 text-muted-foreground">
                  Consultoria Imobiliária
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Especialistas em imóveis residenciais e comerciais. Atendimento personalizado com compromisso e transparência.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/wagnerkaizercorretorimoveis"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-200 border border-border bg-secondary hover:bg-muted"
                style={{ color: "#E1306C" }}
              >
                <FaInstagram size={17} />
              </a>
              <a
                href="https://www.facebook.com/share/1DqbtUNyhb/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-200 border border-border bg-secondary hover:bg-muted"
                style={{ color: "#1877F2" }}
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://wa.me/554891932966"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-200 border border-border bg-secondary hover:bg-muted"
                style={{ color: "#25D366" }}
              >
                <FaWhatsapp size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Início", to: "/" },
                { label: "Comprar imóvel", to: "/imoveis?transaction=venda" },
                { label: "Alugar imóvel", to: "/imoveis?transaction=aluguel" },
                { label: "Todos os imóveis", to: "/imoveis" },
                { label: "Sobre nós", to: "/#sobre" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="w-4 h-px transition-all duration-200 group-hover:w-6 bg-primary"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-secondary border border-border text-muted-foreground"
                >
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone / WhatsApp</p>
                  <a href="tel:+554891932966" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                    (48) 9193-2966
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-secondary border border-border text-muted-foreground"
                >
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <a href="mailto:contato@wagnerkaizer.com.br" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
                    contato@wagnerkaizer.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5 bg-secondary border border-border text-muted-foreground"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Região de atuação</p>
                  <p className="text-sm text-foreground font-medium">Santa Catarina — SC</p>
                </div>
              </li>
            </ul>
          </div>

          {/* CTA Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-5">
              Atendimento
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Fale diretamente com um de nossos corretores especializados e receba atendimento personalizado.
            </p>
            <a
              href="https://wa.me/554891932966"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-sm transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Wagner Kaizer Consultoria Imobiliária. Todos os direitos reservados. CRECI 71853 F
          </p>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <Lock className="w-3 h-3" />
            Área do corretor
          </Link>
        </div>
      </div>
    </footer>
  );
}
