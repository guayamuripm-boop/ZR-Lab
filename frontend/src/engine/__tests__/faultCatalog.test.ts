import { describe, expect, it, beforeEach } from 'vitest';
import { CircuitEngine } from '../CircuitEngine';
import { NODES, startCircuitDefinition } from '../circuitDefinition';
import { FAULT_CATALOG, getFaultById, getFaultsByComponent } from '../faultCatalog';

function makeEngine(): CircuitEngine {
  return new CircuitEngine(startCircuitDefinition);
}

describe('FaultCatalog — catálogo de 12 fallas (doc 08 §5)', () => {
  it('contiene exactamente 12 fallas', () => {
    expect(FAULT_CATALOG.length).toBe(12);
  });

  it('cada falla tiene id único', () => {
    const ids = FAULT_CATALOG.map((f) => f.id);
    expect(new Set(ids).size).toBe(12);
  });

  it('cada falla apunta a un componente válido del circuito', () => {
    const validIds = startCircuitDefinition.components.map((c) => c.id);
    for (const fault of FAULT_CATALOG) {
      expect(validIds).toContain(fault.componentId);
    }
  });

  it('getFaultById devuelve la falla correcta', () => {
    const fault = getFaultById('fault-battery-discharged');
    expect(fault).toBeDefined();
    expect(fault!.name).toBe('Batería descargada');
  });

  it('getFaultById devuelve undefined para id inexistente', () => {
    expect(getFaultById('no-existe')).toBeUndefined();
  });

  it('getFaultsByComponent devuelve las fallas de un componente', () => {
    const faults = getFaultsByComponent('alternator');
    expect(faults.length).toBe(2);
    expect(faults.map((f) => f.id)).toContain('fault-alternator-no-charge');
    expect(faults.map((f) => f.id)).toContain('fault-regulator-high');
  });
});

describe('Falla 1 — Batería descargada', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('battery', {
      voltageEffects: getFaultById('fault-battery-discharged')!.effects,
      componentState: 'failed',
    });
  });

  it('reposo: 11.8V (doc 08 §5: V reposo 11.8V)', () => {
    engine.setIgnition('off');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(11.8);
  });

  it('crank: 8.0V (doc 08 §5: crank cae a 8V)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(8.0);
  });

  it('crank: N-STARTER ≈ 7.6V (caída adicional por cable)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.STARTER, NODES.GND).value).toBe(7.6);
  });

  it('motor encendido: mantiene voltaje base (la falla es de batería, no de alternador)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    const value = engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value;
    expect(value).toBe(14.1);
  });
});

describe('Falla 2 — Borne positivo sulfatado', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('terminal-pos', {
      voltageEffects: getFaultById('fault-terminal-pos-corroded')!.effects,
      componentState: 'degraded',
    });
  });

  it('reposo: sin cambio (sin paso de corriente)', () => {
    engine.setIgnition('off');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.6);
  });

  it('crank: N-MAIN cae a 9.6V (caída 0.8V en borne)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.MAIN, NODES.GND).value).toBe(9.6);
  });

  it('crank: batería sigue en 10.5V (la caída es después del borne)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(10.5);
  });
});

describe('Falla 3 — Fusible principal quemado', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('main-fuse', {
      forceOpen: true,
      voltageEffects: getFaultById('fault-fuse-blown')!.effects,
    });
  });

  it('resistencia: OL (circuito abierto)', () => {
    const reading = engine.getResistanceBetween(NODES.BAT_POS, NODES.MAIN);
    expect(reading.display).toBe('OL');
    expect(reading.quality).toBe('open');
  });

  it('estado del componente: failed', () => {
    expect(engine.getComponentState('main-fuse').state).toBe('failed');
  });

  it('clearFaults restaura el fusible', () => {
    engine.clearFaults();
    const reading = engine.getResistanceBetween(NODES.BAT_POS, NODES.MAIN);
    expect(reading.value).toBe(0);
    expect(engine.getComponentState('main-fuse').state).toBe('ok');
  });
});

describe('Falla 4 — Trenza de masa corroída', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('ground-strap', {
      voltageEffects: getFaultById('fault-ground-strap-corroded')!.effects,
      componentState: 'degraded',
    });
  });

  it('reposo: sin cambio significativo', () => {
    engine.setIgnition('off');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.6);
  });

  it('crank: N-GND sube a 1.2V (masa corrupta)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.GND, NODES.BAT_NEG).value).toBe(1.2);
  });

  it('crank: voltaje batería-a-masa se reduce por la caída de masa', () => {
    engine.setIgnition('crank');
    const batToGnd = engine.getVoltageBetween(NODES.BAT_POS, NODES.GND).value;
    expect(batToGnd).toBeLessThan(10.5);
  });
});

