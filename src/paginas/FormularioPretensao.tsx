import React, { useState } from "react";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import { MessageCircle, ShieldCheck } from "lucide-react";

type FormData = {
  // 1. Dados pessoais
  nome: string;
  cpf: string;
  whatsapp: string;
  email: string;
  // 2. Perfil do imóvel
  tipo: string;
  tipoOutro: string;
  objetivo: string;
  localizacao: string;
  quartos: string;
  vagas: string;
  area: string;
  // 3. Financeiro
  faixa: string;
  pagamento: string;
  urgencia: string;
  // 4. Observações
  observacoes: string;
};

const INITIAL: FormData = {
  nome: "", cpf: "", whatsapp: "", email: "",
  tipo: "", tipoOutro: "", objetivo: "",
  localizacao: "", quartos: "", vagas: "", area: "",
  faixa: "", pagamento: "", urgencia: "",
  observacoes: "",
};

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: keyof FormData;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
            style={{
              borderColor: value === opt.value ? "#64748b" : "#cbd5e1",
              background: value === opt.value ? "#64748b" : "transparent",
            }}
          >
            {value === opt.value && (
              <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            )}
          </span>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span className="text-sm text-foreground">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="input-field"
    />
  );
}

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 font-bold text-sm text-white"
        style={{ background: "#64748b" }}
      >
        {number}
      </div>
      <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
}

function buildWhatsAppMessage(f: FormData): string {
  const lines = [
    "📋 *FORMULÁRIO DE PRETENSÃO DE COMPRA*",
    "",
    "*1. Dados do Interessado*",
    `• Nome: ${f.nome}`,
    `• CPF: ${f.cpf}`,
    `• WhatsApp: ${f.whatsapp}`,
    `• E-mail: ${f.email}`,
    "",
    "*2. Perfil do Imóvel Desejado*",
    `• Tipo: ${f.tipo === "outro" ? f.tipoOutro : f.tipo}`,
    `• Objetivo: ${f.objetivo}`,
    `• Localização: ${f.localizacao}`,
    `• Quartos: ${f.quartos || "-"} | Vagas: ${f.vagas || "-"} | Área: ${f.area ? f.area + " m²" : "-"}`,
    "",
    "*3. Planejamento Financeiro*",
    `• Faixa de investimento: ${f.faixa}`,
    `• Forma de pagamento: ${f.pagamento}`,
    `• Urgência: ${f.urgencia}`,
    "",
    "*4. Observações*",
    f.observacoes || "—",
  ];
  return lines.join("\n");
}

