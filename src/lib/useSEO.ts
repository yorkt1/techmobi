import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = "Wagner Kaizer Consultoria Imobiliária";

function setMeta(selector: string, attr: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [attrName, attrValue] = selector.replace("meta[", "").replace("]", "").split('="');
    el.setAttribute(attrName, attrValue.replace('"', ""));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, content);
}

export function useSEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | Wagner Kaizer`;
    document.title = fullTitle;

    const desc = description ?? "Consultoria imobiliária especializada no Norte da Ilha de Florianópolis. Imóveis para compra e aluguel.";
    const href = url ?? window.location.href;

    setMeta(`meta[name="description"]`, "content", desc);
    setMeta(`meta[property="og:title"]`, "content", fullTitle);
    setMeta(`meta[property="og:description"]`, "content", desc);
    setMeta(`meta[property="og:url"]`, "content", href);
    setMeta(`meta[property="og:type"]`, "content", "website");
    setMeta(`meta[property="og:site_name"]`, "content", SITE_NAME);
    if (image) setMeta(`meta[property="og:image"]`, "content", image);

    setMeta(`meta[name="twitter:card"]`, "content", "summary_large_image");
    setMeta(`meta[name="twitter:title"]`, "content", fullTitle);
    setMeta(`meta[name="twitter:description"]`, "content", desc);
    if (image) setMeta(`meta[name="twitter:image"]`, "content", image);

    return () => { document.title = SITE_NAME; };
  }, [title, description, image, url]);
}
