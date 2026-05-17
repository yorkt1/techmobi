import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await base44.entities.Subscriber.create({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        created_at: new Date().toISOString(),
      });
      setStatus("success");
    } catch (err: any) {
      if (err?.message?.includes("duplicate") || err?.code === "23505") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <section
      className="py-16 lg:py-20"
      style={{
        background: "linear-gradient(135deg, hsl(222,47%,11%) 0%, hsl(222,47%,15%) 100%)",
      }}
    >
      <div className="container-max section-px">
        <div className="max-w-2xl mx-auto text-center">

          <div
            className="w-12 h-12 rounded-sm mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.3)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "#94a3b8" }} />
          </div>

          <p className="section-label text-white/50 mb-3">Fique por dentro</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
            Cadastre-se para receber as melhores ofertas e dicas do mercado imobiliário de SC
          </h2>
          <p className="text-white/50 mt-4 text-sm leading-relaxed max-w-md mx-auto">
            Receba em primeira mão imóveis exclusivos, oportunidades Off-Market e conteúdo especializado sobre o mercado do Norte da Ilha.
          </p>

          {status === "success" ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <p className="text-white font-semibold">Cadastro realizado com sucesso!</p>
              <p className="text-white/50 text-sm">
                Em breve você receberá nossas novidades no e-mail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 h-12 px-4 text-sm rounded-sm bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 px-4 text-sm rounded-sm bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 px-8 h-12 text-sm font-semibold rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                  color: "#001529",
                }}
              >
                {status === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    Quero receber as ofertas
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {errorMsg && (
                <p className="text-red-400 text-xs text-center">{errorMsg}</p>
              )}

              <p className="text-white/25 text-xs">
                Seus dados são sigilosos. Cancele a qualquer momento.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
