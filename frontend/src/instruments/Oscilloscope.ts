import type { CircuitEngine } from '../engine/CircuitEngine';
import type { Reading, Waveform, WaveformPoint } from '../engine/types';

/**
 * Osciloscopio virtual (capa 3, TypeScript puro).
 * Implementa la interfaz VirtualInstrument del doc 03 §3.4.
 * Captura formas de onda de nodos del circuito.
 */
export interface ProbePlacement {
  node: string;
}

export class Oscilloscope {
  readonly id = 'oscilloscope' as const;
  private connected = false;
  private probe: ProbePlacement | null = null;

  connect(probes: ProbePlacement): void {
    this.connected = true;
    this.probe = probes;
  }

  disconnect(): void {
    this.connected = false;
    this.probe = null;
  }

  /**
   * Captura la forma de onda del nodo conectado.
   * Devuelve un Waveform con los puntos muestreados por el engine.
   */
  capture(engine: CircuitEngine): Waveform {
    if (!this.connected || !this.probe) {
      return { node: '', points: [], timebaseMs: 0, scaleV: 0 };
    }
    return engine.getSignalAt(this.probe.node);
  }

  /**
   * Calcula el voltaje pico de la forma de onda.
   */
  getVpp(waveform: Waveform): Reading {
    if (waveform.points.length === 0) {
      return { value: 0, unit: 'V', display: '0.0 V', quality: 'normal' };
    }
    const values = waveform.points.map((p: WaveformPoint) => p.v);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const vpp = Math.round((max - min) * 100) / 100;
    return {
      value: vpp,
      unit: 'V',
      display: `${vpp.toFixed(2)} V`,
      quality: 'normal',
    };
  }

  /**
   * Calcula el voltaje DC promedio de la forma de onda.
   */
  getVdc(waveform: Waveform): Reading {
    if (waveform.points.length === 0) {
      return { value: 0, unit: 'V', display: '0.0 V', quality: 'normal' };
    }
    const sum = waveform.points.reduce((acc: number, p: WaveformPoint) => acc + p.v, 0);
    const avg = Math.round((sum / waveform.points.length) * 100) / 100;
    return {
      value: avg,
      unit: 'V',
      display: `${avg.toFixed(1)} V`,
      quality: 'normal',
    };
  }

  /**
   * Detecta si hay rizado significativo (>0.1V p-p) en la forma de onda.
   */
  hasRipple(waveform: Waveform): boolean {
    const vpp = this.getVpp(waveform);
    return vpp.value > 0.1;
  }
}
