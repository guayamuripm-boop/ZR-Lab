import { getScenario } from './scenarios';
import type { CircuitComponent, CircuitDefinition, CircuitState, FaultSpec, IgnitionPosition, Reading } from './types';

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

  private nodeVoltage(node: string): number {
    const scenario = getScenario(this.ignition, this.engineRunning);
    return scenario.nodeVoltages[node] ?? 0;
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
  }

  clearFaults(): void {
    this.components = new Map(
      this.originalDefinition.components.map((c) => [c.id, { ...c, properties: { ...c.properties } }]),
    );
  }

  getComponentState(id: string): CircuitComponent {
    const component = this.components.get(id);
    if (!component) throw new Error(`Componente desconocido: ${id}`);
    return component;
  }

  isChargeLampOn(): boolean {
    return getScenario(this.ignition, this.engineRunning).chargeLampOn;
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
