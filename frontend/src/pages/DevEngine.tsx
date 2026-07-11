import { useMemo, useState } from 'react';
import { CircuitEngine } from '../engine/CircuitEngine';
import { NODES, startCircuitDefinition } from '../engine/circuitDefinition';
import type { IgnitionPosition } from '../engine/types';
import { Multimeter, type MultimeterMode } from '../instruments/Multimeter';

type ScenarioKey = 'off' | 'on' | 'crank' | 'running';

const SCENARIO_OPTIONS: { value: ScenarioKey; label: string }[] = [
  { value: 'off', label: 'Reposo (llave OFF)' },
  { value: 'on', label: 'Llave ON' },
  { value: 'crank', label: 'START (crank)' },
  { value: 'running', label: 'Motor encendido' },
];

const NODE_OPTIONS = Object.entries(NODES).map(([key, value]) => ({ key, value }));

function applyScenario(engine: CircuitEngine, scenario: ScenarioKey) {
  if (scenario === 'running') {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
  } else {
    engine.setEngineRunning(false);
    engine.setIgnition(scenario as IgnitionPosition);
  }
}

export function DevEngine() {
  const [scenario, setScenario] = useState<ScenarioKey>('off');
  const [nodeA, setNodeA] = useState<string>(NODES.BAT_POS);
  const [nodeB, setNodeB] = useState<string>(NODES.BAT_NEG);
  const [mode, setMode] = useState<MultimeterMode>('V');

  const { display, quality, lampOn } = useMemo(() => {
    const engine = new CircuitEngine(startCircuitDefinition);
    applyScenario(engine, scenario);
    const meter = new Multimeter();
    meter.setMode(mode);
    meter.connect({ red: nodeA, black: nodeB });
    const reading = meter.read(engine);
    return { display: reading.display, quality: reading.quality, lampOn: engine.isChargeLampOn() };
  }, [scenario, nodeA, nodeB, mode]);

  return (
    <main style={{ padding: 24, fontFamily: 'monospace', color: '#eee', background: '#111', minHeight: '100vh' }}>
      <h1>/dev/engine — herramienta interna de verificación</h1>

      <fieldset style={{ marginBottom: 16 }}>
        <legend>Escenario</legend>
        {SCENARIO_OPTIONS.map((opt) => (
          <label key={opt.value} style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="scenario"
              checked={scenario === opt.value}
              onChange={() => setScenario(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      <fieldset style={{ marginBottom: 16 }}>
        <legend>Sonda roja (nodo A)</legend>
        <select value={nodeA} onChange={(e) => setNodeA(e.target.value)}>
          {NODE_OPTIONS.map((n) => (
            <option key={n.key} value={n.value}>
              {n.value}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset style={{ marginBottom: 16 }}>
        <legend>Sonda negra (nodo B)</legend>
        <select value={nodeB} onChange={(e) => setNodeB(e.target.value)}>
          {NODE_OPTIONS.map((n) => (
            <option key={n.key} value={n.value}>
              {n.value}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset style={{ marginBottom: 16 }}>
        <legend>Modo</legend>
        <label style={{ marginRight: 12 }}>
          <input type="radio" name="mode" checked={mode === 'V'} onChange={() => setMode('V')} />V
        </label>
        <label>
          <input type="radio" name="mode" checked={mode === 'Ω'} onChange={() => setMode('Ω')} />Ω
        </label>
      </fieldset>

      <div data-testid="reading" style={{ fontSize: 32, fontWeight: 'bold' }}>
        {display} <span style={{ fontSize: 14, opacity: 0.6 }}>({quality})</span>
      </div>

      <p>Lámpara de carga: {lampOn ? '🔴 encendida' : '⚫ apagada'}</p>
    </main>
  );
}