export default function FormularioPretensao() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleInput = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => set(field)(e.target.value);

  const isValid =
    form.nome.trim() &&
    form.whatsapp.trim() &&
    form.tipo &&
    form.objetivo &&
    form.faixa &&
    form.pagamento &&
    form.urgencia;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const text = encodeURIComponent(buildWhatsAppMessage(form));
    window.open(`https://wa.me/554891932966?text=${text}`, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div
              className="w-16 h-16 rounded-sm mx-auto flex items-center justify-center mb-6"
              style={{ background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.2)" }}
            >
              <MessageCircle className="w-8 h-8" style={{ color: "#64748b" }} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              Formulário enviado!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Suas informações foram encaminhadas ao WhatsApp do corretor Wagner Kaizer. Em breve você receberá o contato.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 text-sm font-medium underline text-muted-foreground hover:text-foreground transition-colors"
            >
              Preencher novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <div
          className="py-14 text-center"
          style={{ background: "linear-gradient(180deg, hsl(222,47%,11%) 0%, hsl(222,47%,15%) 100%)" }}
        >
          <p className="section-label text-white/60 mb-3">Exclusividade e Agilidade</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Formulário de Pretensão de Compra
          </h1>
          <p className="text-white/60 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
            Preencha as informações abaixo para que Wagner Kaizer encontre o imóvel ideal para você com exclusividade e agilidade.
          </p>
        </div>

        {/* Imagem + LGPD */}
        <div className="container-max section-px mt-10">
          <div className="max-w-2xl mx-auto">
            <img
              src="https://res.cloudinary.com/dqewxdbfx/image/upload/v1779028541/WhatsApp_Image_2026-05-17_at_11.34.20_yjhr7v.jpg"
              alt="Wagner Kaizer"
              className="w-full rounded-sm object-cover"
            />
            <div
              className="flex items-center justify-center gap-2 mt-3 px-4 py-2.5 rounded-sm text-sm text-muted-foreground"
              style={{ background: "rgba(100,116,139,0.06)", border: "1px solid rgba(100,116,139,0.15)" }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: "#64748b" }} />
              <span>Suas informações estão protegidas pela <strong className="text-foreground">LGPD</strong></span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="container-max section-px mt-10">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">

            {/* 1. Dados do interessado */}
            <div className="p-6 rounded-sm border border-border bg-white">
              <SectionTitle number={1} title="Dados do Interessado" />
              <div className="space-y-4">
                <Field label="Nome Completo *">
                  <Input
                    placeholder="Seu nome completo"
                    value={form.nome}
                    onChange={handleInput("nome")}
                    required
                  />
                </Field>
                <Field label="CPF">
                  <Input
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={handleInput("cpf")}
                  />
                </Field>
                <Field label="WhatsApp / Telefone *">
                  <Input
                    placeholder="(48) 9 0000-0000"
                    value={form.whatsapp}
                    onChange={handleInput("whatsapp")}
                    required
                  />
                </Field>
                <Field label="E-mail">
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleInput("email")}
                  />
                </Field>
              </div>
            </div>

            {/* 2. Perfil do imóvel */}
            <div className="p-6 rounded-sm border border-border bg-white">
              <SectionTitle number={2} title="Perfil do Imóvel Desejado" />
              <div className="space-y-5">
                <Field label="Tipo de Imóvel *">
                  <RadioGroup
                    name="tipo"
                    value={form.tipo}
                    onChange={set("tipo")}
                    options={[
                      { label: "Terreno", value: "Terreno" },
                      { label: "Casa", value: "Casa" },
                      { label: "Apartamento", value: "Apartamento" },
                      { label: "Outro", value: "outro" },
                    ]}
                  />
                  {form.tipo === "outro" && (
                    <Input
                      className="mt-3"
                      placeholder="Especifique o tipo..."
                      value={form.tipoOutro}
                      onChange={handleInput("tipoOutro")}
                    />
                  )}
                </Field>

                <Field label="Objetivo *">
                  <RadioGroup
                    name="objetivo"
                    value={form.objetivo}
                    onChange={set("objetivo")}
                    options={[
                      { label: "Moradia Própria", value: "Moradia Própria" },
                      { label: "Investimento", value: "Investimento" },
                    ]}
                  />
                </Field>

                <Field label="Localização de Preferência">
                  <Input
                    placeholder="Ex: Norte da Ilha, Canasvieiras..."
                    value={form.localizacao}
                    onChange={handleInput("localizacao")}
                  />
                </Field>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="Quartos">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={form.quartos}
                      onChange={handleInput("quartos")}
                    />
                  </Field>
                  <Field label="Vagas">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={form.vagas}
                      onChange={handleInput("vagas")}
                    />
                  </Field>
                  <Field label="Área m²">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={form.area}
                      onChange={handleInput("area")}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* 3. Planejamento financeiro */}
            <div className="p-6 rounded-sm border border-border bg-white">
              <SectionTitle number={3} title="Planejamento Financeiro" />
              <div className="space-y-5">
                <Field label="Faixa de Investimento *">
                  <RadioGroup
                    name="faixa"
                    value={form.faixa}
                    onChange={set("faixa")}
                    options={[
                      { label: "Até R$ 350 mil", value: "Até R$ 350 mil" },
                      { label: "R$ 350–600 mil", value: "R$ 350–600 mil" },
                      { label: "+ R$ 600 mil", value: "+ R$ 600 mil" },
                      { label: "Alto Padrão", value: "Alto Padrão" },
                    ]}
                  />
                </Field>

                <Field label="Forma de Pagamento *">
                  <RadioGroup
                    name="pagamento"
                    value={form.pagamento}
                    onChange={set("pagamento")}
                    options={[
                      { label: "À Vista", value: "À Vista" },
                      { label: "Entrada + Parcelas", value: "Entrada + Parcelas" },
                      { label: "Permuta", value: "Permuta" },
                    ]}
                  />
                </Field>

                <Field label="Urgência na Compra *">
                  <RadioGroup
                    name="urgencia"
                    value={form.urgencia}
                    onChange={set("urgencia")}
                    options={[
                      { label: "Imediata", value: "Imediata" },
                      { label: "Até 6 meses", value: "Até 6 meses" },
                      { label: "Monitorando", value: "Monitorando" },
                    ]}
                  />
                </Field>
              </div>
            </div>

            {/* 4. Observações */}
            <div className="p-6 rounded-sm border border-border bg-white">
              <SectionTitle number={4} title="Observações Adicionais" />
              <textarea
                rows={5}
                placeholder="Descreva detalhes adicionais sobre o imóvel que procura, preferências específicas, etc."
                value={form.observacoes}
                onChange={handleInput("observacoes")}
                className="input-field resize-none"
              />
            </div>

            {/* Aviso de sigilo */}
            <div
              className="flex items-start gap-3 px-5 py-4 rounded-sm text-sm text-muted-foreground"
              style={{ background: "rgba(100,116,139,0.06)", border: "1px solid rgba(100,116,139,0.15)" }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#64748b" }} />
              <p>
                As informações aqui prestadas são <strong className="text-foreground">sigilosas</strong> e serão utilizadas exclusivamente pelo Corretor Wagner Kaizer.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isValid ? "hsl(222,47%,11%)" : undefined,
                color: "#fff",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Enviar pelo WhatsApp
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
