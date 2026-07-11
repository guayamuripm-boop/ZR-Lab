import { useEffect, useRef, useState } from 'react';
import { Multimeter } from '../../instruments/Multimeter';
import { useSceneStore } from '../../stores/useSceneStore';

const COUNT_UP_MS = 300;

export function MultimeterHUD() {
  const probes = useSceneStore((s) => s.probes);
  const mode = useSceneStore((s) => s.multimeterMode);
  const setMode = useSceneStore((s) => s.setMultimeterMode);
  const getEngine = useSceneStore((s) => s.getEngine);
  const ignition = useSceneStore((s) => s.ignition);
  const engineRunning = useSceneStore((s) => s.engineRunning);

  const [displayValue, setDisplayValue] = useState(0);
  const [finalDisplay, setFinalDisplay] = useState('— ');
  const animRef = useRef<number>(0);

  const connected = probes.red !== null && probes.black !== null;

  useEffect(() => {
    if (!connected || !probes.red || !probes.black) {
      setFinalDisplay('— ');
      setDisplayValue(0);
      return;
    }

    const engine = getEngine();
    const meter = new Multimeter();
    meter.setMode(mode);
    meter.connect({ red: probes.red, black: probes.black });
    const reading = meter.read(engine);

    setFinalDisplay(reading.display);

    if (!Number.isFinite(reading.value)) {
      setDisplayValue(0);
      return;
    }

    const start = performance.now();
    const from = displayValue;
    const to = reading.value;
    cancelAnimationFrame(animRef.current);

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / COUNT_UP_MS);
      setDisplayValue(from + (to - from) * progress);
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [probes.red, probes.black, mode, ignition, engineRunning]);

  const unit = mode === 'V' ? 'V' : 'Ω';
  const shownText = connected
    ? Number.isFinite(displayValue)
      ? `${displayValue.toFixed(1)} ${unit}`
      : finalDisplay
    : '— —';

  return (
    <div className="glass fixed bottom-24 left-1/2 z-30 -translate-x-1/2 px-5 py-3 md:bottom-6" style={{ minWidth: 220 }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('V')}
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: mode === 'V' ? 'var(--accent)' : 'transparent', color: mode === 'V' ? '#fff' : 'var(--text-secondary)' }}
          >
            V
          </button>
          <button
            type="button"
            onClick={() => setMode('Ω')}
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: mode === 'Ω' ? 'var(--accent)' : 'transparent', color: mode === 'Ω' ? '#fff' : 'var(--text-secondary)' }}
          >
            Ω
          </button>
        </div>
        <div
          aria-live="polite"
          style={{ fontFamily: 'Roboto Mono, monospace', fontSize: 20, color: 'var(--text-primary)', minWidth: 90, textAlign: 'right' }}
        >
          {shownText}
        </div>
      </div>
    </div>
  );
}
