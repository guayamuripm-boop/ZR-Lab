// Kit isométrico de ARTE (F3.2, doc 06 Paso 3.1) — reemplaza al placeholder de cajas.
// 12 piezas del sistema de arranque y carga dibujadas de forma reconocible, en proyección
// 2.5D isométrica, sobre la paleta ZR extendida + acentos funcionales (bornes rojo/negro,
// cobre del bobinado, testigo del tablero). Cada SVG es un lienzo cuadrado 200x200 que la
// escena (ComponentSprite) pinta escalado por `displaySize`. Re-ejecutable: `node scripts/generate-iso-art.mjs`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/assets/iso');
mkdirSync(outDir, { recursive: true });

// --- Paleta ZR (fuente de verdad: doc 00 / tokens.css) ---
const NAVY = '#21284F'; // sombra profunda
const BLUE = '#1E4D96'; // azul de marca
const MID = '#3869B1'; // medio
const SOFT = '#6590CB'; // secundario
const SKY = '#98BAE3'; // luz
const PALE = '#CFE0F4'; // brillo (derivado, más claro que sky)
const WHITE = '#FFFFFF';
// --- Acentos funcionales (para legibilidad de pieza real, uso mínimo) ---
const RED = '#C0392B';
const RED_D = '#8E2A20';
const BLACK = '#2B2F3A';
const BLACK_L = '#454B5C';
const COPPER = '#C9814B';
const COPPER_D = '#9A5E32';
const STEEL = '#8A98B4';
const STEEL_D = '#5E6C88';
const GOLD = '#E8C468';

// Proyección isométrica 2:1 alrededor de un centro (cx,cy).
const iso = (cx, cy, x, y, z) => [cx + (x - y) * 0.866, cy + (x + y) * 0.5 - z];
const pts = (arr) => arr.map((p) => p.join(',')).join(' ');

// Prisma isométrico (caja) con 3 caras: top / left / right.
function isoPrism(cx, cy, w, d, h, cTop, cLeft, cRight, extra = '') {
  const hw = w / 2;
  const hd = d / 2;
  const top = [
    iso(cx, cy, -hw, -hd, h),
    iso(cx, cy, hw, -hd, h),
    iso(cx, cy, hw, hd, h),
    iso(cx, cy, -hw, hd, h),
  ];
  const left = [iso(cx, cy, -hw, hd, h), iso(cx, cy, hw, hd, h), iso(cx, cy, hw, hd, 0), iso(cx, cy, -hw, hd, 0)];
  const right = [iso(cx, cy, hw, hd, h), iso(cx, cy, hw, -hd, h), iso(cx, cy, hw, -hd, 0), iso(cx, cy, hw, hd, 0)];
  return `
    <polygon points="${pts(left)}" fill="${cLeft}" />
    <polygon points="${pts(right)}" fill="${cRight}" />
    <polygon points="${pts(top)}" fill="${cTop}" />
    ${extra}`;
}

// Cilindro isométrico vertical (eje Z).
function isoCylinderV(cx, cy, r, h, cBody, cTop, cBot, ryFactor = 0.5) {
  const ry = r * ryFactor;
  const [txc, tyc] = iso(cx, cy, 0, 0, h);
  const [bxc, byc] = iso(cx, cy, 0, 0, 0);
  return `
    <path d="M ${txc - r} ${tyc} L ${bxc - r} ${byc} A ${r} ${ry} 0 0 0 ${bxc + r} ${byc} L ${txc + r} ${tyc} A ${r} ${ry} 0 0 1 ${txc - r} ${tyc} Z" fill="${cBody}" />
    <ellipse cx="${bxc}" cy="${byc}" rx="${r}" ry="${ry}" fill="${cBot}" />
    <ellipse cx="${txc}" cy="${tyc}" rx="${r}" ry="${ry}" fill="${cTop}" />`;
}

