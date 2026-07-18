import { useMemo, useState } from 'react';
import { NODES } from '../engine/circuitDefinition';
import { Oscilloscope } from '../instruments/Oscilloscope';
import { useSceneStore } from '../stores/useSceneStore';

const NODE_LIST = Object.values(NODES);

const NODE_LABELS: Record<string, string> = {
  [NODES.BAT_POS]: 'Batería (+)',
  [NODES.BAT_NEG]: 'Batería (−)',
  [NODES.MAIN]: 'Fusible principal',
  [NODES.IGN1]: 'Llave ON',
  [NODES.IGN2]: 'Llave START',
  [NODES.RELAY_OUT]: 'Salida relé',
  [NODES.SOL]: 'Solenoide',
  [NODES.STARTER]: 'Arranque',
  [NODES.ALT_BPOS]: 'Alternador B+',
  [NODES.LAMP]: 'Lámpara carga',
  [NODES.GND]: 'Masa',
};

function WaveformDisplay({ waveform }: { waveform: ReturnType<Oscilloscope['capture']> }) {
  const w = 600;
  const h = 200;

  if (waveform.points.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          width: w,
          height: h,
          background: '#0a0e18',
          borderRadius: 8,
          border: '1px solid #1e2a3a',
          color: '#4a5568',
        }}
      >
        Sin señal — conecta el osciloscopio a un nodo
      </div>
    );
  }

  const values = waveform.points.map((p) => p.v);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const padding = range * 0.1;
  const displayMin = minV - padding;
  const displayMax = maxV + padding;
  const displayRange = displayMax - displayMin;

  const pointsStr = waveform.points
    .map((p, i) => {
      const x = (i / (waveform.points.length - 1)) * w;
      const y = h - ((p.v - displayMin) / displayRange) * h;
      return `${x},${y}`;
    })
    .join(' ');

  const gridLines = 5;

  return (
    <svg width={w} height={h} style={{ background: '#0a0e18', borderRadius: 8, border: '1px solid #1e2a3a' }}>
      {/* Grid */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const y = (i / gridLines) * h;
        const v = displayMax - (i / gridLines) * displayRange;
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={w} y2={y} stroke="#1a2430" strokeWidth={0.5} />
            <text x={4} y={y - 3} fill="#4a5568" fontSize={9} fontFamily="monospace">
              {v.toFixed(1)}V
            </text>
          </g>
        );
      })}
      {/* Waveform */}
      <polyline points={pointsStr} fill="none" stroke="#38bdf8" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

export function OscilloscopeScreen() {
  const getEngine = useSceneStore((s) => s.getEngine);
  const ignition = useSceneStore((s) => s.ignition);
  const engineRunning = useSceneStore((s) => s.engineRunning);
  const [selectedNode, setSelectedNode] = useState<string>(NODES.BAT_POS);

  const { waveform, vpp, vdc, hasRipple } = useMemo(() => {
    const engine = getEngine();
    const scope = new Oscilloscope();
    scope.connect({ node: selectedNode });
    const wf = scope.capture(engine);
    return {
      waveform: wf,
      vpp: scope.getVpp(),
      vdc: scope.getVdc(),
      hasRipple: scope.hasRipple(),
    };
  }, [selectedNode, getEngine]);

  const scenarioLabel = engineRunning
    ? 'Motor encendido'
    : ignition === 'crank'
      ? 'Cranking'
      : ignition === 'on'
        ? 'Llave ON'
        : 'Reposo';

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Osciloscopio Virtual
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Escenario: {scenarioLabel} · Nodo: {NODE_LABELS[selectedNode] ?? selectedNode}
            </p>
          </div>
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-xl px-4 py-2 text-sm"
            style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
          >
            ← Volver
          </button>
        </div>

        {/* Selección de nodo */}
        <div className="glass mb-6 rounded-[16px] p-4">
          <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Nodo de medición
          </label>
          <div className="flex flex-wrap gap-2">
            {NODE_LIST.map((node) => (
              <button
                key={node}
                type="button"
                onClick={() => setSelectedNode(node)}
                className="rounded-lg px-3 py-1.5 text-xs transition-colors"
                style={{
                  background: selectedNode === node ? 'var(--accent)' : 'var(--glass-surface-2)',
                  color: selectedNode === node ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {NODE_LABELS[node] ?? node}
              </button>
            ))}
          </div>
        </div>

        {/* Forma de onda */}
        <div className="glass mb-6 rounded-[16px] p-4">
          <h2 className="mb-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Forma de onda
          </h2>
          <div className="flex justify-center">
            <WaveformDisplay waveform={waveform} />
          </div>
        </div>

        {/* Mediciones */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass rounded-[16px] p-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Vpp (pico a pico)
            </p>
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {vpp.toFixed(2)}V
            </p>
          </div>
          <div className="glass rounded-[16px] p-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Vdc (promedio)
            </p>
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {vdc.toFixed(2)}V
            </p>
          </div>
          <div className="glass rounded-[16px] p-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Rizado
            </p>
            <p
              className="font-display text-2xl font-bold"
              style={{ color: hasRipple ? 'var(--warning)' : 'var(--success)' }}
            >
              {hasRipple ? 'Presente' : 'Ausente'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
