/**
 * Função serverless (Vercel) — injeta meta tags Open Graph por imóvel.
 *
 * Por quê: o site é uma SPA (Vite/React). Robôs de preview do WhatsApp,
 * Facebook, X, etc. NÃO executam JavaScript, então as tags geradas no
 * navegador nunca são vistas por eles. Esta função intercepta /imovel/* no
 * servidor, busca o imóvel no Supabase e injeta og:image / og:title /
 * og:description no HTML antes de entregar — assim o preview do link mostra a
 * foto principal e a descrição.
 *
 * Roteamento: ver vercel.json — /imovel/:id/:rest* → /api/imovel?id=:id
 */

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://mddajzzsaooodyqriodl.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZGFqenpzYW9vb2R5cXJpb2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MjQ3NzgsImV4cCI6MjA5NDIwMDc3OH0.Eta0i9ZvXZRo5fWY7gWW2ixA-YRRdFsl0KGOeZEfbss";

// Domínio de produção (canonical / imagem padrão). Configure VITE_SITE_URL na
// Vercel quando o domínio definitivo existir; sem ele usamos o host da request.
const SITE_URL = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const SITE_NAME = "Wagner Kaizer Negócios Imobiliários";
const DEFAULT_DESCRIPTION =
  "Negócios imobiliários no Norte da Ilha de Florianópolis. Imóveis para compra e aluguel com Wagner Kaizer, CRECI 71853F.";
// Imagem de fallback (sem foto do imóvel): hero já usado no site.
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dqewxdbfx/image/upload/v1779223985/WhatsApp_Image_2026-05-19_at_10.03.40_ziifbg.jpg";
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
// Só buscamos o shell index.html destes domínios — evita SSRF/cache via Host forjado.
const ALLOWED_HOST_RE = /\.vercel\.app$/i;

/** Retorna o host da requisição se for confiável; senão, o host do SITE_URL. */
function safeHost(req) {
  const host = String(req.headers?.host || "").split(":")[0];
  const siteHost = SITE_URL ? new URL(SITE_URL).host : "";
  if (ALLOWED_HOST_RE.test(host) || (siteHost && host === siteHost)) return host;
  return siteHost || host;
}

const supabaseHeaders = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };

/** Escapa texto para uso seguro dentro de atributos/HTML. */
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function capitalize(value) {
  const text = String(value ?? "").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** Colapsa quebras de linha e espaços repetidos numa única linha limpa. */
function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

/** Corta por caractere (não quebra emojis/acentos multibyte) e adiciona reticências. */
function truncate(value, max) {
  const chars = Array.from(value);
  if (chars.length <= max) return value;
  return chars.slice(0, max - 1).join("").trimEnd() + "…";
}

function formatPrice(price) {
  return price > 0
    ? price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
    : "Sob consulta";
}

const TYPE_LABELS = {
  apartamento: "Apartamento",
  casa: "Casa",
  terreno: "Terreno",
  comercial: "Comercial",
  cobertura: "Cobertura",
  kitnet: "Kitnet",
};

/**
 * Normaliza a URL da imagem para o preview.
 * Em imagens do Cloudinary, injeta uma transformação que entrega exatamente
 * 1200x630 (proporção ideal de card OG) — assim podemos declarar width/height
 * corretos e todo preview fica no mesmo formato. Outras URLs ficam como estão.
 */
function ogImageUrl(raw, origin) {
  if (!raw) return { url: DEFAULT_IMAGE, sized: false };
  const abs = /^https?:\/\//i.test(raw) ? raw : `${origin}/${raw.replace(/^\//, "")}`;
  const cloudinary = abs.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i);
  if (cloudinary) {
    return { url: `${cloudinary[1]}c_fill,w_1200,h_630,q_auto,f_jpg/${cloudinary[2]}`, sized: true };
  }
  return { url: abs, sized: false };
}

/**
 * Resolve o imóvel a partir do segmento da URL.
 * Aceita: UUID (direto), número (shortId = posição em created_at desc) ou
 * slug legado que contenha um UUID no final.
 */
