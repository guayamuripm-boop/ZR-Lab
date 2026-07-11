import { describe, expect, it } from 'vitest';
import components from '../../content/components.json';
import type { ComponentContent } from '../../content/types';
import { searchPieces } from '../searchPieces';

const pieces = components as ComponentContent[];

describe('searchPieces', () => {
  it('sin consulta devuelve las 12 piezas', () => {
    expect(searchPieces(pieces, '')).toHaveLength(12);
  });

  it('encuentra por nombre ignorando acentos y mayúsculas', () => {
    const result = searchPieces(pieces, 'bateria');
    expect(result.map((p) => p.id)).toContain('battery');
  });

  it('encuentra por rol ("genera" → alternador)', () => {
    const result = searchPieces(pieces, 'genera');
    expect(result.map((p) => p.id)).toContain('alternator');
  });

  it('filtra por subsistema: el alternador no aparece en "arranque"', () => {
    const result = searchPieces(pieces, '', 'arranque');
    const ids = result.map((p) => p.id);
    expect(ids).not.toContain('alternator');
    expect(ids).toContain('starter-motor');
  });

  it('consulta sin coincidencias devuelve lista vacía', () => {
    expect(searchPieces(pieces, 'zzzzz')).toHaveLength(0);
  });
});