// Cilindro isométrico acostado sobre el eje X (para motor de arranque / alternador).
function isoCylinderH(cx, cy, r, len, cBody, cCap, cCapDark) {
  // eje a lo largo de X (de -len/2 a +len/2), sección circular en plano Y-Z.
  const a = iso(cx, cy, -len / 2, 0, 0);
  const b = iso(cx, cy, len / 2, 0, 0);
  const rx = r * 0.5;
  const ry = r;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const nx = Math.cos(ang + Math.PI / 2);
  const ny = Math.sin(ang + Math.PI / 2);
  // cuerpo como polígono entre las dos elipses (aprox), + tapas.
  const top1 = [a[0] + nx * ry, a[1] + ny * ry];
  const top2 = [b[0] + nx * ry, b[1] + ny * ry];
  const bot1 = [a[0] - nx * ry, a[1] - ny * ry];
  const bot2 = [b[0] - nx * ry, b[1] - ny * ry];
  return `
    <polygon points="${top1.join(',')} ${top2.join(',')} ${bot2.join(',')} ${bot1.join(',')}" fill="${cBody}" />
    <g transform="translate(${b[0]} ${b[1]}) rotate(${(ang * 180) / Math.PI})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${cCap}" /></g>
    <g transform="translate(${a[0]} ${a[1]}) rotate(${(ang * 180) / Math.PI})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${cCapDark}" /></g>`;
}

// ---------------------------------------------------------------------------
// DIBUJOS POR PIEZA
// ---------------------------------------------------------------------------

// 1. Batería — caja con dos bornes (rojo +, negro −), tapones y etiqueta 12V.
function battery() {
  const cx = 100;
  const cy = 118;
  const body = isoPrism(cx, cy, 96, 62, 46, MID, BLUE, NAVY);
  // Bornes sobre la cara superior.
  const [pxc, pyc] = iso(cx, cy, -26, -14, 46);
  const [nxc, nyc] = iso(cx, cy, 26, 14, 46);
  const post = (x, y, c, cd) => `
    <ellipse cx="${x}" cy="${y + 10}" rx="11" ry="5" fill="${cd}" />
    <rect x="${x - 9}" y="${y - 6}" width="18" height="16" rx="3" fill="${c}" />
    <ellipse cx="${x}" cy="${y - 6}" rx="9" ry="4.5" fill="${WHITE}" opacity="0.35" />`;
  // Tapones de celda (fila sobre la tapa).
  let caps = '';
  for (let i = -1; i <= 1; i++) {
    const [ux, uy] = iso(cx, cy, i * 20, 8, 46);
    caps += `<ellipse cx="${ux}" cy="${uy}" rx="8" ry="4" fill="${SKY}" stroke="${SOFT}" stroke-width="1.5" />`;
  }
  return `${body}
    ${caps}
    <g transform="translate(${iso(cx, cy, -6, 22, 22)[0]} ${iso(cx, cy, -6, 22, 22)[1]}) skewY(26)">
      <rect x="-26" y="-9" width="52" height="18" rx="3" fill="${PALE}" />
      <text x="0" y="5" font-family="Roboto Mono, monospace" font-size="13" font-weight="700" fill="${BLUE}" text-anchor="middle">12V</text>
    </g>
    ${post(nxc, nyc, BLACK, BLACK_L)}
    ${post(pxc, pyc, RED, RED_D)}
    <text x="${pxc}" y="${pyc - 12}" font-family="Roboto, sans-serif" font-size="15" font-weight="800" fill="${RED}" text-anchor="middle">+</text>
    <text x="${nxc}" y="${nyc - 12}" font-family="Roboto, sans-serif" font-size="17" font-weight="800" fill="${BLACK}" text-anchor="middle">−</text>`;
}

// 2/3. Bornes positivo y negativo — poste de batería con abrazadera anular y cable.
function terminal(color, colorD, sign, signColor) {
  const cx = 100;
  const cy = 116;
  return `
    <ellipse cx="${cx}" cy="${cy + 30}" rx="30" ry="15" fill="${NAVY}" opacity="0.5" />
    <!-- base sobre la batería -->
    ${isoCylinderV(cx, cy + 16, 24, 12, MID, SKY, BLUE, 0.5)}
    <!-- abrazadera anular de color -->
    <ellipse cx="${cx}" cy="${cy}" rx="22" ry="12" fill="${colorD}" />
    <ellipse cx="${cx}" cy="${cy - 3}" rx="22" ry="12" fill="${color}" />
    <ellipse cx="${cx}" cy="${cy - 3}" rx="10" ry="5.5" fill="${NAVY}" />
    <!-- perno de apriete lateral -->
    <rect x="${cx + 16}" y="${cy - 8}" width="14" height="8" rx="2" fill="${STEEL}" />
    <!-- cable saliendo -->
    <path d="M ${cx - 18} ${cy - 3} q -34 2 -40 26" fill="none" stroke="${colorD}" stroke-width="11" stroke-linecap="round" />
    <path d="M ${cx - 18} ${cy - 5} q -34 2 -40 26" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity="0.6" />
    <!-- poste central -->
    ${isoCylinderV(cx, cy - 3, 8, 14, PALE, WHITE, SOFT, 0.5)}
    <text x="${cx}" y="${cy - 24}" font-family="Roboto, sans-serif" font-size="30" font-weight="800" fill="${signColor}" text-anchor="middle">${sign}</text>`;
}

