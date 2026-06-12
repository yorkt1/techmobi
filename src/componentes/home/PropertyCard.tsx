import React from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, MapPin, Car } from "lucide-react";
import { propertyPath } from "@/lib/property-links";

function formatPrice(value: number | undefined) {
  if (!value) return "Consulte";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function formatType(type: string) {
  const map: Record<string, string> = {
    apartamento: "Apartamento",
    casa: "Casa",
    terreno: "Terreno",
    comercial: "Comercial",
    cobertura: "Cobertura",
    kitnet: "Kitnet",
  };
  return map[type] || type;
}

interface Property {
  id: string;
  shortId?: number;
  title: string;
  price?: number;
  transaction?: string;
  type?: string;
  image_url?: string;
  images?: string[];
  neighborhood?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  area?: number;
}

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage = (Array.isArray(property.images) && property.images.length > 0)
    ? property.images[0]
    : property.image_url;

  return (
    <Link to={propertyPath(property)} className="property-card block group">

      {/* Image */}
      <div className="card-img">
        <img
          src={mainImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"}
          alt={property.title}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,21,41,0.7) 0%, transparent 60%)" }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className="badge text-xs font-semibold px-2.5 py-1 rounded-sm"
            style={{
              background: property.transaction === "venda"
                ? "rgba(20,83,45,0.85)"
                : "rgba(29,78,216,0.85)",
              color: "#fff",
              border: "none",
            }}
          >
            {property.transaction === "venda" ? "Venda" : "Aluguel"}
          </span>
          {property.type && (
            <span
              className="badge rounded-sm"
              style={{ background: "rgba(0,0,0,0.55)", color: "#fff", border: "none" }}
            >
              {formatType(property.type)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card-body">
        <p className="text-xl font-bold text-foreground font-sans tracking-tight">
          {formatPrice(property.price)}
          {property.transaction === "aluguel" && (
            <span className="text-sm font-normal text-muted-foreground font-sans">/mês</span>
          )}
        </p>

        {property.title && (
          <p className="text-sm font-medium text-foreground/80 mt-1 truncate">{property.title}</p>
        )}

        {(property.neighborhood || property.city) && (
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#64748b" }} />
            <p className="text-sm truncate">
              {property.neighborhood && `${property.neighborhood}, `}{property.city}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          {(property.bedrooms ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bed className="w-4 h-4" />
              <span className="text-xs font-medium">{property.bedrooms} qts</span>
            </div>
          )}
          {(property.bathrooms ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bath className="w-4 h-4" />
              <span className="text-xs font-medium">{property.bathrooms}</span>
            </div>
          )}
          {(property.garages ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Car className="w-4 h-4" />
              <span className="text-xs font-medium">{property.garages}</span>
            </div>
          )}
          {(property.area ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Maximize2 className="w-4 h-4" />
              <span className="text-xs font-medium">{property.area} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