describe('Falla 5 — Relé de arranque abierto', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('starter-relay', {
      forceOpen: true,
      voltageEffects: getFaultById('fault-relay-open')!.effects,
    });
  });

  it('resistencia de bobina: OL', () => {
    const reading = engine.getResistanceBetween(NODES.IGN2, NODES.GND);
    expect(reading.display).toBe('OL');
  });

  it('estado: failed', () => {
    expect(engine.getComponentState('starter-relay').state).toBe('failed');
  });
});

describe('Falla 6 — Contactos de solenoide gastados', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('solenoid', {
      voltageEffects: getFaultById('fault-solenoid-worn')!.effects,
      componentState: 'degraded',
    });
  });

  it('crank: N-STARTER = 0V (no paso de potencia)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.STARTER, NODES.GND).value).toBe(0);
  });

  it('crank: N-SOL sigue con voltaje (la bobina funciona)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.SOL, NODES.GND).value).toBe(10.2);
  });
});

describe('Falla 7 — Escobillas del arranque gastadas', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('starter-motor', {
      voltageEffects: getFaultById('fault-starter-worn')!.effects,
      componentState: 'degraded',
    });
  });

  it('crank: N-STARTER = 8.0V (giro lento, caída interna)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.STARTER, NODES.GND).value).toBe(8.0);
  });

  it('crank: batería sigue en 10.5V (problema es del arranque, no de la batería)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(10.5);
  });
});

describe('Falla 8 — Correa floja', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('belt', {
      voltageEffects: getFaultById('fault-belt-loose')!.effects,
      componentState: 'degraded',
    });
  });

  it('reposo: sin cambio', () => {
    engine.setIgnition('off');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.6);
  });

  it('motor encendido: 13.0V (carga intermitente, por debajo de lo normal)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(13.0);
  });

  it('motor encendido: lámpara encendida (13.0V < 13.5V, carga insuficiente)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.isChargeLampOn()).toBe(true);
  });
});

describe('Falla 9 — Correa rota', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('belt', {
      voltageEffects: getFaultById('fault-belt-snapped')!.effects,
      componentState: 'failed',
    });
  });

  it('motor encendido: 12.3V (sin carga, cayendo)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(12.3);
  });

  it('motor encendido: lámpara encendida (no hay carga)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.isChargeLampOn()).toBe(true);
  });
});

describe('Falla 10 — Alternador sin carga (diodos)', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('alternator', {
      voltageEffects: getFaultById('fault-alternator-no-charge')!.effects,
      componentState: 'failed',
    });
  });

  it('motor encendido: 12.3V (sin generación)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(12.3);
  });

  it('motor encendido: lámpara encendida', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.isChargeLampOn()).toBe(true);
  });

  it('crank: voltaje normal (la falla es del alternador, no afecta arranque)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(10.5);
  });
});

describe('Falla 11 — Regulador alto', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('alternator', {
      voltageEffects: getFaultById('fault-regulator-high')!.effects,
      componentState: 'degraded',
    });
  });

  it('motor encendido: 15.6V (sobrecarga peligrosa)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.getVoltageBetween(NODES.ALT_BPOS, NODES.GND).value).toBe(15.6);
  });

  it('motor encendido: batería también a 15.6V (sobrecargada)', () => {
    engine.setIgnition('on');
    engine.setEngineRunning(true);
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(15.6);
  });

  it('reposo: voltaje normal (el regulador solo falla con alternador girando)', () => {
    engine.setIgnition('off');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.6);
  });
});

describe('Falla 12 — Llave desgastada (START intermitente)', () => {
  let engine: CircuitEngine;
  beforeEach(() => {
    engine = makeEngine();
    engine.applyFault('ignition-switch', {
      voltageEffects: getFaultById('fault-ignition-worn')!.effects,
      componentState: 'degraded',
    });
  });

  it('crank: N-IGN2 = 0V (no llega señal de arranque)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.IGN2, NODES.GND).value).toBe(0);
  });

  it('crank: N-SOL = 0V (sin señal, el solenoide no acciona)', () => {
    engine.setIgnition('crank');
    expect(engine.getVoltageBetween(NODES.SOL, NODES.GND).value).toBe(0);
  });

  it('llave ON: funciona normal (solo START está dañado)', () => {
    engine.setIgnition('on');
    expect(engine.getVoltageBetween(NODES.IGN1, NODES.GND).value).toBe(12.3);
  });
});

describe('CircuitEngine — clearFaults restaura estado completo', () => {
  it('restaura componentes y efectos de voltaje', () => {
    const engine = makeEngine();
    engine.applyFault('battery', {
      voltageEffects: getFaultById('fault-battery-discharged')!.effects,
      componentState: 'failed',
    });
    engine.setIgnition('off');
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(11.8);

    engine.clearFaults();
    expect(engine.getVoltageBetween(NODES.BAT_POS, NODES.BAT_NEG).value).toBe(12.6);
    expect(engine.getComponentState('battery').state).toBe('ok');
  });
});
