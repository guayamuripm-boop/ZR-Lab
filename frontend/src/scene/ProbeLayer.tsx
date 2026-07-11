import { useRef, useState } from 'react';
import Konva from 'konva';
import { Circle, Group, Label, Tag, Text } from 'react-konva';
import { useSceneStore, type ProbeColor } from '../stores/useSceneStore';
import layout from './layout.json';
import { findNearestMeasurementPoint } from './probeSnap';

const RED = '#E5484D';
const BLACK = '#21284F';

function nearestPoint(x: number, y: number) {
  return findNearestMeasurementPoint(x, y, layout.measurementPoints);
}

function Probe({ color, restX, restY }: { color: ProbeColor; restX: number; restY: number }) {
  const groupRef = useRef<Konva.Group>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const placeProbe = useSceneStore((s) => s.placeProbe);
  const fill = color === 'red' ? RED : BLACK;

  return (
    <Group
      ref={groupRef}
      x={restX}
      y={restY}
      draggable
      onDragMove={(e) => {
        const snap = nearestPoint(e.target.x(), e.target.y());
        setHoverLabel(snap ? snap.id : null);
      }}
      onDragEnd={(e) => {
        const snap = nearestPoint(e.target.x(), e.target.y());
        if (snap) {
          e.target.position({ x: snap.x, y: snap.y });
          placeProbe(color, snap.id);
        } else {
          placeProbe(color, null);
        }
        setHoverLabel(null);
      }}
    >
      <Circle radius={10} fill={fill} stroke="#FFFFFF" strokeWidth={2} shadowBlur={hoverLabel ? 12 : 0} />
      {hoverLabel ? (
        <Label y={-28} x={-40}>
          <Tag fill="#21284F" cornerRadius={4} />
          <Text text={hoverLabel} fontSize={11} fill="#FFFFFF" padding={4} fontFamily="Roboto Mono, monospace" />
        </Label>
      ) : null}
    </Group>
  );
}

export function ProbeLayer() {
  return (
    <>
      <Probe color="red" restX={40} restY={620} />
      <Probe color="black" restX={90} restY={620} />
    </>
  );
}
