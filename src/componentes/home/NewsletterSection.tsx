import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  tipoOutro: string;
};

const INITIAL: FormData = {
  nome: "",
  email: "",
  telefone: "",
  tipo: "",
  tipoOutro: "",
};

const TIPOS = [
  { label: "Terreno", value: "Terreno" },
  { label: "Casa", value: "Casa" },
  { label: "Apartamento", value: "Apartamento" },
  { label: "Outro", value: "outro" },
];

export default function NewsletterSection() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInput =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid = form.nome.trim() && form.telefone.trim() && form.tipo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          nome:        form.nome.trim(),
          email:       form.email.trim() || "não informado",
          telefone:    form.telefone.trim(),
          tipo_imovel: form.tipo === "outro" ? form.tipoOutro : form.tipo,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Erro ao enviar. Tente novamente.");
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

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
            Quer vender seu imóvel?
          </h2>
          <p className="text-white/70 mt-3 text-base font-medium">
            Cadastre-se gratuitamente!
          </p>

          {status === "success" ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <p className="text-white font-semibold">Cadastro realizado com sucesso!</p>
              <p className="text-white/50 text-sm">
                Wagner Kaizer entrará em contato em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-3 text-left">

              <input
                type="text"
                placeholder="Nome *"
                value={form.nome}
                onChange={handleInput("nome")}
                required
                className="w-full h-12 px-4 text-sm rounded-sm bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <input
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleInput("email")}
                className="w-full h-12 px-4 text-sm rounded-sm bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <input
                type="tel"
                placeholder="Telefone *"
                value={form.telefone}
                onChange={handleInput("telefone")}
                required
                className="w-full h-12 px-4 text-sm rounded-sm bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />

              <div className="flex flex-wrap gap-3 pt-1">
                {TIPOS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <span
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        borderColor: form.tipo === opt.value ? "#94a3b8" : "rgba(255,255,255,0.3)",
                        background: form.tipo === opt.value ? "#94a3b8" : "transparent",
                      }}
                    >
                      {form.tipo === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="tipo"
                      value={opt.value}
                      checked={form.tipo === opt.value}
                      onChange={() => setForm((prev) => ({ ...prev, tipo: opt.value }))}
                      className="sr-only"
                    />
                    <span className="text-sm text-white/80">{opt.label}</span>
                  </label>
                ))}
              </div>

              {form.tipo === "outro" && (
                <input
                  type="text"
                  placeholder="Especifique o tipo..."
                  value={form.tipoOutro}
                  onChange={handleInput("tipoOutro")}
                  className="w-full h-12 px-4 text-sm rounded-sm bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
              )}

              <button
                type="submit"
                disabled={!isValid || status === "loading"}
                className="w-full flex items-center justify-center gap-2 h-12 text-sm font-semibold rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                style={{
                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                  color: "#001529",
                }}
              >
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : (
                  <>Quero cadastrar meu imóvel <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {errorMsg && (
                <p className="text-red-400 text-xs text-center">{errorMsg}</p>
              )}

              <p className="text-white/25 text-xs text-center">
                Seus dados são sigilosos. Cancele a qualquer momento.
              </p>

            </form>
          )}

        </div>
      </div>
    </section>
  );
}
