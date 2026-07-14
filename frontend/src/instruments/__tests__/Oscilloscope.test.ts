import { describe, expect, it, beforeEach } from 'vitest';
import { CircuitEngine } from '../../engine/CircuitEngine';
import { NODES, startCircuitDefinition } from '../../engine/circuitDefinition';
import { Oscilloscope } from '../Oscilloscope';

function makeEngine(): CircuitEngine {
  return new CircuitEngine(startCircuitDefinition);
}

describe('Oscilloscope — instrumento virtual (capa 3)', () => {
  let osc: Oscilloscope;
  let engine: CircuitEngine;

  beforeEach(() => {
    osc = new Oscilloscope();
    engine = makeEngine();
  });

  it('disconnect antes de capture devuelve waveform vacío', () => {
    const waveform = osc.capture(engine);
    expect(waveform.points.length).toBe(0);
    expect(waveform.node).toBe('');
  });

  it('conecta y captura forma de onda del nodo', () => {
    osc.connect({ node: NODES.BAT_POS });
    engine.setIgnition('off');
    const waveform = osc.capture(engine);
    expect(waveform.node).toBe(NODES.BAT_POS);
    expect(waveform.points.length).toBeGreaterThan(0);
    expect(waveform.timebaseMs).toBe(20);
  });

  it('disconnect limpia la sonda', () => {
    osc.connect({ node: NODES.BAT_POS });
    osc.disconnect();
    const waveform = osc.capture(engine);
    expect(waveform.points.length).toBe(0);
  });
});

describe('Oscilloscope — formas de onda por escenario', () => {
  let osc: Oscilloscope;
  let engine: CircuitEngine;

  beforeEach(() => {
    osc = new Oscilloscope();
    engine = makeEngine();
  });

  it('batería en reposo: DC plano (sin rizado)', () => {
    osc.connect({ node: NODES.BAT_POS });
    engine.setIgnition('off');
    const waveform = osc.capture(engine);
    expect(osc.hasRipple(waveform)).toBe(false);
    const vdc = osc.getVdc(waveform);
    expect(vdc.value).toBe(12.6);
  });

  it('alternador con motor encendido: rizado visible (>0.1V p-p)', () => {
    osc.connect({ node: NODES.ALT_BPOS });
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    const waveform = osc.capture(engine);
    expect(osc.hasRipple(waveform)).toBe(true);
    const vpp = osc.getVpp(waveform);
    expect(vpp.value).toBeGreaterThan(0.1);
  });

  it('alternador con motor encendido: Vdc ≈ 14.1V (promedio)', () => {
    osc.connect({ node: NODES.ALT_BPOS });
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    const waveform = osc.capture(engine);
    const vdc = osc.getVdc(waveform);
    // El ripple de onda rectificada centra el promedio en ~14.25V (base 14.2V + offset del ripple)
    expect(vdc.value).toBeGreaterThanOrEqual(14.0);
    expect(vdc.value).toBeLessThanOrEqual(14.5);
  });

  it('solenoide durante crank: pulso con sobreimpulso', () => {
    osc.connect({ node: NODES.SOL });
    engine.setIgnition('crank');
    const waveform = osc.capture(engine);
    expect(waveform.points.length).toBe(200);
    // El primer punto debe ser bajo (inicio de subida)
    expect(waveform.points[0].v).toBeLessThan(1);
    // Puntos intermedios deben alcanzar voltaje del solenoide
    const midPoints = waveform.points.slice(50, 150);
    const maxMid = Math.max(...midPoints.map((p) => p.v));
    expect(maxMid).toBeGreaterThanOrEqual(9);
  });

  it('IGN2 durante crank: pulso cuadrado', () => {
    osc.connect({ node: NODES.IGN2 });
    engine.setIgnition('crank');
    const waveform = osc.capture(engine);
    // Debe haber puntos en 0V (antes del pulso) y en ~10.3V (durante)
    const voltages = waveform.points.map((p) => p.v);
    expect(voltages.some((v) => v === 0)).toBe(true);
    expect(voltages.some((v) => v > 10)).toBe(true);
  });

  it('batería con motor encendido: DC con ripple mínimo', () => {
    osc.connect({ node: NODES.BAT_POS });
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    const waveform = osc.capture(engine);
    const vdc = osc.getVdc(waveform);
    expect(vdc.value).toBe(14.1);
    // Ripple mínimo (<0.1V)
    expect(osc.hasRipple(waveform)).toBe(false);
  });
});

describe('Oscilloscope — mediciones', () => {
  let osc: Oscilloscope;
  let engine: CircuitEngine;

  beforeEach(() => {
    osc = new Oscilloscope();
    engine = makeEngine();
  });

  it('getVpp calcula voltaje pico a pico', () => {
    osc.connect({ node: NODES.ALT_BPOS });
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    const waveform = osc.capture(engine);
    const vpp = osc.getVpp(waveform);
    expect(vpp.unit).toBe('V');
    expect(vpp.value).toBeGreaterThan(0);
  });

  it('getVdc calcula voltaje DC promedio', () => {
    osc.connect({ node: NODES.BAT_POS });
    engine.setIgnition('off');
    const waveform = osc.capture(engine);
    const vdc = osc.getVdc(waveform);
    expect(vdc.display).toContain('V');
    expect(vdc.value).toBe(12.6);
  });

  it('getVpp de waveform vacío devuelve 0', () => {
    const vpp = osc.getVpp({ node: '', points: [], timebaseMs: 0, scaleV: 0 });
    expect(vpp.value).toBe(0);
  });

  it('getVdc de waveform vacío devuelve 0', () => {
    const vdc = osc.getVdc({ node: '', points: [], timebaseMs: 0, scaleV: 0 });
    expect(vdc.value).toBe(0);
  });
});

describe('Oscilloscope — con fallas activas', () => {
  let osc: Oscilloscope;
  let engine: CircuitEngine;

  beforeEach(() => {
    osc = new Oscilloscope();
    engine = makeEngine();
  });

  it('correa rota: alternador sin rizado, voltaje bajo', () => {
    engine.applyFault('belt', {
      voltageEffects: { running: { [NODES.ALT_BPOS]: 12.3 } },
      componentState: 'failed',
    });
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    osc.connect({ node: NODES.ALT_BPOS });
    const waveform = osc.capture(engine);
    expect(osc.hasRipple(waveform)).toBe(false);
    const vdc = osc.getVdc(waveform);
    expect(vdc.value).toBeCloseTo(12.3, 0);
  });

  it('regulador alto: alternador con voltaje excesivo', () => {
    engine.applyFault('alternator', {
      voltageEffects: { running: { [NODES.ALT_BPOS]: 15.6 } },
      componentState: 'degraded',
    });
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    osc.connect({ node: NODES.ALT_BPOS });
    const waveform = osc.capture(engine);
    expect(osc.hasRipple(waveform)).toBe(false);
    const vdc = osc.getVdc(waveform);
    expect(vdc.value).toBeCloseTo(15.6, 0);
  });
});
