import { describe, expect, it } from 'vitest';
import type { Reading } from '../../../engine/types';
import {
  validateMeasure,
  validateOrder,
  validateQuiz,
  validateToggle,
} from '../lessonValidation';

function reading(value: number): Reading {
  const open = !Number.isFinite(value);
  return {
    value,
    unit: 'V',
    display: open ? 'OL' : `${value.toFixed(1)} V`,
    quality: open ? 'open' : 'normal',
  };
}

describe('validateMeasure', () => {
  it('aprueba cuando la lectura cae en el rango esperado', () => {
    const result = validateMeasure(reading(12.6), { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(true);
    expect(result.feedbackKey).toBeNull();
  });

  it('detecta sondas invertidas (lectura negativa que al invertir cae en rango)', () => {
    const result = validateMeasure(reading(-12.6), { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(false);
    expect(result.feedbackKey).toBe('reversed');
  });

  it('detecta circuito abierto (OL) como feedback open', () => {
    const result = validateMeasure(reading(Infinity), { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(false);
    expect(result.feedbackKey).toBe('open');
  });

  it('no aprueba ni da feedback especial cuando la lectura simplemente no coincide', () => {
    const result = validateMeasure(reading(0), { min: 12.4, max: 12.7 });
    expect(result.passed).toBe(false);
    expect(result.feedbackKey).toBeNull();
  });
});

describe('validateToggle', () => {
  it('valida posición de la llave', () => {
    expect(validateToggle({ ignition: 'crank', engineRunning: false }, { ignition: 'crank' })).toBe(true);
    expect(validateToggle({ ignition: 'on', engineRunning: false }, { ignition: 'crank' })).toBe(false);
  });

  it('valida motor encendido', () => {
    expect(validateToggle({ ignition: 'on', engineRunning: true }, { engineRunning: true })).toBe(true);
    expect(validateToggle({ ignition: 'on', engineRunning: false }, { engineRunning: true })).toBe(false);
  });
});

describe('validateQuiz', () => {
  it('compara el índice seleccionado con la respuesta', () => {
    expect(validateQuiz(0, 0)).toBe(true);
    expect(validateQuiz(2, 0)).toBe(false);
  });
});

describe('validateOrder', () => {
  it('aprueba solo con el orden exacto', () => {
    expect(validateOrder([0, 1, 2], [0, 1, 2])).toBe(true);
    expect(validateOrder([1, 0, 2], [0, 1, 2])).toBe(false);
    expect(validateOrder([0, 1], [0, 1, 2])).toBe(false);
  });
});
