/**
 * Actualiza lastmod en public/sitemap.xml con la fecha actual (YYYY-MM-DD).
 * Se ejecuta antes del build para que el sitemap refleje la última publicación.
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP = path.join(__dirname, "..", "public", "sitemap.xml");

const today = new Date().toISOString().slice(0, 10);

async function main() {
  const xml = await readFile(SITEMAP, "utf-8");
  const updated = xml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/, `<lastmod>${today}</lastmod>`);
  await writeFile(SITEMAP, updated);
  console.log(`Sitemap lastmod → ${today}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