// 4. Trenza de masa — cinta metálica trenzada atornillada en ambos extremos.
function groundStrap() {
  const cx = 100;
  const cy = 100;
  const a = iso(cx, cy, -60, -20, 0);
  const b = iso(cx, cy, 60, 20, 0);
  let weave = '';
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 10;
    weave += `<line x1="${x}" y1="${y - 9}" x2="${x + 6}" y2="${y + 9}" stroke="${STEEL_D}" stroke-width="2" />`;
  }
  const lug = (p) => `
    <ellipse cx="${p[0]}" cy="${p[1] + 4}" rx="17" ry="10" fill="${STEEL_D}" />
    <ellipse cx="${p[0]}" cy="${p[1]}" rx="17" ry="10" fill="${STEEL}" />
    <circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${NAVY}" />`;
  return `
    <path d="M ${a[0]} ${a[1]} Q ${cx} ${cy + 18} ${b[0]} ${b[1]}" fill="none" stroke="${STEEL}" stroke-width="20" stroke-linecap="round" />
    <path d="M ${a[0]} ${a[1]} Q ${cx} ${cy + 18} ${b[0]} ${b[1]}" fill="none" stroke="${PALE}" stroke-width="7" stroke-linecap="round" opacity="0.5" />
    ${weave}
    ${lug(a)} ${lug(b)}`;
}

// 5. Fusible principal — portafusible tipo caja con fusible de lámina translúcido.
function mainFuse() {
  const cx = 100;
  const cy = 110;
  const body = isoPrism(cx, cy, 70, 46, 30, MID, BLUE, NAVY);
  // Fusible tipo blade insertado en la tapa.
  const [fx, fy] = iso(cx, cy, 0, 0, 30);
  return `${body}
    <g transform="translate(${fx} ${fy}) skewY(-30)">
      <rect x="-15" y="-30" width="30" height="34" rx="4" fill="${GOLD}" opacity="0.85" />
      <rect x="-15" y="-30" width="30" height="34" rx="4" fill="none" stroke="${COPPER_D}" stroke-width="2" />
      <path d="M -6 -24 L 6 -14 L -6 -4 L 6 4" fill="none" stroke="${COPPER_D}" stroke-width="2.5" />
      <rect x="-11" y="2" width="7" height="12" fill="${STEEL}" />
      <rect x="4" y="2" width="7" height="12" fill="${STEEL}" />
    </g>
    <text x="${fx}" y="${fy + 26}" font-family="Roboto Mono, monospace" font-size="11" font-weight="700" fill="${PALE}" text-anchor="middle">80A</text>`;
}

// 6. Llave de encendido — cilindro de contacto con la llave insertada.
function ignitionSwitch() {
  const cx = 100;
  const cy = 116;
  const barrel = isoCylinderV(cx, cy, 30, 40, MID, SKY, BLUE, 0.5);
  const [tx, ty] = iso(cx, cy, 0, 0, 40);
  return `
    <ellipse cx="${cx}" cy="${cy + 30}" rx="34" ry="16" fill="${NAVY}" opacity="0.45" />
    ${barrel}
    <ellipse cx="${tx}" cy="${ty}" rx="20" ry="10" fill="${BLUE}" />
    <ellipse cx="${tx}" cy="${ty}" rx="11" ry="5.5" fill="${NAVY}" />
    <!-- llave -->
    <g transform="translate(${tx} ${ty})">
      <rect x="-3" y="-46" width="6" height="42" rx="2" fill="${STEEL}" />
      <path d="M -3 -30 h -5 v 5 h 5 M -3 -22 h -5 v 5 h 5" fill="${STEEL_D}" />
      <circle cx="0" cy="-50" r="9" fill="${GOLD}" />
      <circle cx="0" cy="-50" r="4" fill="${NAVY}" />
    </g>`;
}

