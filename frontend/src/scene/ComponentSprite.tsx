import { useState } from 'react';
import { Group, Image as KonvaImage, Rect } from 'react-konva';
import { useIsoImage } from './useIsoImage';

export type DiscoveryStatus = 'undiscovered' | 'seen' | 'mastered';

export interface ComponentSpriteProps {
  id: string;
  x: number;
  y: number;
  size: number;
  status: DiscoveryStatus;
  selected: boolean;
  accentColor: string;
  onClick: (id: string) => void;
}

const GOLD = '#E8C468';

export function ComponentSprite({ id, x, y, size, status, selected, accentColor, onClick }: ComponentSpriteProps) {
  const image = useIsoImage(`/assets/iso/iso-${id}.svg`);
  const [hovered, setHovered] = useState(false);

  const glowColor = selected ? accentColor : hovered ? accentColor : status === 'mastered' ? GOLD : undefined;
  const glowBlur = selected ? 24 : hovered ? 16 : status === 'mastered' ? 10 : 0;
  const scale = hovered || selected ? 1.06 : 1;
  const opacity = status === 'undiscovered' ? 0.45 : 1;

  return (
    <Group
      x={x}
      y={y}
      offsetX={size / 2}
      offsetY={size / 2}
      scaleX={scale}
      scaleY={scale}
      onMouseEnter={(e) => {
        setHovered(true);
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
      }}
      onClick={() => onClick(id)}
      onTap={() => onClick(id)}
    >
      {image ? (
        <KonvaImage
          image={image}
          width={size}
          height={size}
          opacity={opacity}
          shadowColor={glowColor}
          shadowBlur={glowBlur}
          shadowOpacity={0.8}
        />
      ) : null}
      {status === 'mastered' ? (
        <Rect width={size} height={size} stroke={GOLD} strokeWidth={2} cornerRadius={8} />
      ) : null}
      {selected ? (
        <Rect width={size} height={size} stroke={accentColor} strokeWidth={2} cornerRadius={8} />
      ) : null}
    </Group>
  );
}
