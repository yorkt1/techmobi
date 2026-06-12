/**
 * Emulador local do preview de link (não precisa de Vercel).
 *
 * Replica os rewrites do vercel.json usando as MESMAS funções de produção
 * (api/imovel.js): /imovel/:id → busca real no Supabase + injeta og:image /
 * og:title / og:description no dist/index.html. Demais rotas servem o build
 * estático (dist/), com fallback SPA.
 *
 *   npm run build   (gera dist/)
 *   node scripts/dev-og.mjs
 *   abrir http://localhost:4000/imovel/1
 */
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchProperty, buildMeta, injectMeta } from "../api/imovel.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const PORT = 4000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function serveStatic(res, urlPath) {
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const file = join(DIST, safe);
  try {
    const buf = await readFile(file);
    res.setHeader("Content-Type", MIME[extname(file)] || "application/octet-stream");
    res.end(buf);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = decodeURIComponent(url.pathname);

  // /imovel/:id[/...]  → injeta meta tags do imóvel
  const match = path.match(/^\/imovel\/([^/]+)/);
  if (match) {
    const origin = `http://localhost:${PORT}`;
    const shell = await readFile(join(DIST, "index.html"), "utf8");
    let html;
    try {
      const property = await fetchProperty(match[1]);
      html = injectMeta(shell, buildMeta(property, origin));
      console.log(`[imovel] id=${match[1]} → ${property ? property.title : "NÃO ENCONTRADO (usa fallback)"}`);
    } catch (err) {
      html = shell;
      console.error(`[imovel] erro:`, err.message);
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
    return;
  }

  // estático → fallback SPA (index.html)
  if (path !== "/" && (await serveStatic(res, path))) return;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(await readFile(join(DIST, "index.html"), "utf8"));
});

server.listen(PORT, () => {
  console.log(`\n  Preview local em http://localhost:${PORT}`);
  console.log(`  Teste um imóvel:  http://localhost:${PORT}/imovel/1\n`);
});
