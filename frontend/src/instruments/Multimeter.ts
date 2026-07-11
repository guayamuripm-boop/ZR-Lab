import type { CircuitEngine } from '../engine/CircuitEngine';
import type { Reading } from '../engine/types';

export type MultimeterMode = 'V' | 'Ω';

export interface ProbePlacement {
  red: string;
  black: string;
}

export interface VirtualInstrument {
  readonly id: 'multimeter' | 'oscilloscope' | 'obd_scanner';
  connect(probes: ProbePlacement): void;
  read(engine: CircuitEngine): Reading;
  disconnect(): void;
}

export class Multimeter implements VirtualInstrument {
  readonly id = 'multimeter';
  private probes: ProbePlacement | null = null;
  private mode: MultimeterMode = 'V';

  setMode(mode: MultimeterMode): void {
    this.mode = mode;
  }

  getMode(): MultimeterMode {
    return this.mode;
  }

  connect(probes: ProbePlacement): void {
    this.probes = probes;
  }

  disconnect(): void {
    this.probes = null;
  }

  read(engine: CircuitEngine): Reading {
    if (!this.probes) {
      throw new Error('Multímetro sin sondas conectadas.');
    }
    const { red, black } = this.probes;
    return this.mode === 'V'
      ? engine.getVoltageBetween(red, black)
      : engine.getResistanceBetween(red, black);
  }
}