// 7. Relé de arranque — cubo compacto con patas de terminal.
function starterRelay() {
  const cx = 100;
  const cy = 106;
  const body = isoPrism(cx, cy, 56, 46, 44, SOFT, MID, NAVY);
  // Terminales inferiores.
  let pins = '';
  const base = [iso(cx, cy, -14, 12, 0), iso(cx, cy, 14, 12, 0), iso(cx, cy, 0, -14, 0)];
  for (const p of base) pins += `<rect x="${p[0] - 3}" y="${p[1]}" width="6" height="16" fill="${STEEL}" />`;
  // Símbolo de bobina en la cara superior.
  const [sx, sy] = iso(cx, cy, 0, 0, 44);
  return `${pins}
    ${body}
    <g transform="translate(${sx} ${sy}) skewY(-30) scale(1 0.9)">
      <path d="M -12 0 q 4 -8 8 0 q 4 -8 8 0 q 4 -8 8 0" fill="none" stroke="${PALE}" stroke-width="2.5" />
    </g>`;
}

// 8. Solenoide — bobina cilíndrica con émbolo que sale por un extremo y dos terminales.
function solenoid() {
  const cx = 100;
  const cy = 104;
  // Cuerpo principal, más ancho y con bobinado marcado (para no leerse como "base de datos").
  const body = isoCylinderV(cx, cy, 30, 50, MID, SKY, BLUE, 0.5);
  // Bandas de bobinado de cobre alrededor del cuerpo.
  let coil = '';
  for (let z = 6; z <= 46; z += 6) {
    const [lx, ly] = iso(cx, cy, -30, 0, z);
    const [rx, ry] = iso(cx, cy, 30, 0, z);
    coil += `<path d="M ${lx} ${ly} A 30 15 0 0 0 ${rx} ${ry}" fill="none" stroke="${z % 12 === 0 ? COPPER : COPPER_D}" stroke-width="4" opacity="0.85" />`;
  }
  const [tx, ty] = iso(cx, cy, 0, 0, 50);
  return `
    <ellipse cx="${cx}" cy="${cy + 34}" rx="34" ry="16" fill="${NAVY}" opacity="0.45" />
    ${body}${coil}
    <!-- émbolo (vástago) saliendo por el frente -->
    ${isoCylinderV(cx + 26, cy + 34, 9, 30, STEEL, PALE, STEEL_D, 0.5)}
    <!-- dos terminales sobre la tapa -->
    <g transform="translate(${tx} ${ty})">
      ${isoCylinderV(-10, 0, 5, 9, COPPER, GOLD, COPPER_D, 0.5)}
      ${isoCylinderV(10, 0, 5, 9, COPPER, GOLD, COPPER_D, 0.5)}
    </g>`;
}

// 9. Motor de arranque — cuerpo cilíndrico grande acostado + solenoide encima + piñón.
function starterMotor() {
  const cx = 96;
  const cy = 104;
  const body = isoCylinderH(cx, cy, 34, 96, MID, SKY, BLUE);
  // Solenoide más pequeño montado arriba.
  const sol = isoCylinderH(cx + 6, cy - 34, 17, 60, SOFT, PALE, BLUE);
  // Piñón (bendix) al frente.
  const [px, py] = iso(cx, cy, 54, 0, 0);
  let teeth = '';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    teeth += `<rect x="${px - 2}" y="${py - 20}" width="4" height="7" fill="${STEEL_D}" transform="rotate(${(a * 180) / Math.PI} ${px} ${py})" />`;
  }
  // Bandas del carcasa.
  let bands = '';
  for (const t of [-24, 0, 24]) {
    const a = iso(cx, cy, t, 0, 0);
    bands += `<line x1="${a[0]}" y1="${a[1] - 30}" x2="${a[0] + 15}" y2="${a[1] + 30}" stroke="${NAVY}" stroke-width="2.5" opacity="0.5" />`;
  }
  return `${body}${bands}${sol}
    ${teeth}
    <ellipse cx="${px}" cy="${py}" rx="9" ry="17" fill="${STEEL}" />
    <ellipse cx="${px}" cy="${py}" rx="4" ry="8" fill="${STEEL_D}" />`;
}

