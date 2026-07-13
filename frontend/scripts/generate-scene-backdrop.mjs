// Base del motor + banco de escena (entregable F3.2, doc 05) — el fondo de contexto
// del taller: un vano de motor estilizado que ancla las 12 piezas para que se lean
// "dentro del vehículo" en vez de flotando. Reglas doc 04 §3: isométrico 2:1, flat con
// 3 valores por cara, metales azul-grisáceos APAGADOS (las piezas son las protagonistas).
// Genera DOS variantes (dark y light, regla dura doc 04) a escala de la escena (1000x700).
// Se ubica detrás de cables y piezas; no es interactivo. Re-ejecutable.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/assets/scene');
mkdirSync(outDir, { recursive: true });

const W = 1000;
const H = 700;

// Paletas de escena (doc 04 §3): dark = azules grisáceos derivados de navy;
// light = gris-azul claros con sombras suaves. En ambos, más apagado que las piezas.
const PALETTES = {
  dark: {
    floor: '#171d38', floorLine: '#28315c',
    bayTop: '#414d78', bayLeft: '#2f3860', bayRight: '#232a49',
    engTop: '#4a5680', engLeft: '#343d64', engRight: '#272e4d',
    trayTop: '#3b447a', trayLeft: '#2c3460', trayRight: '#222a49',
    edge: '#57638c', frame: '#6590CB', frameOpacity: 0.28,
  },
  light: {
    floor: '#e9eef8', floorLine: '#c6d4ea',
    bayTop: '#cfdaef', bayLeft: '#b4c5e2', bayRight: '#a0b3d8',
    engTop: '#d4dff1', engLeft: '#bacae6', engRight: '#a6b8dc',
    trayTop: '#c9d6ed', trayLeft: '#afc1e2', trayRight: '#9bafd6',
    edge: '#8397bd', frame: '#3869B1', frameOpacity: 0.30,
  },
};

// Proyección isométrica 2:1 alrededor de un centro (cx,cy) con eje Z hacia arriba.
const iso = (cx, cy, x, y, z) => [
  (cx + (x - y) * 0.866).toFixed(2),
  (cy + (x + y) * 0.5 - z).toFixed(2),
];
const poly = (points, fill, extra = '') =>
  `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="${fill}" ${extra}/>`;

function prism(cx, cy, w, d, h, top, left, right) {
  const hw = w / 2;
  const hd = d / 2;
  const t = [iso(cx, cy, -hw, -hd, h), iso(cx, cy, hw, -hd, h), iso(cx, cy, hw, hd, h), iso(cx, cy, -hw, hd, h)];
  const l = [iso(cx, cy, -hw, hd, h), iso(cx, cy, hw, hd, h), iso(cx, cy, hw, hd, 0), iso(cx, cy, -hw, hd, 0)];
  const r = [iso(cx, cy, hw, hd, h), iso(cx, cy, hw, -hd, h), iso(cx, cy, hw, -hd, 0), iso(cx, cy, hw, hd, 0)];
  return poly(l, left) + poly(r, right) + poly(t, top);
}

function floor(col) {
  const cx = 500, cy = 420, R = 620, D = 300;
  const p = [[cx, cy - D], [cx + R, cy], [cx, cy + D], [cx - R, cy]];
  let grid = '';
  for (let i = -5; i <= 5; i++) {
    const f = i / 6;
    grid += `<line x1="${cx + R * f}" y1="${cy - D + D * Math.abs(f)}" x2="${cx + R * f}" y2="${cy + D - D * Math.abs(f)}" stroke="${col.floorLine}" stroke-width="1.5" opacity="0.5"/>`;
    grid += `<line x1="${cx - R + R * Math.abs(f)}" y1="${cy + D * f}" x2="${cx + R - R * Math.abs(f)}" y2="${cy + D * f}" stroke="${col.floorLine}" stroke-width="1.5" opacity="0.5"/>`;
  }
  return `<polygon points="${p.map((q) => q.join(',')).join(' ')}" fill="${col.floor}"/>${grid}`;
}

function engineBlock(col) {
  const cx = 710, cy = 400;
  const block = prism(cx, cy, 320, 210, 135, col.engTop, col.engLeft, col.engRight);
  const head = prism(cx - 25, cy - 35, 230, 145, 60, col.bayTop, col.bayLeft, col.bayRight);
  let ribs = '';
  for (let i = -2; i <= 2; i++) {
    const a = iso(cx - 25, cy - 35, i * 38, -55, 195);
    const b = iso(cx - 25, cy - 35, i * 38, 55, 195);
    ribs += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col.edge}" stroke-width="2.5" opacity="0.55"/>`;
  }
  // Campana de la transmisión al frente-abajo (donde monta el motor de arranque).
  const bell = prism(cx + 55, cy + 70, 130, 110, 70, col.engLeft, col.engRight, col.engRight);
  return block + bell + head + ribs;
}

function batteryTray(col) {
  return prism(175, 350, 175, 135, 26, col.trayTop, col.trayLeft, col.trayRight);
}

function fenderLedge(col) {
  return prism(305, 300, 130, 95, 34, col.trayTop, col.trayLeft, col.trayRight);
}

function firewall(col) {
  const wall = prism(455, 200, 260, 40, 150, col.bayTop, col.bayLeft, col.bayRight);
  const relayShelf = prism(408, 250, 110, 80, 44, col.trayTop, col.trayLeft, col.trayRight);
  return wall + relayShelf;
}

// Marco del capó: sugiere la abertura del vano del motor (esto es "dentro de un carro").
function hoodFrame(col) {
  const m = 26; // margen
  const s = col.frame, o = col.frameOpacity;
  const corner = (x, y, dx, dy) =>
    `<path d="M ${x + dx * 34} ${y} L ${x} ${y} L ${x} ${y + dy * 34}" fill="none" stroke="${s}" stroke-width="3" opacity="${o + 0.15}" stroke-linecap="round"/>`;
  return `
    <rect x="${m}" y="${m}" width="${W - m * 2}" height="${H - m * 2}" rx="26" fill="none" stroke="${s}" stroke-width="2" opacity="${o}" stroke-dasharray="2 10"/>
    ${corner(m, m, 1, 1)}${corner(W - m, m, -1, 1)}${corner(m, H - m, 1, -1)}${corner(W - m, H - m, -1, -1)}`;
}

function buildScene(col) {
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${hoodFrame(col)}
${floor(col)}
${firewall(col)}
${batteryTray(col)}
${fenderLedge(col)}
${engineBlock(col)}
</svg>
`;
}

for (const [theme, col] of Object.entries(PALETTES)) {
  const file = resolve(outDir, `engine-bay-${theme}.svg`);
  writeFileSync(file, buildScene(col), 'utf-8');
  console.log('Fondo de escena generado:', file);
}
