/**
 * Genera public/og-image.jpg 1200x630 para Open Graph desde una imagen del gym.
 * Uso: node scripts/generate-og-image.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "src", "assets", "GYM 1.webp");
const OUTPUT = path.join(ROOT, "public", "og-image.jpg");

async function main() {
  await sharp(INPUT)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .jpeg({ quality: 88 })
    .toFile(OUTPUT);
  console.log("✓ public/og-image.jpg generado (1200×630)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
