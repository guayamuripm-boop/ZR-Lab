import { describe, expect, it, beforeEach } from 'vitest';
import { CircuitEngine } from '../CircuitEngine';
import { NODES, startCircuitDefinition } from '../circuitDefinition';

// Cobertura exacta de la tabla maestra doc 08 §4.
describe('CircuitEngine — escenario reposo (off)', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('off');
  });

  it('batería en reposo = 12.6V', () => {
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.6);
  });
  it('N-MAIN en reposo = 12.6V', () => {
    expect(engine.getVoltageBetween(NODES.MAIN, NODES.GND).value).toBe(12.6);
  });
  it('N-IGN1 en reposo = 0V', () => {
    expect(engine.getVoltageBetween(NODES.IGN1, NODES.GND).value).toBe(0);
  });
  it('N-IGN2 en reposo = 0V', () => {
    expect(engine.getVoltageBetween(NODES.IGN2, NODES.GND).value).toBe(0);
  });
  it('N-SOL en reposo = 0V', () => {
    expect(engine.getVoltageBetween(NODES.SOL, NODES.GND).value).toBe(0);
  });
  it('N-STARTER en reposo = 0V', () => {
    expect(engine.getVoltageBetween(NODES.STARTER, NODES.GND).value).toBe(0);
  });
  it('N-ALT-B+ en reposo = 12.6V', () => {
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(12.6);
  });
  it('lámpara de carga apagada en reposo', () => {
    expect(engine.isChargeLampOn()).toBe(false);
  });
  it('display formateado "12.6 V"', () => {
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).display).toBe('12.6 V');
  });
});

describe('CircuitEngine — escenario llave ON', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('on');
  });

  it('batería en ON = 12.4V', () => {
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.4);
  });
  it('N-MAIN en ON = 12.4V', () => {
    expect(engine.getVoltageBetween(NODES.MAIN, NODES.GND).value).toBe(12.4);
  });
  it('N-IGN1 en ON = 12.3V', () => {
    expect(engine.getVoltageBetween(NODES.IGN1, NODES.GND).value).toBe(12.3);
  });
  it('N-IGN2 en ON = 0V (no arranca sin crank)', () => {
    expect(engine.getVoltageBetween(NODES.IGN2, NODES.GND).value).toBe(0);
  });
  it('N-ALT-B+ en ON = 12.4V', () => {
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(12.4);
  });
  it('lámpara de carga encendida en ON', () => {
    expect(engine.isChargeLampOn()).toBe(true);
  });
});

describe('CircuitEngine — escenario crank (START)', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('crank');
  });

  it('batería en crank ≈ 10.5V (sana: 9.6-10.8)', () => {
    const value = engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value;
    expect(value).toBeGreaterThanOrEqual(9.6);
    expect(value).toBeLessThanOrEqual(10.8);
    expect(value).toBe(10.5);
  });
  it('N-MAIN en crank = 10.4V', () => {
    expect(engine.getVoltageBetween(NODES.MAIN, NODES.GND).value).toBe(10.4);
  });
  it('N-IGN1 en crank = 10.3V', () => {
    expect(engine.getVoltageBetween(NODES.IGN1, NODES.GND).value).toBe(10.3);
  });
  it('N-IGN2 en crank = 10.3V', () => {
    expect(engine.getVoltageBetween(NODES.IGN2, NODES.GND).value).toBe(10.3);
  });
  it('N-SOL (señal solenoide) en crank = 10.2V', () => {
    expect(engine.getVoltageBetween(NODES.SOL, NODES.GND).value).toBe(10.2);
  });
  it('N-STARTER en crank = 10.1V (caída de cable ≤0.5V)', () => {
    const starter = engine.getVoltageBetween(NODES.STARTER, NODES.GND).value;
    const battery = engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value;
    expect(starter).toBe(10.1);
    expect(battery - starter).toBeLessThanOrEqual(0.5);
  });
  it('caída de borne+ en crank ≤ 0.1V', () => {
    const bat = engine.getVoltageBetween(NODES.BAT_POS, NODES.GND).value;
    const main = engine.getVoltageBetween(NODES.MAIN, NODES.GND).value;
    expect(bat - main).toBeLessThanOrEqual(0.1);
  });
  it('caída de masa en crank ≤ 0.2V', () => {
    expect(engine.getVoltageBetween(NODES.BAT_NEG, NODES.GND).value).toBeLessThanOrEqual(0.2);
  });
  it('lámpara de carga encendida en crank', () => {
    expect(engine.isChargeLampOn()).toBe(true);
  });
});

