import { describe, expect, it } from 'vitest';
import { findNearestMeasurementPoint } from '../probeSnap';

const points = [
  { id: 'battery-positive', nodeId: 'N-BAT+', componentId: 'battery', x: 220, y: 235 },
  { id: 'battery-negative', nodeId: 'N-BAT-', componentId: 'battery', x: 140, y: 235 },
];

describe('findNearestMeasurementPoint', () => {
  it('encuentra el punto dentro del radio de snap', () => {
    const found = findNearestMeasurementPoint(222, 236, points);
    expect(found?.id).toBe('battery-positive');
  });

  it('devuelve null si no hay ningún punto cerca', () => {
    const found = findNearestMeasurementPoint(900, 900, points);
    expect(found).toBeNull();
  });

  it('elige el más cercano cuando hay varios en rango', () => {
    const closePoints = [
      { id: 'a', nodeId: 'N-A', componentId: 'x', x: 100, y: 100 },
      { id: 'b', nodeId: 'N-B', componentId: 'x', x: 110, y: 100 },
    ];
    const found = findNearestMeasurementPoint(105, 100, closePoints);
    expect(found?.id === 'a' || found?.id === 'b').toBe(true);
    const foundCloserToA = findNearestMeasurementPoint(101, 100, closePoints);
    expect(foundCloserToA?.id).toBe('a');
  });
});
