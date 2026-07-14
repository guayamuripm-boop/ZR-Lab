import { Text, Group } from 'react-konva';
import layout from './layout.json';
import componentsData from '../content/components.json';
import { isInLayer } from './subsystems';
import type { LayerView } from '../stores/useSceneStore';

/**
 * Etiquetas de nombre debajo de cada pieza del vano.
 * La escena no calcula nada, solo informa al estudiante.
 * Colores adaptados para fondo oscuro del vano (funciona en dark y light).
 */
interface ComponentLabelsProps {
  layerView: LayerView;
  discoveredIds: Set<string>;
}

const componentNames: Record<string, string> = Object.fromEntries(
  componentsData.map((c) => [c.scene_key, c.name]),
);

export function ComponentLabels({ layerView, discoveredIds }: ComponentLabelsProps) {
  return (
    <Group listening={false}>
      {layout.pieces.map((piece) => {
        if (!isInLayer(piece.id, layerView)) return null;
        const name = componentNames[piece.id];
        if (!name) return null;
        const visible = discoveredIds.has(piece.id);
        return (
          <Text
            key={`label-${piece.id}`}
            x={piece.x}
            y={piece.y + piece.displaySize / 2 + 6}
            text={name}
            fontSize={11}
            fontFamily="Roboto, sans-serif"
            fill={visible ? '#cbd5e1' : '#64748b'}
            align="center"
            width={piece.displaySize}
            offsetX={piece.displaySize / 2}
            opacity={visible ? 1 : 0.5}
          />
        );
      })}
    </Group>
  );
}
