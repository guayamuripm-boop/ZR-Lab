import type { LessonStep } from '../../content/types';
import type { IgnitionPosition, Reading, Waveform } from '../../engine/types';

export interface MeasureValidation {
  passed: boolean;
  // Clave de wrongFeedback a mostrar cuando la medición es incorrecta pero
  // reconocible (sondas invertidas o circuito abierto). null si simplemente
  // aún no coincide.
  feedbackKey: 'reversed' | 'open' | null;
}

// Valida un paso 'measure' contra la lectura real del engine (doc 03 §7:
// la escena emite el estado, el LessonPlayer valida). No recalcula valores
// eléctricos: solo interpreta la lectura que ya produjo el CircuitEngine.
export function validateMeasure(reading: Reading, expect: { min?: number; max?: number }): MeasureValidation {
  const min = expect.min ?? -Infinity;
  const max = expect.max ?? Infinity;

  if (!Number.isFinite(reading.value)) {
    // OL: circuito abierto. Correcto solo si el rango esperado también es "abierto".
    return { passed: false, feedbackKey: 'open' };
  }

  if (reading.value >= min && reading.value <= max) {
    return { passed: true, feedbackKey: null };
  }

  // Si al invertir las sondas la lectura caería en rango, fueron invertidas.
  const reversed = -reading.value;
  if (reversed >= min && reversed <= max) {
    return { passed: false, feedbackKey: 'reversed' };
  }

  return { passed: false, feedbackKey: null };
}

export function validateToggle(
  state: { ignition: IgnitionPosition; engineRunning: boolean },
  expect: { ignition?: string; engineRunning?: boolean },
): boolean {
  if (expect.engineRunning !== undefined && state.engineRunning !== expect.engineRunning) return false;
  if (expect.ignition !== undefined && state.ignition !== expect.ignition) return false;
  return true;
}

export function validateQuiz(selectedIndex: number, answer: number): boolean {
  return selectedIndex === answer;
}

export function validateOrder(userOrder: number[], answer: number[]): boolean {
  if (userOrder.length !== answer.length) return false;
  return userOrder.every((value, i) => value === answer[i]);
}

export interface ScopeValidation {
  vppOk: boolean;
  vdcOk: boolean;
  rippleOk: boolean;
  passed: boolean;
}

export function validateScope(
  waveform: Waveform,
  expect: { vpp?: { min?: number; max?: number }; vdc?: { min?: number; max?: number }; ripple?: boolean },
): ScopeValidation {
  if (waveform.points.length === 0) {
    return { vppOk: false, vdcOk: false, rippleOk: false, passed: false };
  }
  const values = waveform.points.map((p) => p.v);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const vpp = max - min;
  const vdc = values.reduce((a, b) => a + b, 0) / values.length;

  const vppOk = expect.vpp
    ? vpp >= (expect.vpp.min ?? -Infinity) && vpp <= (expect.vpp.max ?? Infinity)
    : true;
  const vdcOk = expect.vdc
    ? vdc >= (expect.vdc.min ?? -Infinity) && vdc <= (expect.vdc.max ?? Infinity)
    : true;
  const rippleOk = expect.ripple !== undefined ? (vpp > 0.1) === expect.ripple : true;

  return { vppOk, vdcOk, rippleOk, passed: vppOk && vdcOk && rippleOk };
}

// Un paso es "automático" (intro/focus/summary) cuando no requiere una acción
// de validación explícita para avanzar; el estudiante solo pulsa "Siguiente".
export function isAutoAdvanceStep(step: LessonStep): boolean {
  return step.type === 'intro' || step.type === 'focus' || step.type === 'summary';
}
