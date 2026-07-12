// Base del motor + banco de escena (entregable F3.2, doc 05) — el fondo de contexto
// del taller: un vano de motor estilizado que ancla las 12 piezas para que se lean
// "dentro del vehículo" en vez de flotando. Reglas doc 04 §3: isométrico 2:1, flat con
// 3 valores por cara, paleta ZR, metales azul-grisáceos APAGADOS (las piezas son las
// protagonistas y deben resaltar encima). Un solo SVG a escala de la escena (1000x700).
// Se ubica detrás de cables y piezas; no es interactivo. Re-ejecutable.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/assets/scene');
mkdirSync(outDir, { recursive: true });

const W = 1000;
const H = 700;

// Tonos apagados derivados de navy (metales de escena, doc 04 §3 dark).
// Las piezas son las protagonistas: el fondo va oscuro y de bajo contraste.
const col = {
  floor: '#171d38',
  floorLine: '#28315c',
  bayTop: '#414d78',
  bayLeft: '#2f3860',
  bayRight: '#232a49',
  engTop: '#4a5680',
  engLeft: '#343d64',
  engRight: '#272e4d',
  trayTop: '#3b447a',
  trayLeft: '#2c3460',
  trayRight: '#222a49',
  edge: '#57638c',
  pulley: '#5b6a92',
  pulleyDark: '#3a4468',
};

// Proyección isométrica 2:1 alrededor de un centro (cx,cy) con eje Z hacia arriba.
const iso = (cx, cy, x, y, z) => [
  (cx + (x - y) * 0.866).toFixed(2),
  (cy + (x + y) * 0.5 - z).toFixed(2),
];
const poly = (points, fill, extra = '') =>
  `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="${fill}" ${extra}/>`;

// Prisma isométrico (caja) — devuelve las 3 caras.
function prism(cx, cy, w, d, h, top, left, right) {
  const hw = w / 2;
  const hd = d / 2;
  const t = [iso(cx, cy, -hw, -hd, h), iso(cx, cy, hw, -hd, h), iso(cx, cy, hw, hd, h), iso(cx, cy, -hw, hd, h)];
  const l = [iso(cx, cy, -hw, hd, h), iso(cx, cy, hw, hd, h), iso(cx, cy, hw, hd, 0), iso(cx, cy, -hw, hd, 0)];
  const r = [iso(cx, cy, hw, hd, h), iso(cx, cy, hw, -hd, h), iso(cx, cy, hw, -hd, 0), iso(cx, cy, hw, hd, 0)];
  return poly(l, left) + poly(r, right) + poly(t, top);
}

// --- Piso del taller (banco de escena): losa isométrica con rejilla sutil ---
function floor() {
  const cx = 500;
  const cy = 420;
  const R = 620; // radio en X del rombo
  const D = 300; // radio en Y
  const p = [
    [cx, cy - D],
    [cx + R, cy],
    [cx, cy + D],
    [cx - R, cy],
  ];
  let grid = '';
  for (let i = -5; i <= 5; i++) {
    const f = i / 6;
    grid += `<line x1="${cx + R * f}" y1="${cy - D + D * Math.abs(f)}" x2="${cx + R * f}" y2="${cy + D - D * Math.abs(f)}" stroke="${col.floorLine}" stroke-width="1.5" opacity="0.5"/>`;
    grid += `<line x1="${cx - R + R * Math.abs(f)}" y1="${cy + D * f}" x2="${cx + R - R * Math.abs(f)}" y2="${cy + D * f}" stroke="${col.floorLine}" stroke-width="1.5" opacity="0.5"/>`;
  }
  return `<polygon points="${p.map((q) => q.join(',')).join(' ')}" fill="${col.floor}"/>${grid}`;
}

// --- Bloque del motor: cluster central-derecha bajo alternador/correa/solenoide/arranque ---
function engineBlock() {
  // El "motor" ocupa la zona x 560-860, y 250-500 (alternador arriba, arranque abajo en la campana).
  const cx = 710;
  const cy = 400;
  // Bloque principal.
  const block = prism(cx, cy, 320, 210, 135, col.engTop, col.engLeft, col.engRight);
  // Culata encima (más chica, hacia el frente).
  const head = prism(cx - 25, cy - 35, 230, 145, 60, col.bayTop, col.bayLeft, col.bayRight);
  // Tapa de válvulas (nervaduras sobre la culata).
  let ribs = '';
  for (let i = -2; i <= 2; i++) {
    const a = iso(cx - 25, cy - 35, i * 38, -55, 195);
    const b = iso(cx - 25, cy - 35, i * 38, 55, 195);
    ribs += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col.edge}" stroke-width="2.5" opacity="0.55"/>`;
  }
  // Campana de la transmisión al frente-abajo (donde monta el motor de arranque, x~782 y~456).
  const bell = prism(cx + 55, cy + 70, 130, 110, 70, col.engLeft, col.engRight, col.engRight);
  return block + bell + head + ribs;
}

// --- Bandeja de la batería (plataforma bajo la batería, x~175 y~320) ---
function batteryTray() {
  return prism(175, 350, 175, 135, 26, col.trayTop, col.trayLeft, col.trayRight);
}

// --- Repisa de fusiblera (inner fender, junto a la batería, x~302 y~278) ---
function fenderLedge() {
  return prism(305, 300, 130, 95, 34, col.trayTop, col.trayLeft, col.trayRight);
}

// --- Firewall/mampara: pared del fondo donde montan llave, testigo y relé (x 380-560, arriba) ---
function firewall() {
  // Pared alta al fondo del vano.
  const wall = prism(455, 200, 260, 40, 150, col.bayTop, col.bayLeft, col.bayRight);
  // Repisa del relé sobre el firewall (x~405 y~236).
  const relayShelf = prism(408, 250, 110, 80, 44, col.trayTop, col.trayLeft, col.trayRight);
  return wall + relayShelf;
}

const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${floor()}
${firewall()}
${batteryTray()}
${fenderLedge()}
${engineBlock()}
</svg>
`;

writeFileSync(resolve(outDir, 'engine-bay.svg'), svg, 'utf-8');
console.log('Fondo de escena generado en', resolve(outDir, 'engine-bay.svg'));
