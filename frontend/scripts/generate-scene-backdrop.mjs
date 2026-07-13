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
    // Carrocería del vehículo (chapa pintada apagada) + cristal + faros.
    bodyTop: '#333b63', bodyLeft: '#252c4d', bodyRight: '#1c2340',
    glass: '#5b76a8', glassOpacity: 0.5, headlight: '#EBD79A', grille: '#20263f',
  },
  light: {
    floor: '#e9eef8', floorLine: '#c6d4ea',
    bayTop: '#cfdaef', bayLeft: '#b4c5e2', bayRight: '#a0b3d8',
    engTop: '#d4dff1', engLeft: '#bacae6', engRight: '#a6b8dc',
    trayTop: '#c9d6ed', trayLeft: '#afc1e2', trayRight: '#9bafd6',
    edge: '#8397bd', frame: '#3869B1', frameOpacity: 0.30,
    bodyTop: '#c4d3ec', bodyLeft: '#a9bce0', bodyRight: '#93a8d2',
    glass: '#bcd0ec', glassOpacity: 0.6, headlight: '#F0DFA6', grille: '#8ea1c6',
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

// --- Carrocería del vehículo: la chapa que rodea el vano del motor, para que ---
// --- se sienta que todos los sistemas están DENTRO de un carro (orientación) ---
function vehicleBody(col) {
  // Silueta vista desde el frente-arriba, capó abierto: cabina atrás (arriba),
  // frente con parrilla y faros abajo, guardabarros a los lados, ruedas en las esquinas.
  const bodyOutline =
    'M 150 250 ' +
    'C 150 120 250 60 400 55 L 600 55 C 750 60 850 120 850 250 ' +
    'L 850 560 C 850 630 780 665 700 665 L 300 665 C 220 665 150 630 150 560 Z';
  // Rueda (arco oscuro) en una esquina.
  const wheel = (x, y) =>
    `<ellipse cx="${x}" cy="${y}" rx="52" ry="30" fill="#12172c" opacity="0.55"/>` +
    `<ellipse cx="${x}" cy="${y}" rx="30" ry="17" fill="${col.bodyRight}"/>`;
  // Faro delantero.
  const headlight = (x) =>
    `<ellipse cx="${x}" cy="630" rx="34" ry="17" fill="${col.headlight}" opacity="0.85"/>` +
    `<ellipse cx="${x}" cy="628" rx="26" ry="12" fill="#FFFFFF" opacity="0.5"/>`;
  // Parrilla frontal (lamas).
  let grille = `<rect x="420" y="616" width="160" height="30" rx="6" fill="${col.grille}"/>`;
  for (let i = 1; i < 6; i++) grille += `<line x1="${420 + i * 26}" y1="618" x2="${420 + i * 26}" y2="644" stroke="${col.bodyLeft}" stroke-width="2"/>`;
  // Parabrisas / cabina al fondo (arriba).
  const windshield =
    `<path d="M 330 70 L 670 70 L 620 132 L 380 132 Z" fill="${col.glass}" opacity="${col.glassOpacity}"/>` +
    `<line x1="500" y1="72" x2="500" y2="130" stroke="${col.bodyTop}" stroke-width="2" opacity="0.5"/>`;

  return (
    // ruedas primero (detrás de la carrocería)
    wheel(175, 250) + wheel(825, 250) + wheel(205, 585) + wheel(795, 585) +
    // cuerpo pintado con borde
    `<path d="${bodyOutline}" fill="${col.bodyTop}" stroke="${col.bodyRight}" stroke-width="3"/>` +
    // sheen (brillo) en el borde superior
    `<path d="M 200 150 C 260 95 360 82 500 80 C 640 82 740 95 800 150" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.12"/>` +
    windshield + headlight(300) + headlight(700) + grille
  );
}

// --- Vano del motor: hueco recesado donde se montan las piezas ---
function bayOpening(col) {
  // Rectángulo redondeado oscuro = la abertura del capó (el interior del vano).
  const x = 195, y = 150, w = 610, h = 415, r = 34;
  const opening = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${col.floor}" stroke="${col.bodyRight}" stroke-width="4"/>`;
  // Rejilla sutil del piso del vano.
  let grid = '';
  for (let gx = x + 40; gx < x + w; gx += 60) grid += `<line x1="${gx}" y1="${y + 8}" x2="${gx}" y2="${y + h - 8}" stroke="${col.floorLine}" stroke-width="1" opacity="0.4"/>`;
  for (let gy = y + 40; gy < y + h; gy += 60) grid += `<line x1="${x + 8}" y1="${gy}" x2="${x + w - 8}" y2="${gy}" stroke="${col.floorLine}" stroke-width="1" opacity="0.4"/>`;
  return opening + grid;
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
${vehicleBody(col)}
${bayOpening(col)}
${firewall(col)}
${batteryTray(col)}
${fenderLedge(col)}
${engineBlock(col)}
${hoodFrame(col)}
</svg>
`;
}

for (const [theme, col] of Object.entries(PALETTES)) {
  const file = resolve(outDir, `engine-bay-${theme}.svg`);
  writeFileSync(file, buildScene(col), 'utf-8');
  console.log('Fondo de escena generado:', file);
}
