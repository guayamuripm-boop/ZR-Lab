export type ComponentType =
  | 'battery'
  | 'starter_motor'
  | 'alternator'
  | 'ignition_switch'
  | 'starter_relay'
  | 'fuse'
  | 'wire'
  | 'ground'
  | 'belt'
  | 'battery_terminal'
  | 'solenoid'
  | 'warning_lamp';

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  nodes: string[];
  properties: {
    voltage?: number;
    resistance: number;
    maxCurrent?: number;
    [key: string]: unknown;
  };
  state: 'ok' | 'degraded' | 'failed';
}

export type IgnitionPosition = 'off' | 'on' | 'crank';

export interface CircuitState {
  ignition: IgnitionPosition;
  engineRunning: boolean;
  nodeVoltages: Map<string, number>;
}

export interface Reading {
  value: number;
  unit: 'V' | 'Ω' | 'A';
  display: string;
  quality: 'normal' | 'low' | 'high' | 'open';
}

export interface CircuitDefinition {
  components: CircuitComponent[];
}

/** Modificaciones de voltaje por nodo y escenario al aplicar una falla. */
export interface FaultVoltageEffects {
  off?: Record<string, number>;
  on?: Record<string, number>;
  crank?: Record<string, number>;
  running?: Record<string, number>;
}

export interface FaultSpec {
  forceOpen?: boolean;
  voltageEffects?: FaultVoltageEffects;
  componentState?: 'degraded' | 'failed';
}

/** Una falla del catálogo (doc 08 §5). */
export interface FaultDefinition {
  id: string;
  name: string;
  componentId: string;
  description: string;
  symptom: string;
  level: 1 | 2 | 3;
  effects: FaultVoltageEffects;
  forceOpen?: boolean;
}
