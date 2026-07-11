import { describe, expect, it } from 'vitest';
import { isInLayer } from '../subsystems';
import layout from '../layout.json';

describe('isInLayer', () => {
  it('en "all" toda pieza es visible', () => {
    for (const piece of layout.pieces) {
      expect(isInLayer(piece.id, 'all')).toBe(true);
    }
  });

  it('el motor de arranque pertenece solo al circuito de arranque', () => {
    expect(isInLayer('starter-motor', 'arranque')).toBe(true);
    expect(isInLayer('starter-motor', 'carga')).toBe(false);
  });

  it('el alternador y la correa pertenecen solo al circuito de carga', () => {
    expect(isInLayer('alternator', 'carga')).toBe(true);
    expect(isInLayer('alternator', 'arranque')).toBe(false);
    expect(isInLayer('belt', 'carga')).toBe(true);
    expect(isInLayer('belt', 'arranque')).toBe(false);
  });

  it('batería, bornes y masa participan en ambos circuitos', () => {
    for (const shared of ['battery', 'terminal-pos', 'terminal-neg', 'ground-strap']) {
      expect(isInLayer(shared, 'arranque')).toBe(true);
      expect(isInLayer(shared, 'carga')).toBe(true);
    }
  });

  it('cada una de las 12 piezas del layout pertenece al menos a un circuito', () => {
    for (const piece of layout.pieces) {
      expect(isInLayer(piece.id, 'arranque') || isInLayer(piece.id, 'carga')).toBe(true);
    }
  });
});
