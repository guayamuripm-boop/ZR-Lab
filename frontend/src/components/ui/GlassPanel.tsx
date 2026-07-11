import type { ReactNode } from 'react';

export type GlassElevation = 'hud' | 'panel' | 'modal';

const BLUR_BY_ELEVATION: Record<GlassElevation, number> = {
  hud: 12,
  panel: 18,
  modal: 24,
};

const RADIUS_BY_ELEVATION: Record<GlassElevation, string> = {
  hud: '14px',
  panel: 'var(--radius-card)',
  modal: 'var(--radius-modal)',
};

export interface GlassPanelProps {
  elevation?: GlassElevation;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GlassPanel({ elevation = 'panel', children, className, style }: GlassPanelProps) {
  const blur = BLUR_BY_ELEVATION[elevation];
  return (
    <div
      className={`glass ${className ?? ''}`}
      style={{
        backdropFilter: `blur(${blur}px) saturate(140%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(140%)`,
        borderRadius: RADIUS_BY_ELEVATION[elevation],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
