import { beforeEach, describe, expect, it } from 'vitest';
import { Multimeter } from '../../../instruments/Multimeter';
import { nodeForMeasurementPoint } from '../../../scene/measurementPoints';
import { useSceneStore } from '../../../stores/useSceneStore';
import { validateMeasure } from '../lessonValidation';

// Reproduce exactamente la cadena de validación que corre el LessonPlayer para
// un paso 'measure', pero sin React ni Konva: sondas del store → resolución de
// nodo → Multimeter+CircuitEngine → validateMeasure. Cubre el camino que el
// arrastre en el canvas no permite verificar en el navegador.
function runMeasureStep(mode: 'V' | 'Ω', expectRange: { min?: number; max?: number }) {
  const { probes, getEngine } = useSceneStore.getState();
  const nodeA = nodeForMeasurementPoint(probes.red);
  const nodeB = nodeForMeasurementPoint(probes.black);
  if (!nodeA || !nodeB) return { passed: false, feedbackKey: null as null | 'reversed' | 'open' };
  const meter = new Multimeter();
  meter.setMode(mode);
  meter.connect({ red: nodeA, black: nodeB });
  return validateMeasure(meter.read(getEngine()), expectRange);
}

describe('LessonPlayer — integración del paso measure', () => {
  beforeEach(() => {
    useSceneStore.setState({
      ignition: 'off',
      engineRunning: false,
      probes: { red: null, black: null },
    });
  });

  it('lec-battery: sondas en los bornes correctos en reposo → aprueba (12.6V ∈ 12.4-12.7)', () => {
    useSceneStore.getState().placeProbe('red', 'battery-positive');
    useSceneStore.getState().placeProbe('black', 'battery-negative');
    const result = runMeasureStep('V', { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(true);
  });

  it('sondas invertidas → no aprueba y marca feedback "reversed"', () => {
    useSceneStore.getState().placeProbe('red', 'battery-negative');
    useSceneStore.getState().placeProbe('black', 'battery-positive');
    const result = runMeasureStep('V', { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(false);
    expect(result.feedbackKey).toBe('reversed');
  });

  it('lec-starter: medir la batería en crank → aprueba (10.5V ∈ 9.6-10.8)', () => {
    useSceneStore.getState().setIgnition('crank');
    useSceneStore.getState().placeProbe('red', 'battery-positive');
    useSceneStore.getState().placeProbe('black', 'battery-negative');
    const result = runMeasureStep('V', { min: 9.6, max: 10.8 });
    expect(result.passed).toBe(true);
  });

  it('lec-fuse: continuidad del fusible sano en Ω → aprueba (~0Ω)', () => {
    useSceneStore.getState().placeProbe('red', 'battery-positive');
    useSceneStore.getState().placeProbe('black', 'main-out');
    const result = runMeasureStep('Ω', { min: 0, max: 0.5 });
    expect(result.passed).toBe(true);
  });

  it('sin sondas colocadas → no aprueba', () => {
    const result = runMeasureStep('V', { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(false);
  });
});
