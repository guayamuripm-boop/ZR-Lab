import type { CircuitComponent, CircuitDefinition } from './types';

// Nodos eléctricos oficiales (doc 08 §2.1)
export const NODES = {
  BAT_POS: 'N-BAT+',
  BAT_NEG: 'N-BAT-',
  MAIN: 'N-MAIN',
  IGN1: 'N-IGN1',
  IGN2: 'N-IGN2',
  RELAY_OUT: 'N-RELAY-OUT',
  SOL: 'N-SOL',
  STARTER: 'N-STARTER',
  ALT_BPOS: 'N-ALT-B+',
  LAMP: 'N-LAMP',
  GND: 'N-GND',
} as const;

// Componentes y conexiones del sistema de arranque y carga (doc 08 §2.2).
// Las 12 fichas del explorador se reflejan en content/components.json;
// aquí solo se modela lo eléctricamente relevante para el CircuitEngine.
const components: CircuitComponent[] = [
  {
    id: 'battery',
    type: 'battery',
    nodes: [NODES.BAT_POS, NODES.BAT_NEG],
    properties: { voltage: 12.6, resistance: 0.005 },
    state: 'ok',
  },
  {
    // Ficha propia en el explorador, pero eléctricamente en serie con main-fuse
    // (mismo par de nodos): no se modela como arista independiente para evitar
    // ambigüedad en getResistanceBetween. Su prueba real es inspección visual.
    id: 'terminal-pos',
    type: 'battery_terminal',
    nodes: [],
    properties: { resistance: 0 },
    state: 'ok',
  },
  {
    // Igual que terminal-pos: en serie con ground-strap, sin arista propia.
    id: 'terminal-neg',
    type: 'battery_terminal',
    nodes: [],
    properties: { resistance: 0 },
    state: 'ok',
  },
  {
    id: 'main-fuse',
    type: 'fuse',
    nodes: [NODES.BAT_POS, NODES.MAIN],
    properties: { resistance: 0, maxCurrent: 80 },
    state: 'ok',
  },
  {
    id: 'ignition-switch',
    type: 'ignition_switch',
    nodes: [NODES.MAIN, NODES.IGN1, NODES.IGN2],
    properties: { resistance: 0 },
    state: 'ok',
  },
  {
    id: 'starter-relay',
    type: 'starter_relay',
    nodes: [NODES.IGN2, NODES.GND],
    properties: { resistance: 80 },
    state: 'ok',
  },
  {
    id: 'solenoid',
    type: 'solenoid',
    nodes: [NODES.RELAY_OUT, NODES.SOL, NODES.STARTER],
    properties: { resistance: 0.6 },
    state: 'ok',
  },
  {
    id: 'starter-motor',
    type: 'starter_motor',
    nodes: [NODES.STARTER, NODES.GND],
    properties: { resistance: 0.05, maxCurrent: 200 },
    state: 'ok',
  },
  {
    id: 'alternator',
    type: 'alternator',
    nodes: [NODES.ALT_BPOS, NODES.GND],
    properties: { resistance: 0.02, maxCurrent: 90 },
    state: 'ok',
  },
  {
    id: 'belt',
    type: 'belt',
    nodes: [],
    properties: { resistance: 0, mechanical: true },
    state: 'ok',
  },
  {
    id: 'charge-lamp',
    type: 'warning_lamp',
    nodes: [NODES.IGN1, NODES.LAMP, NODES.ALT_BPOS],
    properties: { resistance: 40 },
    state: 'ok',
  },
  {
    id: 'ground-strap',
    type: 'ground',
    nodes: [NODES.BAT_NEG, NODES.GND],
    properties: { resistance: 0 },
    state: 'ok',
  },
];

export const startCircuitDefinition: CircuitDefinition = { components };
