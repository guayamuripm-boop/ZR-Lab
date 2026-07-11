import type { ButtonHTMLAttributes } from 'react';

export type GlassButtonVariant = 'primary' | 'secondary' | 'ghost';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
}

export function GlassButton({ variant = 'primary', className, style, children, ...rest }: GlassButtonProps) {
  const base: React.CSSProperties = {
    borderRadius: 'var(--radius-button)',
    padding: '10px 20px',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: 15,
    minHeight: 44,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: `transform var(--duration-micro) var(--ease-liquid), box-shadow var(--duration-micro) var(--ease-liquid), opacity var(--duration-micro) var(--ease-liquid)`,
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'var(--accent)',
          color: 'var(--zr-white)',
          boxShadow: 'var(--glow)',
        }
      : variant === 'secondary'
        ? {
            background: 'var(--glass-surface-2)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(12px) saturate(140%)',
            WebkitBackdropFilter: 'blur(12px) saturate(140%)',
          }
        : {
            background: 'transparent',
            color: 'var(--text-secondary)',
          };

  return (
    <button
      className={className}
      style={{ ...base, ...variantStyle, ...style }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
