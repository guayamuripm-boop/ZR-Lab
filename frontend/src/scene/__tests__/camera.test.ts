import { describe, expect, it } from 'vitest';
import { clampZoom, decayVelocity, isVelocityNegligible, zoomAtPoint, MIN_ZOOM, MAX_ZOOM } from '../camera';

describe('clampZoom', () => {
  it('respeta el límite mínimo 0.5x', () => {
    expect(clampZoom(0.1)).toBe(MIN_ZOOM);
  });
  it('respeta el límite máximo 2.5x', () => {
    expect(clampZoom(5)).toBe(MAX_ZOOM);
  });
  it('deja pasar valores dentro del rango', () => {
    expect(clampZoom(1.2)).toBe(1.2);
  });
});

describe('zoomAtPoint', () => {
  it('mantiene el punto bajo el cursor fijo al hacer zoom in', () => {
    const camera = { x: 0, y: 0, zoom: 1 };
    const pointer = { x: 100, y: 100 };
    const result = zoomAtPoint(camera, pointer, 0.5);
    expect(result.zoom).toBe(1.5);
    // El punto (100,100) en coordenadas de pantalla debe seguir mapeando
    // al mismo punto de la escena antes y después del zoom.
    const sceneXBefore = (pointer.x - camera.x) / camera.zoom;
    const sceneXAfter = (pointer.x - result.x) / result.zoom;
    expect(sceneXAfter).toBeCloseTo(sceneXBefore, 5);
  });

  it('no excede MAX_ZOOM aunque el delta sea grande', () => {
    const result = zoomAtPoint({ x: 0, y: 0, zoom: 2 }, { x: 0, y: 0 }, 5);
    expect(result.zoom).toBe(MAX_ZOOM);
  });
});

describe('inercia de paneo', () => {
  it('decayVelocity reduce la velocidad con fricción', () => {
    const v = decayVelocity({ x: 10, y: -10 }, 0.9);
    expect(v.x).toBeCloseTo(9);
    expect(v.y).toBeCloseTo(-9);
  });

  it('isVelocityNegligible detecta cuando la inercia debe detenerse', () => {
    expect(isVelocityNegligible({ x: 0.1, y: 0.1 })).toBe(true);
    expect(isVelocityNegligible({ x: 5, y: 0 })).toBe(false);
  });
});
