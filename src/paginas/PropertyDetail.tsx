import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Header from "@/componentes/layout/Header";
import Footer from "@/componentes/layout/Footer";
import { Button } from "@/componentes/ui/button";
import { Badge } from "@/componentes/ui/badge";
import { Skeleton } from "@/componentes/ui/skeleton";
import { Bed, Bath, Maximize2, MapPin, ArrowLeft, MessageCircle, Phone, Car, ChevronLeft, ChevronRight, Share2, Check } from "lucide-react";
import { useSEO } from "@/lib/useSEO";
import { resolvePropertyId, withShortIds, propertySharePath } from "@/lib/property-links";

const FALLBACK_PHONE = "554891932966";

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
  const { id: routeId } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => withShortIds(await base44.entities.Property.list()),
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => base44.entities.Settings.get(),
  });

  const phone = settings?.phone || FALLBACK_PHONE;
  const realId = resolvePropertyId(routeId, properties ?? []);
  const property = properties?.find((p) => p.id === realId);

  const handleShare = async () => {
    if (!property) return;
    const url = `${window.location.origin}${propertySharePath(property)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* usuário cancelou o compartilhamento — ignora */
    }
  };

  const mainImage = Array.isArray(property?.images) && property.images.length > 0
    ? property.images[0]
    : property?.image_url ?? "";

  useSEO({
    title: property ? `${property.title} — ${property.city}` : "Imóvel",
    description: property?.description
      ? property.description.slice(0, 160)
      : `${property?.type ?? "Imóvel"} ${property?.transaction === "venda" ? "à venda" : "para aluguel"} em ${property?.city ?? "Florianópolis"}`,
    image: mainImage || undefined,
  });

  const allImages: string[] = (() => {
    if (!property) return [];
    const imgs = Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : property.image_url
      ? [property.image_url]
      : [];
    return imgs;
  })();

  const prevImg = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % allImages.length);

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

  const codeLabel = property.code ? `#${property.code}` : `#${String(property.id).slice(0, 8).toUpperCase()}`;

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
            <div className="lg:col-span-2 min-w-0">
              {/* Gallery */}
              <div className="overflow-hidden rounded-sm border border-border">
                {allImages.length > 0 ? (
                  <div className="relative">
                    <img
                      src={allImages[activeImg]}
                      alt={`${property.title} — foto ${activeImg + 1}`}
                      className="w-full aspect-[4/3] object-contain bg-slate-100"
                    />
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImg}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImg}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white px-2 py-1 rounded-sm">
                          {activeImg + 1} / {allImages.length}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 sm:h-80 lg:h-[480px] bg-slate-100 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Sem foto disponível</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {allImages.map((url, idx) => (
                    <button
                      key={url + idx}
                      onClick={() => setActiveImg(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden border-2 transition-colors ${
                        idx === activeImg ? "border-navy-900" : "border-transparent"
                      }`}
                    >
                      <img src={url} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

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
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-6 py-4 border-t border-b border-border">
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
                  {property.garages > 0 && (
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{property.garages}</p>
                        <p className="text-xs text-muted-foreground">Garagens</p>
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
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="min-w-0">
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
                      href={`https://wa.me/${phone}?text=Olá! Tenho interesse no imóvel: ${encodeURIComponent(property.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Falar no WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full gap-2 rounded-sm h-11" asChild>
                    <a href={`tel:+${phone}`}>
                      <Phone className="w-4 h-4" />
                      Ligar agora
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full gap-2 rounded-sm h-11"
                    onClick={handleShare}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {copied ? "Link copiado!" : "Compartilhar"}
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Código do imóvel: {codeLabel}
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
