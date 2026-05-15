import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (transaction) params.set("transaction", transaction);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0 bg-slate-50">
        {/* Decorative orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #64748b, transparent)" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #94a3b8, transparent)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(var(--navy-900) 1px, transparent 1px), linear-gradient(90deg, var(--navy-900) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text Content */}
          <div className="animate-fade-up">
            <div className="section-label mb-4 flex items-center gap-2">
              <div className="w-8 h-px" style={{ background: "#64748b" }} />
              Consultoria Imobiliária Premium
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Encontre o imóvel{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ideal para você
              </span>
            </h1>

            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-lg">
              Atendimento personalizado e especializado. Mais de 10 anos de experiência no mercado imobiliário regional.
            </p>

            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-bold font-serif" style={{ color: "#64748b" }}>200+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Imóveis</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold font-serif" style={{ color: "#64748b" }}>10+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Anos</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold font-serif" style={{ color: "#64748b" }}>98%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Satisfação</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-up animation-delay-200">
            <div
              className="absolute -inset-4 rounded-sm opacity-20 blur-2xl"
              style={{ background: "linear-gradient(135deg, #64748b, #001F3F)" }}
            />
            <div className="relative overflow-hidden rounded-sm" style={{ border: "1px solid rgba(197,160,89,0.2)" }}>
              <img
                src="https://media.base44.com/images/public/6a061741fae33fcd75ac930d/d5acb68d7_generated_ee5b5b9f.png"
                alt="Imóvel premium Wagner Kaizer"
                className="w-full h-72 sm:h-96 lg:h-[480px] object-cover"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,21,41,0.6) 0%, transparent 50%)" }}
              />

              {/* Floating badge */}
              <div
                className="absolute bottom-5 left-5 glass px-4 py-3 rounded-sm flex items-center gap-3"
                style={{ border: "1px solid rgba(197,160,89,0.25)" }}
              >
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center"
                  style={{ background: "rgba(197,160,89,0.15)" }}
                >
                  <Home className="w-4 h-4" style={{ color: "#64748b" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Novos imóveis</p>
                  <p className="text-xs text-muted-foreground">adicionados esta semana</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-12 animate-fade-up animation-delay-300">
          <div
            className="glass p-5 rounded-sm"
            style={{ border: "1px solid rgba(197,160,89,0.15)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#64748b" }}>
              Buscar imóveis
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Finalidade</label>
                <select value={transaction} onChange={(e) => setTransaction(e.target.value)}>
                  <option value="">Comprar ou Alugar</option>
                  <option value="venda">Comprar</option>
                  <option value="aluguel">Alugar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Tipo do imóvel</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="kitnet">Kitnet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Localização</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cidade ou bairro..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="input-field pr-10"
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full h-10 flex items-center justify-center gap-2 text-sm font-semibold rounded-sm transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #94a3b8, #64748b)",
                    color: "#001529",
                    boxShadow: "0 0 20px rgba(197,160,89,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 35px rgba(197,160,89,0.5)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(197,160,89,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  <Search className="w-4 h-4" />
                  Buscar Imóveis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
      />
    </section>
  );
}
