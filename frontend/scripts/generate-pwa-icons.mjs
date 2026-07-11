// Genera los iconos PWA (192, 512, maskable) a partir del isotipo de marca.
// Fondo navy ZR con el logo centrado. Uso: node scripts/generate-pwa-icons.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = resolve(__dirname, '../public/assets/brand');
const outDir = resolve(__dirname, '../public');
mkdirSync(outDir, { recursive: true });

const NAVY = '#21284F';
const logoSvg = readFileSync(resolve(brandDir, 'bLANCO COMPLETO.svg'));

async function makeIcon(size, padding, filename) {
  const inner = Math.round(size * (1 - padding));
  const logo = await sharp(logoSvg, { density: 300 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const offset = Math.round((size - inner) / 2);
  await sharp({
    create: { width: size, height: size, channels: 4, background: NAVY },
  })
    .composite([{ input: logo, top: offset, left: offset }])
    .png()
    .toFile(resolve(outDir, filename));
  console.log(`Escrito public/${filename} (${size}x${size})`);
}

await makeIcon(192, 0.18, 'pwa-192x192.png');
await makeIcon(512, 0.18, 'pwa-512x512.png');
// Maskable: más padding para respetar la zona segura de los iconos adaptativos.
await makeIcon(512, 0.3, 'pwa-maskable-512x512.png');
await makeIcon(180, 0.18, 'apple-touch-icon.png');
