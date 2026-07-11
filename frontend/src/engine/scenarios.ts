import { NODES } from './circuitDefinition';
import type { IgnitionPosition } from './types';

export interface Scenario {
  nodeVoltages: Record<string, number>;
  chargeLampOn: boolean;
}

// Tabla maestra de valores — fuente de verdad doc 08 §4.
// Voltajes relativos a N-GND = 0V. Cada fila del doc se refleja exactamente aquí;
// cualquier corrección del instructor se hace en este archivo.
const SCENARIOS: Record<string, Scenario> = {
  'off:false': {
    nodeVoltages: {
      [NODES.BAT_POS]: 12.6,
      [NODES.BAT_NEG]: 0,
      [NODES.MAIN]: 12.6,
      [NODES.IGN1]: 0,
      [NODES.IGN2]: 0,
      [NODES.RELAY_OUT]: 0,
      [NODES.SOL]: 0,
      [NODES.STARTER]: 0,
      [NODES.ALT_BPOS]: 12.6,
      [NODES.LAMP]: 0,
      [NODES.GND]: 0,
    },
    chargeLampOn: false,
  },
  'on:false': {
    nodeVoltages: {
      [NODES.BAT_POS]: 12.4,
      [NODES.BAT_NEG]: 0,
      [NODES.MAIN]: 12.4,
      [NODES.IGN1]: 12.3,
      [NODES.IGN2]: 0,
      [NODES.RELAY_OUT]: 0,
      [NODES.SOL]: 0,
      [NODES.STARTER]: 0,
      [NODES.ALT_BPOS]: 12.4,
      [NODES.LAMP]: 12.3,
      [NODES.GND]: 0,
    },
    chargeLampOn: true,
  },
  'crank:false': {
    nodeVoltages: {
      [NODES.BAT_POS]: 10.5,
      [NODES.BAT_NEG]: 0,
      [NODES.MAIN]: 10.4,
      [NODES.IGN1]: 10.3,
      [NODES.IGN2]: 10.3,
      [NODES.RELAY_OUT]: 10.2,
      [NODES.SOL]: 10.2,
      [NODES.STARTER]: 10.1,
      [NODES.ALT_BPOS]: 10.4,
      [NODES.LAMP]: 10.3,
      [NODES.GND]: 0,
    },
    chargeLampOn: true,
  },
  'on:true': {
    nodeVoltages: {
      [NODES.BAT_POS]: 14.1,
      [NODES.BAT_NEG]: 0,
      [NODES.MAIN]: 14.1,
      [NODES.IGN1]: 14.0,
      [NODES.IGN2]: 0,
      [NODES.RELAY_OUT]: 0,
      [NODES.SOL]: 0,
      [NODES.STARTER]: 0,
      [NODES.ALT_BPOS]: 14.2,
      [NODES.LAMP]: 14.0,
      [NODES.GND]: 0,
    },
    chargeLampOn: false,
  },
};

export function getScenario(ignition: IgnitionPosition, engineRunning: boolean): Scenario {
  const key = `${ignition}:${engineRunning}`;
  const scenario = SCENARIOS[key];
  if (!scenario) {
    // crank + engineRunning no es un estado físico válido (no se cranquea con el motor ya encendido).
    throw new Error(`Combinación de escenario inválida: ignition=${ignition}, engineRunning=${engineRunning}`);
  }
  return scenario;
}
