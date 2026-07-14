import { Text, Group, Rect } from 'react-konva';
import type { LayerView } from '../stores/useSceneStore';

/**
 * Etiquetas de zona del vano del motor.
 * Muestra áreas etiquetadas: "Sistema de Arranque", "Sistema de Carga", "Chasis".
 * La escena no calcula nada, solo da contexto visual al estudiante.
 */
interface ZoneLabelsProps {
  layerView: LayerView;
}

const ZONES: { label: string; x: number; y: number; width: number; height: number; layers: LayerView[] }[] = [
  {
    label: 'Sistema de Arranque',
    x: 350,
    y: 460,
    width: 300,
    height: 30,
    layers: ['all', 'arranque'],
  },
  {
    label: 'Sistema de Carga',
    x: 750,
    y: 200,
    width: 200,
    height: 30,
    layers: ['all', 'carga'],
  },
  {
    label: 'Chasis / Masa',
    x: 80,
    y: 470,
    width: 150,
    height: 30,
    layers: ['all'],
  },
];

export function ZoneLabels({ layerView }: ZoneLabelsProps) {
  return (
    <Group listening={false}>
      {ZONES.map((zone) => {
        if (!zone.layers.includes(layerView)) return null;
        return (
          <Group key={zone.label}>
            <Rect
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              cornerRadius={4}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth={1}
              opacity={0.7}
            />
            <Text
              x={zone.x}
              y={zone.y + 7}
              text={zone.label}
              fontSize={11}
              fontFamily="Roboto, sans-serif"
              fill="#64748b"
              align="center"
              width={zone.width}
            />
          </Group>
        );
      })}
    </Group>
  );
}