// 10. Correa — lazo de correa serpentina con nervaduras.
function belt() {
  const cx = 100;
  const cy = 100;
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="66" ry="40" fill="none" stroke="${BLACK}" stroke-width="20" />
    <ellipse cx="${cx}" cy="${cy}" rx="66" ry="40" fill="none" stroke="${BLACK_L}" stroke-width="20" stroke-dasharray="4 5" />
    <ellipse cx="${cx}" cy="${cy}" rx="66" ry="40" fill="none" stroke="${NAVY}" stroke-width="3" opacity="0.6" />
    <ellipse cx="${cx}" cy="${cy}" rx="46" ry="20" fill="none" stroke="${NAVY}" stroke-width="3" opacity="0.6" />
    <!-- poleas insinuadas -->
    <ellipse cx="${cx - 66}" cy="${cy}" rx="10" ry="16" fill="${STEEL}" />
    <ellipse cx="${cx + 66}" cy="${cy}" rx="10" ry="16" fill="${STEEL}" />`;
}

// 11. Alternador — cuerpo cilíndrico con aletas, polea al frente y ventilador.
function alternator() {
  const cx = 100;
  const cy = 104;
  const body = isoCylinderH(cx, cy, 36, 78, MID, SKY, BLUE);
  // Aletas de refrigeración (líneas sobre el cuerpo).
  let fins = '';
  for (let i = -3; i <= 3; i++) {
    const a = iso(cx, cy, i * 10, 0, 0);
    fins += `<line x1="${a[0]}" y1="${a[1] - 32}" x2="${a[0] + 16}" y2="${a[1] + 32}" stroke="${NAVY}" stroke-width="2" opacity="0.45" />`;
  }
  // Polea al frente (con surco en V).
  const [px, py] = iso(cx, cy, 44, 0, 0);
  // Ventilador detrás (aspas insinuadas).
  const [bx, by] = iso(cx, cy, -42, 0, 0);
  let blades = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    blades += `<line x1="${bx}" y1="${by}" x2="${bx + Math.cos(a) * 9}" y2="${by + Math.sin(a) * 18}" stroke="${STEEL_D}" stroke-width="3" />`;
  }
  return `${body}${fins}
    <ellipse cx="${bx}" cy="${by}" rx="10" ry="20" fill="${STEEL}" />${blades}
    <ellipse cx="${px}" cy="${py}" rx="11" ry="22" fill="${STEEL}" />
    <ellipse cx="${px}" cy="${py}" rx="11" ry="22" fill="none" stroke="${STEEL_D}" stroke-width="3" />
    <ellipse cx="${px}" cy="${py}" rx="5" ry="10" fill="${STEEL_D}" />
    <!-- terminal B+ -->
    ${isoCylinderV(cx - 6, cy + 30, 5, 8, COPPER, GOLD, COPPER_D, 0.5)}`;
}

// 12. Lámpara de carga — testigo del tablero con el símbolo de batería, encendido.
function chargeLamp() {
  const cx = 100;
  const cy = 100;
  return `
    <circle cx="${cx}" cy="${cy}" r="46" fill="${NAVY}" />
    <circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${SOFT}" stroke-width="3" />
    <circle cx="${cx}" cy="${cy}" r="38" fill="${RED}" opacity="0.28" />
    <!-- símbolo de batería -->
    <g transform="translate(${cx} ${cy})">
      <rect x="-24" y="-13" width="48" height="26" rx="3" fill="none" stroke="${GOLD}" stroke-width="3.5" />
      <rect x="-16" y="-19" width="9" height="6" fill="${GOLD}" />
      <rect x="7" y="-19" width="9" height="6" fill="${GOLD}" />
      <text x="-11" y="6" font-family="Roboto, sans-serif" font-size="18" font-weight="800" fill="${GOLD}" text-anchor="middle">+</text>
      <text x="12" y="5" font-family="Roboto, sans-serif" font-size="20" font-weight="800" fill="${GOLD}" text-anchor="middle">−</text>
    </g>`;
}

const PIECES = {
  battery: battery(),
  'terminal-pos': terminal(RED, RED_D, '+', RED),
  'terminal-neg': terminal(BLACK, BLACK_L, '−', BLACK),
  'ground-strap': groundStrap(),
  'main-fuse': mainFuse(),
  'ignition-switch': ignitionSwitch(),
  'starter-relay': starterRelay(),
  solenoid: solenoid(),
  'starter-motor': starterMotor(),
  belt: belt(),
  alternator: alternator(),
  'charge-lamp': chargeLamp(),
};

let count = 0;
for (const [id, body] of Object.entries(PIECES)) {
  const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${body}\n</svg>\n`;
  writeFileSync(resolve(outDir, `iso-${id}.svg`), svg, 'utf-8');
  count++;
}

console.log(`Generadas ${count} piezas de arte isométrico en ${outDir}`);
