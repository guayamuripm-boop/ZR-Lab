import { useEffect, useState } from 'react';
import type { LessonContent } from '../../content/types';
import { getLessons } from '../../services/contentService';
import { useLessonStore } from '../../stores/useLessonStore';

export function LessonPicker({ onClose }: { onClose: () => void }) {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const completedLessonIds = useLessonStore((s) => s.completedLessonIds);
  const startLesson = useLessonStore((s) => s.startLesson);

  useEffect(() => {
    getLessons().then(setLessons);
  }, []);

  // Desbloqueo secuencial (RF-D5): una lección se habilita cuando su
  // prerequisito está completado (o si no tiene prerequisito).
  function isUnlocked(lesson: LessonContent): boolean {
    if (!lesson.prerequisite_lesson_id) return true;
    return completedLessonIds.has(lesson.prerequisite_lesson_id);
  }

  return (
    <div className="glass fixed inset-x-4 top-16 bottom-4 z-40 overflow-y-auto rounded-[20px] p-5 md:inset-x-auto md:left-4 md:w-[380px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Lecciones
        </h2>
        <button type="button" onClick={onClose} aria-label="Cerrar" style={{ color: 'var(--text-secondary)' }}>
          ×
        </button>
      </div>

      <ol className="flex flex-col gap-2">
        {lessons.map((lesson) => {
          const unlocked = isUnlocked(lesson);
          const done = completedLessonIds.has(lesson.id);
          return (
            <li key={lesson.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => {
                  startLesson(lesson);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                style={{
                  background: done ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'var(--glass-surface-2)',
                  color: unlocked ? 'var(--text-primary)' : 'var(--text-secondary)',
                  opacity: unlocked ? 1 : 0.5,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                }}
              >
                <span aria-hidden="true">{done ? '✅' : unlocked ? '▶️' : '🔒'}</span>
                <span className="flex-1 text-sm">{lesson.title}</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {lesson.estimated_minutes} min
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
