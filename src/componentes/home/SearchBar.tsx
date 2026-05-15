import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/componentes/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/componentes/ui/select";
import { Input } from "@/componentes/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (transaction) params.set("transaction", transaction);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (priceRange) params.set("price", priceRange);
    if (bedrooms) params.set("bedrooms", bedrooms);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="bg-background border border-border rounded-sm p-4 lg:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Transaction */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            Finalidade
          </label>
          <Select value={transaction} onValueChange={setTransaction}>
            <SelectTrigger className="rounded-sm h-10">
              <SelectValue placeholder="Comprar ou Alugar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venda">Comprar</SelectItem>
              <SelectItem value="aluguel">Alugar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            Tipo
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="rounded-sm h-10">
              <SelectValue placeholder="Tipo do imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="cobertura">Cobertura</SelectItem>
              <SelectItem value="kitnet">Kitnet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            Localização
          </label>
          <Input
            placeholder="Cidade ou bairro"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-sm h-10"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            Faixa de Preço
          </label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="rounded-sm h-10">
              <SelectValue placeholder="Faixa de preço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-200000">Até R$ 200 mil</SelectItem>
              <SelectItem value="200000-500000">R$ 200 a 500 mil</SelectItem>
              <SelectItem value="500000-1000000">R$ 500 mil a 1M</SelectItem>
              <SelectItem value="1000000+">Acima de R$ 1M</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            Quartos
          </label>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="rounded-sm h-10">
              <SelectValue placeholder="Quartos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 quarto</SelectItem>
              <SelectItem value="2">2 quartos</SelectItem>
              <SelectItem value="3">3 quartos</SelectItem>
              <SelectItem value="4">4+ quartos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full h-10 rounded-sm gap-2 font-medium"
          >
            <Search className="w-4 h-4" />
            Buscar imóveis
          </Button>
        </div>
      </div>
    </div>
  );
}
