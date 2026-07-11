import { useEffect, useState } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';

const DISMISS_KEY = 'zr-lab-orientation-hint-dismissed';
const NARROW_PORTRAIT_MAX = 600;

// Sugerencia (no bloqueo) de rotar a paisaje en celulares angostos para las
// lecciones de medición (doc 04 §5.1 / doc 09 FAQ). Se descarta y no insiste
// durante la sesión.
export function OrientationHint() {
  const { width, height } = useWindowSize();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === 'true');
  const [visible, setVisible] = useState(false);

  const isNarrowPortrait = width < NARROW_PORTRAIT_MAX && height > width;

  useEffect(() => {
    setVisible(isNarrowPortrait && !dismissed);
  }, [isNarrowPortrait, dismissed]);

  if (!visible) return null;

  return (
    <div className="glass fixed inset-x-2 top-14 z-30 flex items-center justify-between gap-2 px-3 py-2" role="status">
      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
        📱 Gira el teléfono a horizontal: se trabaja mejor en el taller.
      </span>
      <button
        type="button"
        aria-label="Descartar sugerencia"
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, 'true');
          setDismissed(true);
        }}
        className="px-1 text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        ×
      </button>
    </div>
  );
}
