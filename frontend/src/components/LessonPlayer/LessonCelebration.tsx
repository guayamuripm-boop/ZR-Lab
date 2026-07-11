import { useEffect } from 'react';
import { useLessonStore } from '../../stores/useLessonStore';

const CELEBRATION_MS = 1500; // máximo 1.5s: celebrar sin interrumpir (doc 04 §1.5)

// Celebración sobria de taller (doc 04 §7): micro-animación glass al completar
// una lección, se descarta sola y nunca bloquea el flujo.
export function LessonCelebration() {
  const celebration = useLessonStore((s) => s.celebration);
  const clearCelebration = useLessonStore((s) => s.clearCelebration);

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(clearCelebration, CELEBRATION_MS);
    return () => clearTimeout(timer);
  }, [celebration, clearCelebration]);

  if (!celebration) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="glass flex flex-col items-center gap-2 px-8 py-6 text-center"
        style={{
          borderRadius: 'var(--radius-modal)',
          border: '1px solid var(--gold)',
          boxShadow: '0 0 32px rgba(232, 196, 104, 0.45)',
          animation: `celebracion-pop var(--duration-panel) var(--ease-liquid)`,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 40 }}>
          🔧
        </span>
        <p className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          ¡Bien ahí! Lección completada.
        </p>
        <p className="text-sm" style={{ color: 'var(--gold)' }}>
          Insignia ganada: {celebration.lessonTitle.replace(/^🔗\s*(Integradora:)?\s*/, '')}
        </p>
      </div>
      <style>{`
        @keyframes celebracion-pop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
