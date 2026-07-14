import { NODES } from './circuitDefinition';
import { getScenario } from './scenarios';
import type { CircuitComponent, CircuitDefinition, CircuitState, FaultSpec, FaultVoltageEffects, IgnitionPosition, Reading, Waveform, WaveformPoint } from './types';

function formatVoltage(value: number): string {
  return `${value.toFixed(1)} V`;
}

function formatResistance(value: number): string {
  if (!Number.isFinite(value)) return 'OL';
  return `${value.toFixed(1)} Ω`;
}

export class CircuitEngine {
  private components: Map<string, CircuitComponent>;
  private readonly originalDefinition: CircuitDefinition;
  private ignition: IgnitionPosition = 'off';
  private engineRunning = false;
  private activeFaultEffects: FaultVoltageEffects = {};

  constructor(definition: CircuitDefinition) {
    this.originalDefinition = definition;
    this.components = new Map(
      definition.components.map((c) => [c.id, { ...c, properties: { ...c.properties } }]),
    );
  }

  setIgnition(pos: IgnitionPosition): void {
    this.ignition = pos;
    if (pos === 'crank') this.engineRunning = false;
  }

  setEngineRunning(running: boolean): void {
    this.engineRunning = running;
    if (running) this.ignition = 'on';
  }

  private getScenarioKey(): keyof FaultVoltageEffects {
    if (this.engineRunning) return 'running';
    return this.ignition;
  }

  private nodeVoltage(node: string): number {
    const scenario = getScenario(this.ignition, this.engineRunning);
    let voltage = scenario.nodeVoltages[node] ?? 0;

    // Aplicar efectos de falla activa sobre el escenario base
    const faultOverrides = this.activeFaultEffects[this.getScenarioKey()];
    if (faultOverrides && node in faultOverrides) {
      voltage = faultOverrides[node];
    }

    return voltage;
  }

  getVoltageBetween(nodeA: string, nodeB: string): Reading {
    const value = this.nodeVoltage(nodeA) - this.nodeVoltage(nodeB);
    const rounded = Math.round(value * 100) / 100;
    return {
      value: rounded,
      unit: 'V',
      display: formatVoltage(rounded),
      quality: 'normal',
    };
  }

  private findComponentByNodes(nodeA: string, nodeB: string): CircuitComponent | undefined {
    for (const component of this.components.values()) {
      const nodes = component.nodes;
      if (nodes.length === 2 && nodes.includes(nodeA) && nodes.includes(nodeB)) {
        return component;
      }
    }
    return undefined;
  }

  getResistanceBetween(nodeA: string, nodeB: string): Reading {
    const component = this.findComponentByNodes(nodeA, nodeB);
    const value = component ? component.properties.resistance : Infinity;
    const open = !Number.isFinite(value);
    return {
      value: open ? Infinity : value,
      unit: 'Ω',
      display: formatResistance(value),
      quality: open ? 'open' : 'normal',
    };
  }

  applyFault(componentId: string, fault: FaultSpec): void {
    const component = this.components.get(componentId);
    if (!component) throw new Error(`Componente desconocido: ${componentId}`);

    if (fault.forceOpen) {
      component.properties.resistance = Infinity;
      component.state = 'failed';
    }

    if (fault.componentState) {
      component.state = fault.componentState;
    }

    if (fault.voltageEffects) {
      this.activeFaultEffects = fault.voltageEffects;
    }
  }

  clearFaults(): void {
    this.components = new Map(
      this.originalDefinition.components.map((c) => [c.id, { ...c, properties: { ...c.properties } }]),
    );
    this.activeFaultEffects = {};
  }

  getComponentState(id: string): CircuitComponent {
    const component = this.components.get(id);
    if (!component) throw new Error(`Componente desconocido: ${id}`);
    return component;
  }

  isChargeLampOn(): boolean {
    const base = getScenario(this.ignition, this.engineRunning).chargeLampOn;
    // Con motor encendido: si el alternador carga normal (>13.5V), la lámpara se apaga.
    // Si hay falla de carga (correa rota, diodos, etc.), el voltaje del alternador baja
    // y la lámpara debe encenderse para alertar al estudiante.
    if (this.engineRunning) {
      const altVoltage = this.nodeVoltage(NODES.ALT_BPOS);
      return altVoltage < 13.5;
    }
    return base;
  }

