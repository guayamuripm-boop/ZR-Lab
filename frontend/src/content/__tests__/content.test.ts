import { describe, expect, it } from 'vitest';
import components from '../components.json';
import lessons from '../lessons.json';

// Validación exigida por doc 06 Paso 2.1: cada lección 4-8 pasos, cada ficha las 4 secciones.
describe('content/components.json', () => {
  it('tiene las 12 piezas del sistema de arranque y carga', () => {
    expect(components).toHaveLength(12);
  });

  it.each(components.map((c) => [c.id, c]))('%s tiene las 4 secciones del explorador', (_id, component) => {
    expect(component.name).toBeTruthy();
    expect(component.short_role).toBeTruthy();
    expect(component.full_description).toBeTruthy();
    expect(component.how_to_test.steps.length).toBeGreaterThan(0);
    expect(component.failure_signs.symptoms.length).toBeGreaterThan(0);
  });

  it('ids son únicos', () => {
    const ids = components.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('content/lessons.json', () => {
  it('tiene las 15 lecciones (12 + 3 integradoras)', () => {
    expect(lessons).toHaveLength(15);
  });

  it.each(lessons.map((l) => [l.id, l]))('%s tiene entre 4 y 8 pasos', (_id, lesson) => {
    expect(lesson.steps.length).toBeGreaterThanOrEqual(4);
    expect(lesson.steps.length).toBeLessThanOrEqual(8);
  });

  it.each(lessons.map((l) => [l.id, l]))('%s empieza con intro y termina con summary', (_id, lesson) => {
    expect(lesson.steps[0].type).toBe('intro');
    expect(lesson.steps[lesson.steps.length - 1].type).toBe('summary');
  });

  it('ids son únicos y prerequisite_lesson_id referencia una lección existente', () => {
    const ids = new Set(lessons.map((l) => l.id));
    expect(ids.size).toBe(lessons.length);
    for (const lesson of lessons) {
      if (lesson.prerequisite_lesson_id) {
        expect(ids.has(lesson.prerequisite_lesson_id)).toBe(true);
      }
    }
  });

  it('component_id (cuando existe) referencia una pieza real', () => {
    const componentIds = new Set(components.map((c) => c.id));
    for (const lesson of lessons) {
      if (lesson.component_id) {
        expect(componentIds.has(lesson.component_id)).toBe(true);
      }
    }
  });
});
