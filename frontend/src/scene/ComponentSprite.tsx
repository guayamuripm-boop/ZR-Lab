import { useState } from 'react';
import { Ellipse, Group, Image as KonvaImage, Rect, Text } from 'react-konva';
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
  dimmed?: boolean;
  label?: string;
  labelColor: string;
  labelHalo: string;
  labelDx?: number;
  labelDy?: number;
  onClick: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}

const GOLD = '#E8C468';

export function ComponentSprite({
  id,
  x,
  y,
  size,
  status,
  selected,
  accentColor,
  dimmed = false,
  label,
  labelColor,
  labelHalo,
  labelDx = 0,
  labelDy = 0,
  onClick,
  onDoubleClick,
}: ComponentSpriteProps) {
  const image = useIsoImage(`/assets/iso/iso-${id}.svg`);
  const [hovered, setHovered] = useState(false);

  const glowColor = selected ? accentColor : hovered ? accentColor : status === 'mastered' ? GOLD : undefined;
  const glowBlur = selected ? 24 : hovered ? 16 : status === 'mastered' ? 10 : 0;
  const scale = hovered || selected ? 1.06 : 1;
  // La vista por capas (RF-B4) atenúa piezas fuera del subcircuito activo.
  const opacity = dimmed ? 0.15 : status === 'undiscovered' ? 0.45 : 1;
  const labelOpacity = dimmed ? 0.15 : status === 'undiscovered' ? 0.6 : 1;

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
      onDblClick={() => onDoubleClick?.(id)}
      onDblTap={() => onDoubleClick?.(id)}
    >
      {/* Sombra de contacto: apoya la pieza en la superficie (no flota) */}
      <Ellipse
        x={size / 2}
        y={size * 0.9}
        radiusX={size * 0.34}
        radiusY={size * 0.11}
        fill="#0B0F22"
        opacity={dimmed ? 0.06 : 0.22}
        listening={false}
      />
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
      {/* Etiqueta con el nombre (texto desde el contenido) para entender cada pieza */}
      {label ? (
        <Text
          text={label}
          x={size / 2 - 90 + labelDx}
          y={size + 5 + labelDy}
          width={180}
          align="center"
          fontSize={13}
          fontStyle="600"
          fontFamily="Roboto, sans-serif"
          fill={labelColor}
          opacity={labelOpacity}
          shadowColor={labelHalo}
          shadowBlur={4}
          shadowOpacity={1}
          listening={false}
        />
      ) : null}
    </Group>
  );
}
