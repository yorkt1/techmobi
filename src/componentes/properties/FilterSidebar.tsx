import React from "react";
import { Slider } from "@/componentes/ui/slider";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/componentes/ui/button";

const TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "terreno", label: "Terreno" },
  { value: "comercial", label: "Comercial" },
  { value: "cobertura", label: "Cobertura" },
  { value: "kitnet", label: "Kitnet" },
];

const TRANSACTIONS = [
  { value: "venda", label: "Venda" },
  { value: "aluguel", label: "Aluguel" },
];

function formatCurrency(v) {
  if (v >= 1_000_000)
    return `R$ ${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return `R$ ${v}`;
}

function SectionTitle({ children }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

function CheckboxGroup({ options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((v) => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div
            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
              selected.includes(opt.value)
                ? "bg-foreground border-foreground"
                : "border-border group-hover:border-muted-foreground"
            }`}
            onClick={() => toggle(opt.value)}
          >
            {selected.includes(opt.value) && (
              <svg
                className="w-2.5 h-2.5 text-background"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function CounterButtons({ value, onChange, max = 5, label }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onChange(0)}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
            value === 0
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:border-muted-foreground"
          }`}
        >
          Todos
        </button>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n === value ? 0 : n)}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
              value === n
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            {n === max ? `${n}+` : n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onClear, totalResults }) {
  const activeCount = [
    filters.transactions.length,
    filters.types.length,
    filters.bedrooms > 0 ? 1 : 0,
    filters.bathrooms > 0 ? 1 : 0,
    filters.garages > 0 ? 1 : 0,
    filters.minArea > 0 ? 1 : 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 5_000_000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-foreground" />
          <span className="text-sm font-semibold text-foreground">Filtros</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Finalidade */}
        <div>
          <SectionTitle>Finalidade</SectionTitle>
          <CheckboxGroup
            options={TRANSACTIONS}
            selected={filters.transactions}
            onChange={(v) => onChange({ ...filters, transactions: v })}
          />
        </div>

        <div className="border-t border-border" />

        {/* Tipo */}
        <div>
          <SectionTitle>Tipo de imóvel</SectionTitle>
          <CheckboxGroup
            options={TYPES}
            selected={filters.types}
            onChange={(v) => onChange({ ...filters, types: v })}
          />
        </div>

        <div className="border-t border-border" />

        {/* Faixa de preço */}
        <div>
          <SectionTitle>Faixa de preço</SectionTitle>
          <div className="flex justify-between text-xs font-medium text-foreground mb-4">
            <span>{formatCurrency(filters.priceRange[0])}</span>
            <span>{formatCurrency(filters.priceRange[1])}</span>
          </div>
          <Slider
            min={0}
            max={5_000_000}
            step={50_000}
            value={filters.priceRange}
            onValueChange={(v) => onChange({ ...filters, priceRange: v })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>R$ 0</span>
            <span>R$ 5M+</span>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Quartos */}
        <div>
          <SectionTitle>Quartos e banheiros</SectionTitle>
          <div className="space-y-4">
            <CounterButtons
              label="Quartos"
              value={filters.bedrooms}
              onChange={(v) => onChange({ ...filters, bedrooms: v })}
              max={5}
            />
            <CounterButtons
              label="Banheiros"
              value={filters.bathrooms}
              onChange={(v) => onChange({ ...filters, bathrooms: v })}
              max={4}
            />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Garagem */}
        <div>
          <SectionTitle>Vagas de garagem</SectionTitle>
          <CounterButtons
            label=""
            value={filters.garages}
            onChange={(v) => onChange({ ...filters, garages: v })}
            max={4}
          />
        </div>

        <div className="border-t border-border" />

        {/* Área mínima */}
        <div>
          <SectionTitle>Área mínima</SectionTitle>
          <div className="flex justify-between text-xs font-medium text-foreground mb-4">
            <span>{filters.minArea > 0 ? `${filters.minArea} m²` : "Sem mínimo"}</span>
          </div>
          <Slider
            min={0}
            max={500}
            step={10}
            value={[filters.minArea]}
            onValueChange={([v]) => onChange({ ...filters, minArea: v })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0 m²</span>
            <span>500 m²+</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
