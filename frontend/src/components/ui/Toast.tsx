import { useEffect } from 'react';
import { GlassPanel } from './GlassPanel';

export type ToastVariant = 'success' | 'info' | 'error';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
  onDismiss?: () => void;
}

const ICON_BY_VARIANT: Record<ToastVariant, string> = {
  success: '✓',
  info: 'ℹ',
  error: '⚠',
};

const COLOR_BY_VARIANT: Record<ToastVariant, string> = {
  success: 'var(--success)',
  info: 'var(--accent)',
  error: 'var(--danger)',
};

export function Toast({ message, variant = 'info', durationMs = 3000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!onDismiss) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onDismiss]);

  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', top: 24, right: 24, zIndex: 50 }}>
      <GlassPanel elevation="hud" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span aria-hidden="true" style={{ color: COLOR_BY_VARIANT[variant], fontWeight: 700 }}>
          {ICON_BY_VARIANT[variant]}
        </span>
        <span style={{ color: 'var(--text-primary)', fontFamily: 'Roboto, sans-serif', fontSize: 14 }}>
          {message}
        </span>
      </GlassPanel>
    </div>
  );
}
