import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs");
const port = Number(process.env.PORT || 4173);
const basePath = `/${String(process.env.BASE_PATH || "/directorio-labs/").split("/").filter(Boolean).join("/")}/`;
const contentTypes = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".csv": "text/csv; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webmanifest": "application/manifest+json" };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (basePath !== "/" && pathname.startsWith(basePath)) pathname = pathname.slice(basePath.length);
    else if (basePath !== "/" && pathname === "/") {
      response.writeHead(302, { Location: basePath });
      response.end();
      return;
    }
    const relative = pathname.replace(/^\/+/, "");
    let file = path.resolve(root, relative || "index.html");
    if (!file.startsWith(root)) throw new Error("Ruta inválida");
    if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, "index.html");
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(file)] || "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("No encontrado");
  }
}).listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}${basePath}`));
