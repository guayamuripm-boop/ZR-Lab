// Kit isométrico PLACEHOLDER — sustituir por el arte final de Figma (doc 06 Paso 3.1).
// Genera cajas isométricas simples (2:1, 3 valores por cara) en la paleta ZR extendida,
// suficientes para integrar y probar la escena (Fase 4) sin bloquear en el arte definitivo.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/assets/iso');
mkdirSync(outDir, { recursive: true });

// id, iniciales para la cara superior, familia de forma
const PIECES = [
  { id: 'battery', label: 'BAT', shape: 'box', w: 120, h: 90 },
  { id: 'terminal-pos', label: '+', shape: 'stud', w: 50, h: 50 },
  { id: 'terminal-neg', label: '−', shape: 'stud', w: 50, h: 50 },
  { id: 'ground-strap', label: 'GND', shape: 'strap', w: 130, h: 40 },
  { id: 'main-fuse', label: 'FUS', shape: 'box', w: 60, h: 40 },
  { id: 'ignition-switch', label: 'KEY', shape: 'cylinder', w: 60, h: 70 },
  { id: 'starter-relay', label: 'RLY', shape: 'box', w: 70, h: 60 },
  { id: 'solenoid', label: 'SOL', shape: 'cylinder', w: 70, h: 60 },
  { id: 'starter-motor', label: 'STR', shape: 'cylinder', w: 100, h: 100 },
  { id: 'belt', label: 'BELT', shape: 'strap', w: 140, h: 40 },
  { id: 'alternator', label: 'ALT', shape: 'cylinder', w: 90, h: 90 },
  { id: 'charge-lamp', label: 'LAMP', shape: 'disc', w: 50, h: 50 },
];

// Paleta ZR extendida — 3 valores por cara (luz / medio / sombra).
const LIGHT = '#98BAE3';
const MID = '#3869B1';
const DARK = '#21284F';

function isoBox(w, h, label) {
  const cx = 100;
  const cy = 100;
  const hw = w / 2;
  const hh = h / 2;
  const depth = h * 0.55;
  // Vértices de un prisma isométrico simple (2:1) centrado.
  const top = `${cx},${cy - hh - depth / 2} ${cx + hw},${cy - depth / 2} ${cx},${cy + hh - depth / 2} ${cx - hw},${cy - depth / 2}`;
  const left = `${cx - hw},${cy - depth / 2} ${cx},${cy + hh - depth / 2} ${cx},${cy + hh + depth / 2} ${cx - hw},${cy + depth / 2}`;
  const right = `${cx},${cy + hh - depth / 2} ${cx + hw},${cy - depth / 2} ${cx + hw},${cy + depth / 2} ${cx},${cy + hh + depth / 2}`;
  return `
  <polygon points="${left}" fill="${MID}" />
  <polygon points="${right}" fill="${DARK}" />
  <polygon points="${top}" fill="${LIGHT}" />
  <text x="${cx}" y="${cy - depth / 2 + 4}" font-family="Roboto Mono, monospace" font-size="12" font-weight="700" fill="${DARK}" text-anchor="middle">${label}</text>`;
}

function isoCylinder(w, h, label) {
  const cx = 100;
  const cy = 100;
  const r = w / 2;
  const depth = h;
  return `
  <rect x="${cx - r}" y="${cy - depth / 2}" width="${w}" height="${depth}" fill="${MID}" />
  <ellipse cx="${cx}" cy="${cy + depth / 2}" rx="${r}" ry="${r * 0.4}" fill="${DARK}" />
  <ellipse cx="${cx}" cy="${cy - depth / 2}" rx="${r}" ry="${r * 0.4}" fill="${LIGHT}" />
  <text x="${cx}" y="${cy - depth / 2 + 4}" font-family="Roboto Mono, monospace" font-size="11" font-weight="700" fill="${DARK}" text-anchor="middle">${label}</text>`;
}

function isoStrap(w, h, label) {
  const cx = 100;
  const cy = 100;
  return `
  <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${MID}" />
  <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h * 0.4}" rx="${h * 0.2}" fill="${LIGHT}" />
  <text x="${cx}" y="${cy + 4}" font-family="Roboto Mono, monospace" font-size="11" font-weight="700" fill="${DARK}" text-anchor="middle">${label}</text>`;
}

function isoDisc(w, label) {
  const cx = 100;
  const cy = 100;
  const r = w / 2;
  return `
  <ellipse cx="${cx}" cy="${cy + 6}" rx="${r}" ry="${r * 0.6}" fill="${DARK}" />
  <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.6}" fill="${LIGHT}" stroke="${MID}" stroke-width="2" />
  <text x="${cx}" y="${cy + 4}" font-family="Roboto Mono, monospace" font-size="10" font-weight="700" fill="${DARK}" text-anchor="middle">${label}</text>`;
}

function isoStud(w, label) {
  const cx = 100;
  const cy = 100;
  const r = w / 2;
  return `
  <ellipse cx="${cx}" cy="${cy + 4}" rx="${r}" ry="${r * 0.7}" fill="${DARK}" />
  <ellipse cx="${cx}" cy="${cy - 4}" rx="${r}" ry="${r * 0.7}" fill="${LIGHT}" stroke="${MID}" stroke-width="2" />
  <text x="${cx}" y="${cy}" font-family="Roboto Mono, monospace" font-size="16" font-weight="700" fill="${DARK}" text-anchor="middle">${label}</text>`;
}

for (const piece of PIECES) {
  let body;
  if (piece.shape === 'box') body = isoBox(piece.w, piece.h, piece.label);
  else if (piece.shape === 'cylinder') body = isoCylinder(piece.w, piece.h, piece.label);
  else if (piece.shape === 'strap') body = isoStrap(piece.w, piece.h, piece.label);
  else if (piece.shape === 'disc') body = isoDisc(piece.w, piece.label);
  else body = isoStud(piece.w, piece.label);

  const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${body}\n</svg>\n`;
  writeFileSync(resolve(outDir, `iso-${piece.id}.svg`), svg, 'utf-8');
}

console.log(`Generados ${PIECES.length} SVG placeholder en ${outDir}`);
