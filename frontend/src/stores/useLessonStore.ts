import { create } from 'zustand';
import type { LessonContent } from '../content/types';

interface LessonState {
  activeLesson: LessonContent | null;
  currentStepIndex: number;
  hintVisible: boolean;
  completedLessonIds: Set<string>;

  startLesson: (lesson: LessonContent) => void;
  nextStep: () => void;
  toggleHint: () => void;
  completeLesson: () => void;
  endLesson: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  activeLesson: null,
  currentStepIndex: 0,
  hintVisible: false,
  completedLessonIds: new Set(),

  startLesson: (lesson) => set({ activeLesson: lesson, currentStepIndex: 0, hintVisible: false }),

  nextStep: () => {
    const { activeLesson, currentStepIndex } = get();
    if (!activeLesson) return;
    const next = currentStepIndex + 1;
    if (next >= activeLesson.steps.length) return;
    set({ currentStepIndex: next, hintVisible: false });
  },

  toggleHint: () => set((state) => ({ hintVisible: !state.hintVisible })),

  completeLesson: () => {
    const { activeLesson } = get();
    if (!activeLesson) return;
    set((state) => ({
      completedLessonIds: new Set(state.completedLessonIds).add(activeLesson.id),
    }));
  },

  endLesson: () => set({ activeLesson: null, currentStepIndex: 0, hintVisible: false }),
}));
