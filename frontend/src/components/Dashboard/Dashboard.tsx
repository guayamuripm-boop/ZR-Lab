import { useEffect, useMemo, useState } from 'react';
import type { LessonContent } from '../../content/types';
import { getLessons } from '../../services/contentService';
import { GlassButton } from '../ui/GlassButton';
import { BadgeCard } from '../ui/BadgeCard';
import { ProgressRing } from '../ui/ProgressRing';
import { ThemeToggle } from '../ThemeToggle';
import { navigate } from '../../hooks/usePathname';
import { useLessonStore } from '../../stores/useLessonStore';
import { useSceneStore } from '../../stores/useSceneStore';

const TOTAL_COMPONENTS = 12;

const BADGE_ICONS: Record<string, string> = {
  'primera-visita': '🚪',
  'battery-master': '🔋',
  'buen-contacto': '🔗',
  'tierra-firme': '🌍',
  guardian: '🛡️',
  llavero: '🔑',
  'clic-perfecto': '⚡',
  'empuje-justo': '💪',
  'primera-chispa': '⭐',
  'tension-justa': '🎯',
  generador: '🔌',
  'ojo-de-aguila': '🦅',
  'circuito-completo': '🔄',
  'anatomia-del-arranque': '🔧',
  'tecnico-en-formacion': '🎓',
};

export function Dashboard() {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const discoveredComponentIds = useSceneStore((s) => s.discoveredComponentIds);
  const completedLessonIds = useLessonStore((s) => s.completedLessonIds);
  const startLesson = useLessonStore((s) => s.startLesson);

  useEffect(() => {
    getLessons().then(setLessons);
  }, []);

  const discoveredPct = Math.round((discoveredComponentIds.size / TOTAL_COMPONENTS) * 100);
  const lessonsPct = lessons.length ? Math.round((completedLessonIds.size / lessons.length) * 100) : 0;

  const nextLesson = useMemo(
    () => lessons.find((l) => !completedLessonIds.has(l.id)),
    [lessons, completedLessonIds],
  );

  const earnedBadges = useMemo(
    () =>
      lessons
        .filter((l) => completedLessonIds.has(l.id))
        .map((l) => l.badge_key)
        .filter(Boolean),
    [lessons, completedLessonIds],
  );

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Mi Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <GlassButton variant="secondary" onClick={() => navigate('/taller')}>
            Ir al taller
          </GlassButton>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass flex flex-col items-center gap-3 p-6">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Progreso general
          </h2>
          <ProgressRing progress={lessonsPct} size={120} label="Lecciones" />
          <ProgressRing progress={discoveredPct} size={80} label="Piezas" />
        </div>

        <div className="glass flex flex-col justify-between gap-4 p-6 md:col-span-2">
          <div>
            <h2 className="mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {nextLesson ? 'Continuar donde quedé' : '¡Completaste todas las lecciones!'}
            </h2>
            {nextLesson ? (
              <p className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                {nextLesson.title}
              </p>
            ) : (
              <p style={{ color: 'var(--success)' }}>Técnico en formación 🎓</p>
            )}
          </div>
          {nextLesson ? (
            <GlassButton
              variant="primary"
              onClick={() => {
                startLesson(nextLesson);
                navigate('/taller');
              }}
            >
              Continuar lección
            </GlassButton>
          ) : null}
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Insignias ({earnedBadges.length}/{lessons.length})
        </h2>
        <div className="flex flex-wrap gap-3">
          {lessons.map((lesson) => (
            <BadgeCard
              key={lesson.id}
              name={lesson.title.replace(/^🔗\s*Integradora:\s*/, '')}
              icon={BADGE_ICONS[lesson.badge_key] ?? '🔧'}
              earned={completedLessonIds.has(lesson.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
