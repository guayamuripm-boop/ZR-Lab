import { useMemo, useState } from 'react';
import { CircuitEngine } from '../engine/CircuitEngine';
import { startCircuitDefinition, NODES } from '../engine/circuitDefinition';
import { FAULT_CATALOG } from '../engine/faultCatalog';
import type { FaultDefinition, IgnitionPosition } from '../engine/types';
import { Oscilloscope } from '../instruments/Oscilloscope';

type ScenarioKey = 'off' | 'on' | 'crank' | 'running';

const SCENARIO_OPTIONS: { value: ScenarioKey; label: string }[] = [
  { value: 'off', label: 'Reposo (OFF)' },
  { value: 'on', label: 'Llave ON' },
  { value: 'crank', label: 'START (crank)' },
  { value: 'running', label: 'Motor encendido' },
];

const NODE_LIST = Object.values(NODES);

function applyScenario(engine: CircuitEngine, scenario: ScenarioKey) {
  if (scenario === 'running') {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
  } else {
    engine.setEngineRunning(false);
    engine.setIgnition(scenario as IgnitionPosition);
  }
}

function OscilloscopeMini({ waveform }: { waveform: ReturnType<Oscilloscope['capture']> }) {
  if (waveform.points.length === 0) return <p style={{ color: '#64748b' }}>Sin señal</p>;
  const w = 400;
  const h = 120;
  const minV = Math.min(...waveform.points.map((p) => p.v));
  const maxV = Math.max(...waveform.points.map((p) => p.v));
  const range = maxV - minV || 1;
  const pointsStr = waveform.points
    .map((p, i) => {
      const x = (i / (waveform.points.length - 1)) * w;
      const y = h - ((p.v - minV) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} style={{ background: '#0f172a', borderRadius: 4, border: '1px solid #334155' }}>
      <polyline points={pointsStr} fill="none" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={4} y={12} fill="#94a3b8" fontSize={10} fontFamily="monospace">
        Vpp: {(maxV - minV).toFixed(2)}V | Vdc: {(waveform.points.reduce((a, p) => a + p.v, 0) / waveform.points.length).toFixed(1)}V
      </text>
    </svg>
  );
}

export function DevFaults() {
  const [scenario, setScenario] = useState<ScenarioKey>('off');
  const [selectedFault, setSelectedFault] = useState<FaultDefinition | null>(null);
  const [scopeNode, setScopeNode] = useState<string>(NODES.BAT_POS);

  const { voltages, lampOn, waveform } = useMemo(() => {
    const engine = new CircuitEngine(startCircuitDefinition);
    applyScenario(engine, scenario);
    if (selectedFault) {
      engine.applyFault(selectedFault.componentId, {
        faultId: selectedFault.id,
        forceOpen: selectedFault.forceOpen,
        voltageEffects: selectedFault.effects,
      });
    }
    const meter = new Oscilloscope();
    meter.connect({ node: scopeNode });
    const wf = meter.capture(engine);
    const vMap: Record<string, string> = {};
    for (const node of NODE_LIST) {
      const reading = engine.getVoltageBetween(node, NODES.BAT_NEG);
      vMap[node] = reading.display;
    }
    return { voltages: vMap, lampOn: engine.isChargeLampOn(), waveform: wf };
  }, [scenario, selectedFault, scopeNode]);

  return (
    <main style={{ padding: 24, fontFamily: 'monospace', color: '#e2e8f0', background: '#0f172a', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>/dev/faults — tester del motor de fallas</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Columna izquierda: escenario + falla */}
        <div>
          <fieldset style={{ marginBottom: 16, border: '1px solid #334155', padding: 12, borderRadius: 6 }}>
            <legend style={{ padding: '0 8px', color: '#94a3b8' }}>Escenario</legend>
            {SCENARIO_OPTIONS.map((opt) => (
              <label key={opt.value} style={{ display: 'block', marginBottom: 4, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="scenario"
                  checked={scenario === opt.value}
                  onChange={() => setScenario(opt.value)}
                  style={{ marginRight: 8 }}
                />
                {opt.label}
              </label>
            ))}
          </fieldset>

          <fieldset style={{ border: '1px solid #334155', padding: 12, borderRadius: 6 }}>
            <legend style={{ padding: '0 8px', color: '#94a3b8' }}>Falla activa</legend>
            <label style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="fault"
                checked={selectedFault === null}
                onChange={() => setSelectedFault(null)}
                style={{ marginRight: 8 }}
              />
              Sin falla (normal)
            </label>
            {FAULT_CATALOG.map((f) => (
              <label key={f.id} style={{ display: 'block', marginBottom: 4, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="fault"
                  checked={selectedFault?.id === f.id}
                  onChange={() => setSelectedFault(f)}
                  style={{ marginRight: 8 }}
                />
                <span style={{ color: f.level === 1 ? '#f87171' : f.level === 2 ? '#fbbf24' : '#a78bfa' }}>
                  L{f.level}
                </span>{' '}
                {f.name}
              </label>
            ))}
          </fieldset>
        </div>

        {/* Columna derecha: lecturas + osciloscopio */}
        <div>
          <div style={{ marginBottom: 16, padding: 12, background: '#1e293b', borderRadius: 6 }}>
            <p style={{ marginBottom: 8, color: '#94a3b8', fontSize: 12 }}>Lámpara de carga: {lampOn ? '🔴 ENCENDIDA' : '⚫ apagada'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {NODE_LIST.map((node) => (
                <div key={node} style={{ fontSize: 11, fontFamily: 'monospace' }}>
                  <span style={{ color: '#64748b' }}>{node}:</span>{' '}
                  <span style={{ color: '#e2e8f0' }}>{voltages[node]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 12, background: '#1e293b', borderRadius: 6 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 12 }}>
              Nodo del osciloscopio:{' '}
              <select
                value={scopeNode}
                onChange={(e) => setScopeNode(e.target.value)}
                style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid #475569', borderRadius: 4, padding: '2px 6px' }}
              >
                {NODE_LIST.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <OscilloscopeMini waveform={waveform} />
          </div>
        </div>
      </div>
    </main>
  );
}
