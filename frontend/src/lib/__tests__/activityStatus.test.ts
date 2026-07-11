import { describe, expect, it } from 'vitest';
import { activityLevel } from '../activityStatus';

const now = new Date('2026-07-10T12:00:00Z');

function daysAgo(days: number): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe('activityLevel', () => {
  it('activo: menos de 3 días', () => {
    expect(activityLevel(daysAgo(1), now)).toBe('active');
    expect(activityLevel(daysAgo(2.9), now)).toBe('active');
  });

  it('en pausa: entre 3 y 7 días', () => {
    expect(activityLevel(daysAgo(3), now)).toBe('idle');
    expect(activityLevel(daysAgo(7), now)).toBe('idle');
  });

  it('inactivo: más de 7 días', () => {
    expect(activityLevel(daysAgo(8), now)).toBe('inactive');
  });

  it('nunca: sin actividad registrada', () => {
    expect(activityLevel(null, now)).toBe('never');
  });
});
