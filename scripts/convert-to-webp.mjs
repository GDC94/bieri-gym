/**
 * Convierte imágenes PNG/JPG de src/assets a WebP.
 * Uso: node scripts/convert-to-webp.mjs
 */
import sharp from "sharp";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "..", "src", "assets");

const QUALITY = 85;

async function convertToWebp(inputPath, outputPath) {
  await sharp(inputPath)
    .webp({ quality: QUALITY })
    .toFile(outputPath);
  console.log(`  ✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
}

async function main() {
  const files = await readdir(ASSETS);
  const toConvert = files.filter(
    (f) =>
      (f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg")) &&
      (f.startsWith("GYM") || f.startsWith("gym"))
  );

  if (toConvert.length === 0) {
    console.log("No se encontraron imágenes GYM para convertir.");
    return;
  }

  console.log(`Convirtiendo ${toConvert.length} imagen(es) a WebP (calidad ${QUALITY})...\n`);

  for (const file of toConvert) {
    const inputPath = path.join(ASSETS, file);
    const base = file.replace(path.extname(file), "");
    const outputPath = path.join(ASSETS, `${base}.webp`);
    await convertToWebp(inputPath, outputPath);
  }

  console.log("\nListo. Actualiza los imports en BieriLanding.jsx para usar los .webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
