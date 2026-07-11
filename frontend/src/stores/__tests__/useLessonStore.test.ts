import { beforeEach, describe, expect, it } from 'vitest';
import { useLessonStore } from '../useLessonStore';
import type { LessonContent } from '../../content/types';

const lesson: LessonContent = {
  id: 'lec-test',
  system_id: 'arranque-carga',
  component_id: 'battery',
  title: 'Lección de prueba',
  estimated_minutes: 4,
  order_index: 1,
  prerequisite_lesson_id: null,
  badge_key: 'test-badge',
  steps: [
    { type: 'intro', text: 'a' },
    { type: 'quiz', question: 'q', options: ['x', 'y'], answer: 0 },
    { type: 'summary', text: 'z', badge: 'test-badge' },
  ],
};

describe('useLessonStore', () => {
  beforeEach(() => {
    useLessonStore.setState({
      activeLesson: null,
      currentStepIndex: 0,
      hintVisible: false,
      completedLessonIds: new Set(),
    });
  });

  it('startLesson activa la lección en el paso 0', () => {
    useLessonStore.getState().startLesson(lesson);
    expect(useLessonStore.getState().activeLesson?.id).toBe('lec-test');
    expect(useLessonStore.getState().currentStepIndex).toBe(0);
  });

  it('nextStep avanza pero no se pasa del último paso', () => {
    useLessonStore.getState().startLesson(lesson);
    useLessonStore.getState().nextStep();
    useLessonStore.getState().nextStep();
    expect(useLessonStore.getState().currentStepIndex).toBe(2);
    useLessonStore.getState().nextStep();
    expect(useLessonStore.getState().currentStepIndex).toBe(2);
  });

  it('completeLesson registra la lección como completada', () => {
    useLessonStore.getState().startLesson(lesson);
    useLessonStore.getState().completeLesson();
    expect(useLessonStore.getState().completedLessonIds.has('lec-test')).toBe(true);
  });

  it('endLesson limpia el estado activo', () => {
    useLessonStore.getState().startLesson(lesson);
    useLessonStore.getState().endLesson();
    expect(useLessonStore.getState().activeLesson).toBeNull();
  });

  it('toggleHint alterna la visibilidad de la pista', () => {
    useLessonStore.getState().toggleHint();
    expect(useLessonStore.getState().hintVisible).toBe(true);
    useLessonStore.getState().toggleHint();
    expect(useLessonStore.getState().hintVisible).toBe(false);
  });
});
