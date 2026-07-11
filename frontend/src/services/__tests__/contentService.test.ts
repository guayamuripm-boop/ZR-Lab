import { describe, expect, it } from 'vitest';
import { getComponent, getComponents, getLesson, getLessons } from '../contentService';

// Sin backend real disponible en tests: Supabase falla y el servicio debe
// caer automáticamente al espejo JSON (doc 03 ADR-4).
describe('contentService — fallback a JSON local', () => {
  it('getComponents devuelve las 12 piezas', async () => {
    const components = await getComponents();
    expect(components).toHaveLength(12);
  });

  it('getComponent encuentra la batería', async () => {
    const battery = await getComponent('battery');
    expect(battery?.name).toBe('Batería');
  });

  it('getLessons devuelve las 15 lecciones', async () => {
    const lessons = await getLessons();
    expect(lessons).toHaveLength(15);
  });

  it('getLesson encuentra lec-battery', async () => {
    const lesson = await getLesson('lec-battery');
    expect(lesson?.title).toBe('La batería: el corazón eléctrico');
  });
});
