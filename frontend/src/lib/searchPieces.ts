import type { ComponentContent } from '../content/types';
import { isInLayer, type LayerView } from '../scene/subsystems';

// Normaliza para búsqueda tolerante a acentos ("bateria" encuentra "Batería").
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function searchPieces(
  pieces: ComponentContent[],
  query: string,
  layer: LayerView = 'all',
): ComponentContent[] {
  const q = normalize(query.trim());
  return pieces.filter((piece) => {
    if (!isInLayer(piece.id, layer)) return false;
    if (!q) return true;
    return normalize(piece.name).includes(q) || normalize(piece.short_role).includes(q);
  });
}
