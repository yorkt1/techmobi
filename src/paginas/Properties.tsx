import React, { useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import PropertyCard from "@/componentes/home/PropertyCard";
import { withShortIds } from "@/lib/property-links";
import FilterSidebar from "@/componentes/properties/FilterSidebar";
import { Skeleton } from "@/componentes/ui/skeleton";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/componentes/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/componentes/ui/select";
import { useSEO } from "@/lib/useSEO";

const DEFAULT_FILTERS = {
  transactions: [],
  types: [],
  bedrooms: 0,
  bathrooms: 0,
  garages: 0,
  minArea: 0,
  priceRange: [0, 5_000_000],
};

function applyFilters(properties, filters) {
  return properties.filter((p) => {
    if (filters.transactions.length && !filters.transactions.includes(p.transaction)) return false;
    if (filters.types.length && !filters.types.includes(p.type)) return false;
    if (filters.bedrooms > 0) {
      if (filters.bedrooms === 5) { if ((p.bedrooms || 0) < 5) return false; }
      else { if (p.bedrooms !== filters.bedrooms) return false; }
    }
    if (filters.bathrooms > 0) {
      if (filters.bathrooms === 4) { if ((p.bathrooms || 0) < 4) return false; }
      else { if (p.bathrooms !== filters.bathrooms) return false; }
    }
    if (filters.garages > 0) {
      if (filters.garages === 4) { if ((p.garages || 0) < 4) return false; }
      else { if (p.garages !== filters.garages) return false; }
    }
    if (filters.minArea > 0 && (p.area || 0) < filters.minArea) return false;
    const [minP, maxP] = filters.priceRange;
    if (p.price < minP || p.price > maxP) return false;
    return true;
  });
}

const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "area_desc", label: "Maior área" },
];

function sortProperties(list, sort) {
  const arr = [...list];
  if (sort === "price_asc") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === "price_desc") arr.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sort === "area_desc") arr.sort((a, b) => (b.area || 0) - (a.area || 0));
  return arr;
}

export default function Properties() {
  const [filters, setFilters] = useState(() => {
    // seed from URL params
    const params = new URLSearchParams(window.location.search);
    const init = { ...DEFAULT_FILTERS };
    const transaction = params.get("transaction");
    const type = params.get("type");
    if (transaction) init.transactions = [transaction];
    if (type) init.types = [type];
    return init;
  });
  const [sort, setSort] = useState("recent");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useSEO({
    title: "Imóveis disponíveis",
    description: "Encontre apartamentos, casas, terrenos e imóveis comerciais em Florianópolis e região. Filtros por preço, tipo e localização.",
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => withShortIds(await base44.entities.Property.list("-created_date", 100)),
  });

  const filtered = useMemo(
    () => sortProperties(applyFilters(properties ?? [], filters), sort),
    [properties, filters, sort]
  );

  const isDefaultFilters =
    JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                Imóveis disponíveis
              </h1>
              {!isLoading && (
                <p className="text-sm text-muted-foreground mt-1">
                  {filtered.length} imóve{filtered.length === 1 ? "l" : "is"} encontrado{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="rounded-sm h-9 text-sm w-44 hidden sm:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden gap-2 rounded-sm h-9"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {!isDefaultFilters && (
                  <span className="w-4 h-4 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                    ·
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar — desktop */}
            <div className="hidden lg:block w-60 shrink-0">
              <div className="bg-background border border-border rounded-sm p-5 sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                  totalResults={filtered.length}
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border border-border rounded-sm overflow-hidden">
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 border border-border rounded-sm">
                  <p className="text-muted-foreground text-sm">Nenhum imóvel encontrado com os filtros selecionados.</p>
                  {!isDefaultFilters && (
                    <button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="mt-3 text-sm text-foreground underline underline-offset-4"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-80 max-w-full h-full bg-background overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-foreground text-sm">Filtros</span>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
              totalResults={filtered.length}
            />
            <div className="mt-6 pt-5 border-t border-border">
              <Button
                className="w-full rounded-sm"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Ver {filtered.length} imóve{filtered.length === 1 ? "l" : "is"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
