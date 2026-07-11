import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Line } from 'react-konva';
import layout from './layout.json';

const WIRE_COLOR: Record<string, string> = {
  positive: '#98BAE3',
  ground: '#21284F',
  signal: '#3869B1',
};

export interface WireLayerProps {
  crankEnergized: boolean;
  chargeEnergized: boolean;
}

function Wire({ points, color, animated }: { points: number[]; color: string; animated: boolean }) {
  const lineRef = useRef<Konva.Line>(null);

  useEffect(() => {
    if (!animated || !lineRef.current) return;
    const anim = new Konva.Animation((frame) => {
      if (!lineRef.current || !frame) return;
      lineRef.current.dashOffset(-(frame.time / 20) % 16);
    }, lineRef.current.getLayer());
    anim.start();
    return () => {
      anim.stop();
    };
  }, [animated]);

  return (
    <Line
      ref={lineRef}
      points={points}
      stroke={color}
      strokeWidth={animated ? 4 : 3}
      lineCap="round"
      lineJoin="round"
      dash={animated ? [10, 6] : undefined}
      opacity={animated ? 1 : 0.55}
    />
  );
}

export function WireLayer({ crankEnergized, chargeEnergized }: WireLayerProps) {
  return (
    <>
      {layout.wires.map((wire) => {
        const animated =
          (wire.id === 'wire-crank' && crankEnergized) || (wire.id === 'wire-charge' && chargeEnergized);
        return (
          <Wire key={wire.id} points={wire.points} color={WIRE_COLOR[wire.type]} animated={animated} />
        );
      })}
    </>
  );
}
