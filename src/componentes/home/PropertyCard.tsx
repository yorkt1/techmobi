import React from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";

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
  title: string;
  price?: number;
  transaction?: string;
  type?: string;
  image_url?: string;
  neighborhood?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link to={`/imovel/${property.id}`} className="property-card block group">

      {/* Image */}
      <div className="card-img">
        <img
          src={property.image_url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"}
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
                ? "rgba(197,160,89,0.15)"
                : "rgba(100,155,255,0.15)",
              color: property.transaction === "venda" ? "#94a3b8" : "#82b4ff",
              border: `1px solid ${property.transaction === "venda" ? "rgba(197,160,89,0.3)" : "rgba(100,155,255,0.3)"}`,
            }}
          >
            {property.transaction === "venda" ? "Venda" : "Aluguel"}
          </span>
          {property.type && (
            <span className="badge badge-navy rounded-sm">
              {formatType(property.type)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card-body">
        <p className="text-xl font-bold text-foreground font-serif tracking-tight">
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
        <div
          className="flex items-center gap-4 mt-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
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
