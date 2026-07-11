/**
 * Helpers de link curto / descritivo para imóveis.
 *
 * O link compartilhado fica `/imovel/{shortId}/{slug}` — curto e legível
 * (ex.: /imovel/3/casa-jurere-internacional) em vez do UUID longo. O shortId é
 * a posição do imóvel na lista ordenada por created_at desc (mais recente = 1),
 * o MESMO critério usado pela função serverless api/imovel.js que injeta o
 * preview (foto + descrição). Os dois precisam ordenar igual para resolver o
 * mesmo imóvel.
 */

export interface PropertyLike {
  id: string;
  title?: string;
  neighborhood?: string;
  city?: string;
  shortId?: number;
  image_url?: string;
  images?: string[];
  updated_at?: string;
}

const ACCENT_MAP: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", ä: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c", ñ: "n",
};

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[/]+/g, "-")
    .replace(/[^\w\s-]/g, (char) => ACCENT_MAP[char] ?? "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** Slug descritivo: até 4 palavras do título + bairro/cidade. */
export function propertySlug(property: PropertyLike) {
  const titleWords = normalizeText(property.title ?? "").split("-").filter(Boolean);
  const compactTitle = titleWords.slice(0, 4).join("-");
  const place = normalizeText(property.neighborhood || property.city || "");
  return [compactTitle, place].filter(Boolean).join("-");
}

/** Caminho curto/descritivo do imóvel; usa shortId quando disponível, senão o id. */
export function propertyPath(property: PropertyLike) {
  const routeId = property.shortId ?? property.id;
  const slug = propertySlug(property);
  return slug ? `/imovel/${routeId}/${slug}` : `/imovel/${routeId}`;
}

function hashText(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * "Carimbo" global de cache do preview. O WhatsApp/Facebook guardam o preview
 * por URL; aumente este número para gerar um `?v=` novo em TODOS os imóveis de
 * uma vez e forçar os apps a buscarem o preview atualizado (ignora o cache antigo
 * que ficou sem foto). Ex.: 1 → 2 quando quiser "resetar" os previews.
 */
const PREVIEW_CACHE_VERSION = "2";

function previewVersion(property: PropertyLike) {
  const mainImage = Array.isArray(property.images) && property.images.length > 0
    ? property.images[0]
    : property.image_url;
  return hashText(
    [PREVIEW_CACHE_VERSION, property.updated_at, mainImage, property.title]
      .filter(Boolean)
      .join("|"),
  );
}

/** Caminho para compartilhar; o v= força apps de preview a buscarem a versão atual. */
export function propertySharePath(property: PropertyLike) {
  return `${propertyPath(property)}?v=${previewVersion(property)}`;
}

/** Anexa shortId (posição em created_at desc) a cada item da lista já ordenada. */
export function withShortIds<T extends { id: string }>(list: T[]): (T & { shortId: number })[] {
  return list.map((item, index) => ({ ...item, shortId: index + 1 }));
}

/**
 * A partir do segmento da URL, devolve o id real (UUID) do imóvel.
 * Aceita: número (shortId), UUID direto, ou slug que contenha um UUID.
 */
export function resolvePropertyId(
  rawId: string | undefined,
  list: { id: string; shortId?: number }[],
): string | undefined {
  const id = (rawId ?? "").trim();
  if (!id) return undefined;

  if (/^\d+$/.test(id)) {
    return list.find((item) => String(item.shortId) === id)?.id ?? id;
  }

  const uuid = id.match(UUID_RE);
  return uuid ? uuid[0] : undefined;
}
