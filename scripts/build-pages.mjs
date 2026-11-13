import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "../assets/js/csv.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "docs");
const basePath = normalizeBase(process.env.BASE_PATH || "/directorio-labs/");
const siteOrigin = (process.env.SITE_ORIGIN || "https://paginasperu.github.io").replace(/\/$/, "");

function normalizeBase(value) {
  const trimmed = `/${String(value).split("/").filter(Boolean).join("/")}`;
  return trimmed === "/" ? "/" : `${trimmed}/`;
}

function slugify(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-PE").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function copySiteFiles(source, destination) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if ([".git", "node_modules", "versions", "tools", "scripts", "docs"].includes(entry.name)) continue;
    if (["AGENTS.md", "CNAME", "package.json", ".gitignore"].includes(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await mkdir(to, { recursive: true });
      await copySiteFiles(from, to);
    } else {
      await cp(from, to);
    }
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copySiteFiles(root, output);

const csv = await readFile(path.join(root, "data/negocios.csv"), "utf8");
const businesses = parseCsv(csv);
const rootHtmlPath = path.join(output, "index.html");
const rootHtml = (await readFile(rootHtmlPath, "utf8")).replace("<head>", `<head>\n    <base href="${basePath}">`);
await writeFile(rootHtmlPath, rootHtml);

for (const business of businesses) {
  const id = business.id;
  const name = business.nombre || `Negocio ${id}`;
  const slug = `${slugify(name)}-${id}`;
  const route = path.join(output, "negocios", slug);
  const canonical = `${siteOrigin}${basePath}negocios/${slug}/`;
  const description = `Consulta la ficha de ${name} en Directorio: ubicación, contacto y promociones.`;
  const html = rootHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(name)} · Directorio</title>`)
    .replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escapeHtml(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escapeHtml(name)} · Directorio$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escapeHtml(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${canonical}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(">)/, `$1${escapeHtml(name)} · Directorio$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${escapeHtml(description)}$2`)
    .replace("</head>", `    <link rel="canonical" href="${canonical}">\n    <meta name="directory-business-id" content="${escapeHtml(id)}">\n</head>`);
  await mkdir(route, { recursive: true });
  await writeFile(path.join(route, "index.html"), html);
}

await writeFile(path.join(output, ".nojekyll"), "");
console.log(`Generado: ${businesses.length} fichas en docs/negocios/`);
console.log(`Base URL para GitHub Pages: ${basePath}`);
