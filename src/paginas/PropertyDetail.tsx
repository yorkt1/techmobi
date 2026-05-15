import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import { Button } from "@/componentes/ui/button";
import { Badge } from "@/componentes/ui/badge";
import { Skeleton } from "@/componentes/ui/skeleton";
import { Bed, Bath, Maximize2, MapPin, ArrowLeft, MessageCircle, Phone } from "lucide-react";

function formatPrice(value) {
  if (!value) return "Consulte";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function formatType(type) {
  const map = {
    apartamento: "Apartamento",
    casa: "Casa",
    terreno: "Terreno",
    comercial: "Comercial",
    cobertura: "Cobertura",
    kitnet: "Kitnet",
  };
  return map[type] || type;
}

export default function PropertyDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split("/");
  const propertyId = pathParts[pathParts.length - 1];

  const { data: properties, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => base44.entities.Property.list(),
    initialData: [],
  });

  const property = properties.find((p) => String(p.id) === propertyId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full rounded-sm" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-xl font-semibold text-foreground">Imóvel não encontrado</h1>
          <p className="text-muted-foreground mt-2">O imóvel que você está procurando não existe.</p>
          <Button variant="outline" className="mt-6 gap-2 rounded-sm" asChild>
            <Link to="/imoveis">
              <ArrowLeft className="w-4 h-4" />
              Voltar para imóveis
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back */}
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para imóveis
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2">
              {/* Image */}
              <div className="overflow-hidden rounded-sm border border-border">
                <img
                  src={property.image_url || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-64 sm:h-80 lg:h-[480px] object-cover"
                />
              </div>

              {/* Details */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="rounded-sm text-xs">
                    {property.transaction === "venda" ? "Venda" : "Aluguel"}
                  </Badge>
                  <Badge variant="secondary" className="rounded-sm text-xs">
                    {formatType(property.type)}
                  </Badge>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  {property.title}
                </h1>

                <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {property.neighborhood && `${property.neighborhood}, `}{property.city}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mt-6 py-4 border-t border-b border-border">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{property.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Quartos</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{property.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Banheiros</p>
                      </div>
                    </div>
                  )}
                  {property.area > 0 && (
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{property.area} m²</p>
                        <p className="text-xs text-muted-foreground">Área</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-foreground mb-3">Descrição</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="border border-border rounded-sm p-6 sticky top-24">
                <p className="text-2xl font-bold text-foreground tracking-tight">
                  {formatPrice(property.price)}
                  {property.transaction === "aluguel" && (
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  )}
                </p>

                <div className="space-y-3 mt-6">
                  <Button className="w-full gap-2 rounded-sm h-11" asChild>
                    <a
                      href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no imóvel: ${property.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Falar no WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full gap-2 rounded-sm h-11" asChild>
                    <a href="tel:+5511999999999">
                      <Phone className="w-4 h-4" />
                      Ligar agora
                    </a>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Código do imóvel: #{property.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