async function fetchProperty(rawId) {
  const id = String(rawId ?? "").trim();
  if (!id) return null;

  const uuid = id.match(UUID_RE);
  if (uuid) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?id=eq.${uuid[0]}&select=*`,
      { headers: supabaseHeaders },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] ?? null;
  }

  if (/^\d+$/.test(id)) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=*&order=created_at.desc`,
      { headers: supabaseHeaders },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[Number(id) - 1] ?? null;
  }

  return null;
}

/** Monta título, descrição e imagem do preview a partir do imóvel. */
function buildMeta(property, origin) {
  if (!property) {
    return {
      title: `${SITE_NAME} — Imóveis no Norte da Ilha de Florianópolis`,
      description: DEFAULT_DESCRIPTION,
      image: DEFAULT_IMAGE,
      imageSized: false,
      url: origin,
    };
  }

  const transactionLabel = property.transaction === "aluguel" ? "Aluguel" : "Venda";
  const typeLabel = TYPE_LABELS[property.type] || capitalize(property.type);
  const specs = [
    property.bedrooms ? `${property.bedrooms} dorm.` : null,
    property.bathrooms ? `${property.bathrooms} banh.` : null,
    property.garages ? `${property.garages} vaga${property.garages > 1 ? "s" : ""}` : null,
    property.area ? `${property.area} m²` : null,
  ].filter(Boolean);

  const place = [clean(property.neighborhood), clean(property.city)].filter(Boolean).join(", ");
  const summary = [
    `${typeLabel} para ${transactionLabel}`,
    place,
    ...specs,
    formatPrice(Number(property.price)),
  ].filter(Boolean).join(" · ");

  const marketing = clean(property.description);
  const description = truncate(marketing ? `${marketing} — ${summary}` : summary, 180);

  const firstImage =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : property.image_url || null;
  const { url: image, sized: imageSized } = ogImageUrl(firstImage, origin);

  return {
    title: `${clean(property.title)} | ${SITE_NAME}`,
    description,
    image,
    imageSized,
    url: `${origin}/imovel/${property.id}`,
  };
}

/** Bloco de meta tags Open Graph / Twitter / JSON-LD. */
function metaTagsHtml(meta) {
  const t = esc(meta.title);
  const d = esc(meta.description);
  const img = esc(meta.image);
  const url = esc(meta.url);

  const jsonLd = esc(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: meta.title,
      description: meta.description,
      image: meta.image,
      url: meta.url,
    }),
  );

  return [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:secure_url" content="${img}" />`,
    // Só declaramos dimensões quando temos certeza (imagem 1200x630 do Cloudinary).
    meta.imageSized ? `<meta property="og:image:width" content="1200" />` : null,
    meta.imageSized ? `<meta property="og:image:height" content="630" />` : null,
    `<meta property="og:image:alt" content="${t}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].filter(Boolean).join("\n    ");
}

/** Aplica os meta tags ao shell index.html da SPA. */
function injectMeta(html, meta) {
  const tags = metaTagsHtml(meta);
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${esc(meta.description)}" />`,
    )
    // Remove as tags OG/Twitter/canonical/JSON-LD estáticas do index.html
    // para não duplicar — as do imóvel (abaixo) são a fonte da verdade.
    .replace(/\s*<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, "")
    .replace(/<\/head>/i, `    ${tags}\n  </head>`);
}

// Exportadas para reuso em testes / emulador local (scripts/dev-og.mjs).
export { fetchProperty, buildMeta, injectMeta, metaTagsHtml };

export default async function handler(req, res) {
  const id = req.query?.id ?? "";
  const host = safeHost(req);
  const origin = SITE_URL || `https://${host}`;

  let meta;
  try {
    const property = await fetchProperty(id);
    meta = buildMeta(property, origin);
  } catch {
    meta = buildMeta(null, origin);
  }

  // Busca o shell estático da SPA e injeta as meta tags.
  let html;
  try {
    const shell = await fetch(`https://${host}/index.html`);
    html = injectMeta(await shell.text(), meta);
  } catch {
    // Fallback: documento mínimo só com o preview (caso raro de falha no fetch).
    html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" />\n    ${metaTagsHtml(meta)}\n</head><body><a href="${esc(meta.url)}">${esc(meta.title)}</a></body></html>`;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Cache no CDN da Vercel: respostas rápidas pro robô, revalida a cada 10 min.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  res.status(200).send(html);
}
