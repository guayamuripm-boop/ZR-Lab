export type LayerView = 'all' | 'arranque' | 'carga';

// Pertenencia de cada pieza a los subcircuitos (doc 08 §2.3): la batería,
// bornes y masa participan en ambos; el resto es exclusivo de su circuito.
const ARRANQUE = new Set([
  'battery',
  'terminal-pos',
  'terminal-neg',
  'ground-strap',
  'main-fuse',
  'ignition-switch',
  'starter-relay',
  'solenoid',
  'starter-motor',
]);

const CARGA = new Set([
  'battery',
  'terminal-pos',
  'terminal-neg',
  'ground-strap',
  'belt',
  'alternator',
  'charge-lamp',
]);

export function isInLayer(pieceId: string, layer: LayerView): boolean {
  if (layer === 'all') return true;
  return layer === 'arranque' ? ARRANQUE.has(pieceId) : CARGA.has(pieceId);
}

export const LAYER_OPTIONS: { value: LayerView; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'arranque', label: 'Arranque' },
  { value: 'carga', label: 'Carga' },
];
