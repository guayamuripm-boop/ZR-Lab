import { useEffect, useMemo, useState } from 'react';
import type { LessonStep } from '../../content/types';
import { validateOrder } from './lessonValidation';

// Baraja determinista por índice para que el orden mostrado no coincida ya con
// la respuesta (evita que el paso se resuelva sin interacción).
function shuffledIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function OrderStep({ step, onResolved }: { step: LessonStep; onResolved: (ok: boolean) => void }) {
  const items = step.items ?? [];
  const answer = (step.answer as number[]) ?? [];
  const display = useMemo(() => shuffledIndices(items.length), [items.length]);
  const [sequence, setSequence] = useState<number[]>([]);

  useEffect(() => {
    setSequence([]);
    onResolved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function handleClick(originalIndex: number) {
    if (sequence.includes(originalIndex)) return;
    const next = [...sequence, originalIndex];
    setSequence(next);
    if (next.length === items.length) {
      onResolved(validateOrder(next, answer));
    }
  }

  function reset() {
    setSequence([]);
    onResolved(false);
  }

  const complete = sequence.length === items.length;
  const correct = complete && validateOrder(sequence, answer);

  return (
    <div className="text-sm">
      <p className="mb-2 font-medium">{step.instruction}</p>
      <div className="flex flex-col gap-2">
        {display.map((originalIndex) => {
          const order = sequence.indexOf(originalIndex);
          const picked = order !== -1;
          return (
            <button
              key={originalIndex}
              type="button"
              onClick={() => handleClick(originalIndex)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors"
              style={{
                background: picked ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'var(--glass-surface-2)',
                color: 'var(--text-primary)',
              }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                style={{ background: picked ? 'var(--accent)' : 'transparent', color: picked ? '#fff' : 'var(--text-secondary)', border: picked ? 'none' : '1px solid var(--glass-border)' }}
              >
                {picked ? order + 1 : ''}
              </span>
              {items[originalIndex]}
            </button>
          );
        })}
      </div>
      {complete && !correct ? (
        <button type="button" onClick={reset} className="mt-2 text-sm underline" style={{ color: 'var(--warning)' }}>
          Ese no es el orden. Toca para intentar de nuevo.
        </button>
      ) : null}
      {correct ? (
        <p className="mt-2 font-medium" style={{ color: 'var(--success)' }}>
          ¡Orden correcto!
        </p>
      ) : null}
    </div>
  );
}
