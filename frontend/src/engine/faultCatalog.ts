import { NODES } from './circuitDefinition';
import type { FaultDefinition } from './types';

/**
 * Catálogo de 12 fallas del sistema de arranque y carga (doc 08 §5).
 * Cada falla define los efectos de voltaje por escenario que el CircuitEngine
 * aplica sobre la tabla base de escenarios.ts.
 *
 * Fuente de verdad: doc 08 §5 + §4 (tabla maestra de valores normales).
 */
export const FAULT_CATALOG: FaultDefinition[] = [
  {
    id: 'fault-battery-discharged',
    name: 'Batería descargada',
    componentId: 'battery',
    description: 'La batería no retiene carga suficiente. Voltaje en reposo por debajo de 12.0V.',
    symptom: 'El carro no quiere prender en las mañanas',
    level: 1,
    effects: {
      off: { [NODES.BAT_POS]: 11.8, [NODES.MAIN]: 11.8, [NODES.ALT_BPOS]: 11.8 },
      crank: { [NODES.BAT_POS]: 8.0, [NODES.MAIN]: 7.9, [NODES.IGN1]: 7.8, [NODES.IGN2]: 7.8, [NODES.RELAY_OUT]: 7.7, [NODES.SOL]: 7.7, [NODES.STARTER]: 7.6, [NODES.ALT_BPOS]: 7.9, [NODES.LAMP]: 7.8 },
    },
  },
  {
    id: 'fault-terminal-pos-corroded',
    name: 'Borne positivo sulfatado',
    componentId: 'terminal-pos',
    description: 'Corrosión en el borne positivo causa caída de voltaje durante el paso de corriente.',
    symptom: 'A veces arranca, a veces solo hace clic',
    level: 1,
    effects: {
      crank: { [NODES.MAIN]: 9.6 },
    },
  },
  {
    id: 'fault-fuse-blown',
    name: 'Fusible principal quemado',
    componentId: 'main-fuse',
    description: 'Circuito abierto: no pasa corriente de la batería al sistema.',
    symptom: 'Se quedó muerto de repente, sin luces ni nada',
    level: 1,
    forceOpen: true,
    effects: {},
  },
  {
    id: 'fault-ground-strap-corroded',
    name: 'Trenza de masa corroída',
    componentId: 'ground-strap',
    description: 'Resistencia elevada en la masa causa caída de voltaje durante la retorno de corriente.',
    symptom: 'Arranca lento y las luces parpadean',
    level: 2,
    effects: {
      crank: { [NODES.GND]: 1.2 },
    },
  },
  {
    id: 'fault-relay-open',
    name: 'Relé de arranque abierto',
    componentId: 'starter-relay',
    description: 'Bobina del relé en circuito abierto (OL). No energiza, no cierra el contacto al solenoide.',
    symptom: 'Giro la llave y no hace absolutamente nada',
    level: 2,
    forceOpen: true,
    effects: {},
  },
  {
    id: 'fault-solenoid-worn',
    name: 'Contactos de solenoide gastados',
    componentId: 'solenoid',
    description: 'El solenoide hace clic (bobina funciona) pero los contactos de potencia no cierran.',
    symptom: 'Hace clic clic clic pero no arranca',
    level: 2,
    effects: {
      crank: { [NODES.STARTER]: 0 },
    },
  },
  {
    id: 'fault-starter-worn',
    name: 'Escobillas del arranque gastadas',
    componentId: 'starter-motor',
    description: 'Las escobillas desgastadas reducen la capacidad del arranque. Giro lento con batería sana.',
    symptom: 'Arranca cansado aunque la batería es nueva',
    level: 2,
    effects: {
      crank: { [NODES.STARTER]: 8.0 },
    },
  },
  {
    id: 'fault-belt-loose',
    name: 'Correa floja',
    componentId: 'belt',
    description: 'La correa patina intermitentemente, causando carga errática del alternador.',
    symptom: 'La luz de la batería parpadea y chilla al acelerar',
    level: 2,
    effects: {
      running: { [NODES.ALT_BPOS]: 13.0, [NODES.BAT_POS]: 13.0, [NODES.MAIN]: 13.0, [NODES.IGN1]: 12.9, [NODES.LAMP]: 12.9 },
    },
  },
  {
    id: 'fault-belt-snapped',
    name: 'Correa rota',
    componentId: 'belt',
    description: 'Sin correa, el alternador no gira. No hay carga. La batería se descarga con el uso.',
    symptom: 'Se encendió la luz de batería y se apagó a los km',
    level: 1,
    effects: {
      running: { [NODES.ALT_BPOS]: 12.3, [NODES.BAT_POS]: 12.3, [NODES.MAIN]: 12.3, [NODES.IGN1]: 12.2, [NODES.LAMP]: 12.2 },
    },
  },
  {
    id: 'fault-alternator-no-charge',
    name: 'Alternador sin carga (diodos)',
    componentId: 'alternator',
    description: 'Diodos rectificadores dañados. El alternador no genera voltaje de carga.',
    symptom: 'La batería se descarga manejando',
    level: 3,
    effects: {
      running: { [NODES.ALT_BPOS]: 12.3, [NODES.BAT_POS]: 12.3, [NODES.MAIN]: 12.3, [NODES.IGN1]: 12.2, [NODES.LAMP]: 12.2 },
    },
  },
  {
    id: 'fault-regulator-high',
    name: 'Regulador alto',
    componentId: 'alternator',
    description: 'El regulador de voltaje falla y permite sobrecarga. Voltaje excesivo en el sistema.',
    symptom: 'Huele raro y los bombillos se queman seguido',
    level: 3,
    effects: {
      running: { [NODES.ALT_BPOS]: 15.6, [NODES.BAT_POS]: 15.6, [NODES.MAIN]: 15.6, [NODES.IGN1]: 15.5, [NODES.LAMP]: 15.5 },
    },
  },
  {
    id: 'fault-ignition-worn',
    name: 'Llave desgastada (START intermitente)',
    componentId: 'ignition-switch',
    description: 'Contacto de START intermitente. A veces no llega voltaje al circuito de arranque.',
    symptom: 'Hay que intentar varias veces para que cranquee',
    level: 3,
    effects: {
      crank: { [NODES.IGN2]: 0, [NODES.RELAY_OUT]: 0, [NODES.SOL]: 0, [NODES.STARTER]: 0 },
    },
  },
];

export function getFaultById(id: string): FaultDefinition | undefined {
  return FAULT_CATALOG.find((f) => f.id === id);
}

export function getFaultsByComponent(componentId: string): FaultDefinition[] {
  return FAULT_CATALOG.filter((f) => f.componentId === componentId);
}