  snapshot(): CircuitState {
    const scenario = getScenario(this.ignition, this.engineRunning);
    return {
      ignition: this.ignition,
      engineRunning: this.engineRunning,
      nodeVoltages: new Map(Object.entries(scenario.nodeVoltages)),
    };
  }

  /**
   * Genera una forma de onda para el nodo indicado (doc 03 §3.4).
   * Devuelve un array de puntos (t, v) que representan la señal eléctrica
   * que vería un osciloscopio real conectado a ese nodo.
   */
  getSignalAt(node: string): Waveform {
    const baseVoltage = this.nodeVoltage(node);
    const timebaseMs = 20;   // 20ms de ventana (1 ciclo de 50Hz completo)
    const sampleCount = 200; // 200 puntos por captura
    const points: WaveformPoint[] = [];

    if (this.engineRunning && node === NODES.ALT_BPOS) {
      // Alternador: rizado de onda rectificada solo si el alternador está sano.
      // Con falla de correa/alternador → DC plano (no genera rizado real).
      const altState = this.components.get('alternator')?.state ?? 'ok';
      const beltState = this.components.get('belt')?.state ?? 'ok';
      const hasRipple = altState === 'ok' && beltState === 'ok';
      if (hasRipple) {
        // Amplitud del rizado: ~0.3V p-p sobre el nivel DC
        const dcOffset = baseVoltage;
        const rippleAmplitude = 0.3;
        const frequencyHz = 300;
        for (let i = 0; i < sampleCount; i++) {
          const t = (i / sampleCount) * timebaseMs;
          const phase = (t / 1000) * frequencyHz * 2 * Math.PI;
          const ripple = rippleAmplitude * Math.abs(Math.sin(phase));
          points.push({ t: Math.round(t * 10) / 10, v: Math.round((dcOffset + ripple - rippleAmplitude / 2) * 100) / 100 });
        }
      } else {
        for (let i = 0; i < sampleCount; i++) {
          const t = (i / sampleCount) * timebaseMs;
          points.push({ t: Math.round(t * 10) / 10, v: baseVoltage });
        }
      }
    } else if (this.ignition === 'crank' && node === NODES.SOL) {
      // Solenoide: pulso de subida con sobreimpulso inductivo al energizar
      for (let i = 0; i < sampleCount; i++) {
        const t = (i / sampleCount) * timebaseMs;
        let v = baseVoltage;
        if (t < 2) {
          // Subida exponencial (constante de tiempo del solenoide ~1ms)
          v = baseVoltage * (1 - Math.exp(-t / 1));
        } else if (t < 3) {
          // Sobreimpulso inductivo
          v = baseVoltage * 1.15 * Math.exp(-(t - 2) / 0.5);
        } else {
          v = baseVoltage;
        }
        points.push({ t: Math.round(t * 10) / 10, v: Math.round(v * 100) / 100 });
      }
    } else if (this.ignition === 'crank' && node === NODES.IGN2) {
      // Señal de START: pulso cuadrado durante crank
      for (let i = 0; i < sampleCount; i++) {
        const t = (i / sampleCount) * timebaseMs;
        points.push({ t: Math.round(t * 10) / 10, v: t >= 1 && t <= 18 ? baseVoltage : 0 });
      }
    } else if (this.engineRunning && node === NODES.BAT_POS) {
      // Batería con motor encendido: DC con ripple mínimo del alternador
      for (let i = 0; i < sampleCount; i++) {
        const t = (i / sampleCount) * timebaseMs;
        const noise = 0.05 * Math.sin((t / 1000) * 60 * 2 * Math.PI);
        points.push({ t: Math.round(t * 10) / 10, v: Math.round((baseVoltage + noise) * 100) / 100 });
      }
    } else {
      // DC plano (reposo, llave ON sin crank, nodos que no cambian)
      for (let i = 0; i < sampleCount; i++) {
        const t = (i / sampleCount) * timebaseMs;
        points.push({ t: Math.round(t * 10) / 10, v: baseVoltage });
      }
    }

    return { node, points, timebaseMs, scaleV: Math.ceil(baseVoltage * 1.3 / 5) * 5 };
  }
}
