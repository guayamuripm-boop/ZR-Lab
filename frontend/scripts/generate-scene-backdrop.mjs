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

// --- Bloque del motor: cluster central-derecha bajo correa/alternador/arranque ---
function engineBlock() {
  // El "motor" ocupa la zona x 470-830, y 240-460 donde viven arranque/solenoide/correa/alternador.
  const cx = 660;
  const cy = 360;
  // Bloque principal.
  const block = prism(cx, cy, 300, 190, 120, col.engTop, col.engLeft, col.engRight);
  // Culata encima (más chica).
  const head = prism(cx - 20, cy - 30, 210, 130, 55, col.bayTop, col.bayLeft, col.bayRight);
  // Tapa de válvulas (nervaduras sobre la culata).
  let ribs = '';
  for (let i = -2; i <= 2; i++) {
    const a = iso(cx - 20, cy - 30, i * 34, -50, 175);
    const b = iso(cx - 20, cy - 30, i * 34, 50, 175);
    ribs += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col.edge}" stroke-width="2.5" opacity="0.55"/>`;
  }
  // Poleas al frente (cara izquierda-frontal) — donde pasa la correa (x~700 y~240).
  const pl = (px, py, r) =>
    `<ellipse cx="${px}" cy="${py}" rx="${r * 0.55}" ry="${r}" fill="${col.pulley}"/><ellipse cx="${px}" cy="${py}" rx="${r * 0.28}" ry="${r * 0.5}" fill="${col.pulleyDark}"/>`;
  const frontFace = ''; // las poleas reales las dibuja el alternador/cigüeñal; aquí solo insinuamos el buje
  return block + head + ribs + frontFace;
}

// --- Bandeja de la batería (plataforma bajo la batería, x~180 y~300) ---
function batteryTray() {
  return prism(180, 330, 170, 130, 26, col.trayTop, col.trayLeft, col.trayRight);
}

// --- Repisa/soporte del relé y fusiblera (mampara superior izquierda) ---
function fenderLedge() {
  const a = prism(360, 300, 150, 90, 34, col.trayTop, col.trayLeft, col.trayRight);
  const b = prism(485, 235, 120, 80, 46, col.bayTop, col.bayLeft, col.bayRight);
  return a + b;
}

// --- Columna de la dirección / soporte de la llave (arriba centro, x~480 y~160) ---
function steeringMount() {
  return prism(480, 210, 80, 70, 70, col.bayTop, col.bayLeft, col.bayRight);
}

const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${floor()}
${batteryTray()}
${fenderLedge()}
${steeringMount()}
${engineBlock()}
</svg>
`;

writeFileSync(resolve(outDir, 'engine-bay.svg'), svg, 'utf-8');
console.log('Fondo de escena generado en', resolve(outDir, 'engine-bay.svg'));
