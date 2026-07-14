import { NODES } from './circuitDefinition';
import { getScenario } from './scenarios';
import type { CircuitComponent, CircuitDefinition, CircuitState, FaultSpec, FaultVoltageEffects, IgnitionPosition, Reading } from './types';

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
}