describe('CircuitEngine — escenario motor encendido (running)', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('on');
    engine.setEngineRunning(true);
  });

  it('batería con motor encendido = 14.1V (13.8-14.4)', () => {
    const value = engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value;
    expect(value).toBeGreaterThanOrEqual(13.8);
    expect(value).toBeLessThanOrEqual(14.4);
  });
  it('N-ALT-B+ con motor encendido = 14.2V', () => {
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(14.2);
  });
  it('N-IGN2 vuelve a 0V (no se puede seguir cranqueando)', () => {
    expect(engine.getVoltageBetween(NODES.IGN2, NODES.GND).value).toBe(0);
  });
  it('lámpara de carga apagada con motor encendido (confirma carga)', () => {
    expect(engine.isChargeLampOn()).toBe(false);
  });
  it('setEngineRunning(true) fuerza ignition a "on"', () => {
    const engine2 = new CircuitEngine(startCircuitDefinition);
    engine2.setIgnition('crank');
    engine2.setEngineRunning(true);
    expect(engine2.snapshot().ignition).toBe('on');
    expect(engine2.snapshot().engineRunning).toBe(true);
  });
});

describe('CircuitEngine — lecturas de resistencia (circuito desenergizado)', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = new CircuitEngine(startCircuitDefinition);
  });

  it('fusible principal sano ≈ 0Ω', () => {
    const reading = engine.getResistanceBetween(NODES.BAT_POS, NODES.MAIN);
    expect(reading.value).toBe(0);
    expect(reading.quality).toBe('normal');
  });
  it('bobina del relé = 80Ω (rango sano 70-90)', () => {
    const reading = engine.getResistanceBetween(NODES.IGN2, NODES.GND);
    expect(reading.value).toBe(80);
    expect(reading.value).toBeGreaterThanOrEqual(70);
    expect(reading.value).toBeLessThanOrEqual(90);
  });
  it('trenza de masa sana ≈ 0Ω', () => {
    expect(engine.getResistanceBetween(NODES.BAT_NEG, NODES.GND).value).toBe(0);
  });
  it('par de nodos sin componente directo → OL', () => {
    const reading = engine.getResistanceBetween(NODES.SOL, NODES.LAMP);
    expect(reading.display).toBe('OL');
    expect(reading.quality).toBe('open');
    expect(Number.isFinite(reading.value)).toBe(false);
  });
});

describe('CircuitEngine — lecturas de error realistas', () => {
  it('sondas invertidas producen valor negativo', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('off');
    const normal = engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG);
    const reversed = engine.getVoltageBetween(NODES.BAT_NEG, NODES.BAT_POS);
    expect(reversed.value).toBe(-normal.value);
    expect(reversed.display).toBe('-12.6 V');
  });

  it('fusible quemado (fallo forzado) da OL en resistencia', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    engine.applyFault('main-fuse', { forceOpen: true });
    const reading = engine.getResistanceBetween(NODES.BAT_POS, NODES.MAIN);
    expect(reading.display).toBe('OL');
    expect(reading.quality).toBe('open');
    expect(engine.getComponentState('main-fuse').state).toBe('failed');
  });

  it('clearFaults restaura el fusible a su estado sano', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    engine.applyFault('main-fuse', { forceOpen: true });
    engine.clearFaults();
    const reading = engine.getResistanceBetween(NODES.BAT_POS, NODES.MAIN);
    expect(reading.value).toBe(0);
    expect(engine.getComponentState('main-fuse').state).toBe('ok');
  });

  it('applyFault sobre componente inexistente lanza error', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    expect(() => engine.applyFault('no-existe', { forceOpen: true })).toThrow();
  });
});

describe('CircuitEngine — snapshot y componentes', () => {
  it('snapshot refleja ignition y engineRunning actuales', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    engine.setIgnition('crank');
    const snap = engine.snapshot();
    expect(snap.ignition).toBe('crank');
    expect(snap.engineRunning).toBe(false);
    expect(snap.nodeVoltages.get(NODES.STARTER)).toBe(10.1);
  });

  it('getComponentState devuelve los 12 componentes del sistema', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    const ids = startCircuitDefinition.components.map((c) => c.id);
    expect(ids.length).toBe(12);
    for (const id of ids) {
      expect(engine.getComponentState(id).id).toBe(id);
    }
  });

  it('getComponentState sobre id desconocido lanza error', () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    expect(() => engine.getComponentState('no-existe')).toThrow();
  });
});
