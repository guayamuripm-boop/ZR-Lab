import { useRef } from 'react';
import { useSceneStore } from '../../stores/useSceneStore';

const CRANK_TO_START_MS = 800;

export function IgnitionKey() {
  const ignition = useSceneStore((s) => s.ignition);
  const setIgnition = useSceneStore((s) => s.setIgnition);
  const setEngineRunning = useSceneStore((s) => s.setEngineRunning);
  const engineRunning = useSceneStore((s) => s.engineRunning);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCrankStart() {
    if (engineRunning) return;
    setIgnition('crank');
    startTimer.current = setTimeout(() => {
      setEngineRunning(true);
    }, CRANK_TO_START_MS);
  }

  function handleCrankRelease() {
    if (startTimer.current) {
      clearTimeout(startTimer.current);
      startTimer.current = null;
    }
    if (ignition === 'crank') setIgnition('on');
  }

  return (
    <div className="glass fixed left-4 top-20 z-30 flex flex-col gap-2 p-3" role="group" aria-label="Llave de encendido">
      <button
        type="button"
        onClick={() => {
          setEngineRunning(false);
          setIgnition('off');
        }}
        className="rounded-full px-3 py-1.5 text-sm"
        style={{
          background: ignition === 'off' ? 'var(--accent)' : 'transparent',
          color: ignition === 'off' ? '#fff' : 'var(--text-secondary)',
        }}
      >
        OFF
      </button>
      <button
        type="button"
        onClick={() => setIgnition('on')}
        className="rounded-full px-3 py-1.5 text-sm"
        style={{
          background: ignition === 'on' ? 'var(--accent)' : 'transparent',
          color: ignition === 'on' ? '#fff' : 'var(--text-secondary)',
        }}
      >
        ON
      </button>
      <button
        type="button"
        onMouseDown={handleCrankStart}
        onMouseUp={handleCrankRelease}
        onMouseLeave={handleCrankRelease}
        onTouchStart={handleCrankStart}
        onTouchEnd={handleCrankRelease}
        className="rounded-full px-3 py-1.5 text-sm"
        style={{
          background: ignition === 'crank' ? 'var(--danger)' : 'transparent',
          color: ignition === 'crank' ? '#fff' : 'var(--text-secondary)',
        }}
      >
        START
      </button>
      {engineRunning ? (
        <span className="text-center text-xs" style={{ color: 'var(--success)' }}>
          Motor encendido
        </span>
      ) : null}
    </div>
  );
}
