import { useState } from 'react';
import { GlassButton } from '../ui/GlassButton';
import { markOnboardingDone } from './onboardingState';

interface TourStep {
  title: string;
  text: string;
  emoji: string;
}

const STEPS: TourStep[] = [
  {
    emoji: '🔧',
    title: 'Bienvenido a ZR Lab',
    text: 'Este es tu taller virtual. Aquí conoces las piezas del sistema de arranque y carga, y practicas mediciones reales sin miedo a dañar nada.',
  },
  {
    emoji: '👆',
    title: 'Toca las piezas',
    text: 'Haz clic en cualquier componente del motor para abrir su ficha: qué es, cómo funciona, cómo se prueba y qué pasa cuando falla.',
  },
  {
    emoji: '🔑',
    title: 'La llave de encendido',
    text: 'A la izquierda tienes la llave. Cambia entre OFF, ON y START (mantén presionado START para arrancar el motor) y observa cómo cambia el circuito.',
  },
  {
    emoji: '📊',
    title: 'El multímetro',
    text: 'Arrastra las sondas roja y negra a los puntos de medición. El multímetro te muestra la lectura real, igual que en el taller.',
  },
  {
    emoji: '🎯',
    title: 'Tu primera misión',
    text: 'Abre "Lecciones" y empieza por "Bienvenido al taller": descubre tus primeras 4 piezas. ¡Vamos!',
  },
];

export function OnboardingTour({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  function finish() {
    markOnboardingDone();
    onFinish();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(9, 13, 34, 0.55)' }}
      role="dialog"
      aria-label="Tour de bienvenida"
    >
      <div className="glass max-w-md p-6" style={{ borderRadius: 'var(--radius-modal)' }}>
        <div className="mb-3 text-4xl" aria-hidden="true">
          {step.emoji}
        </div>
        <h2 className="mb-2 font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {step.title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {step.text}
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 20 : 6,
                background: i === index ? 'var(--accent)' : 'var(--glass-surface-2)',
              }}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button type="button" onClick={finish} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Saltar
          </button>
          <GlassButton variant="primary" onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}>
            {isLast ? 'Empezar' : 'Siguiente'}
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
