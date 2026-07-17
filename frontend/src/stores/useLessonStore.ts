import { create } from 'zustand';
import type { LessonContent } from '../content/types';

const STORAGE_KEY = 'zr-lab-lessons';

function loadCompletedIds(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const arr = JSON.parse(stored) as string[];
      return new Set(arr);
    }
  } catch {
    // corrupted storage, start fresh
  }
  return new Set();
}

function saveCompletedIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // storage full or unavailable
  }
}

export interface LessonCelebration {
  lessonTitle: string;
  badgeKey: string;
}

interface LessonState {
  activeLesson: LessonContent | null;
  currentStepIndex: number;
  hintVisible: boolean;
  completedLessonIds: Set<string>;
  celebration: LessonCelebration | null;

  startLesson: (lesson: LessonContent) => void;
  nextStep: () => void;
  toggleHint: () => void;
  completeLesson: () => void;
  clearCelebration: () => void;
  endLesson: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  activeLesson: null,
  currentStepIndex: 0,
  hintVisible: false,
  completedLessonIds: loadCompletedIds(),
  celebration: null,

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
    const newIds = new Set(get().completedLessonIds).add(activeLesson.id);
    saveCompletedIds(newIds);
    set({
      completedLessonIds: newIds,
      celebration: { lessonTitle: activeLesson.title, badgeKey: activeLesson.badge_key },
    });
  },

  clearCelebration: () => set({ celebration: null }),

  endLesson: () => set({ activeLesson: null, currentStepIndex: 0, hintVisible: false }),
}));
