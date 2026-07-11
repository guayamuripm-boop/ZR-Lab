import { describe, expect, it } from 'vitest';
import { CircuitEngine } from '../../engine/CircuitEngine';
import { NODES, startCircuitDefinition } from '../../engine/circuitDefinition';
import { Multimeter } from '../Multimeter';

describe('Multimeter', () => {
  it('lee voltaje de batería en reposo a través del engine', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('off');
    const meter = new Multimeter();
    meter.connect({ red: NODES.BAT_POS, black: NODES.BAT_NEG });
    expect(meter.read(engine).display).toBe('12.6 V');
  });

  it('cambia a modo Ω y lee resistencia del fusible', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    const meter = new Multimeter();
    meter.setMode('Ω');
    meter.connect({ red: NODES.BAT_POS, black: NODES.MAIN });
    expect(meter.read(engine).display).toBe('0.0 Ω');
  });

  it('lanza error si se lee sin sondas conectadas', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    const meter = new Multimeter();
    expect(() => meter.read(engine)).toThrow();
  });
});
