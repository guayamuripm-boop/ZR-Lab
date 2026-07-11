import { useState } from 'react';
import { GuestBanner } from '../components/GuestBanner/GuestBanner';
import { IgnitionKey } from '../components/IgnitionKey/IgnitionKey';
import { LessonPicker } from '../components/LessonPlayer/LessonPicker';
import { LessonPlayer } from '../components/LessonPlayer/LessonPlayer';
import { MultimeterHUD } from '../components/MultimeterHUD/MultimeterHUD';
import { OnboardingTour } from '../components/OnboardingTour/OnboardingTour';
import { hasSeenOnboarding } from '../components/OnboardingTour/onboardingState';
import { PartPanel } from '../components/PartPanel/PartPanel';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ThemeToggle } from '../components/ThemeToggle';
import { navigate } from '../hooks/usePathname';
import { useTheme } from '../hooks/useTheme';
import { useWindowSize } from '../hooks/useWindowSize';
import { WorkshopStage } from '../scene/WorkshopStage';
import { useLessonStore } from '../stores/useLessonStore';
import { useSceneStore } from '../stores/useSceneStore';

const TOTAL_COMPONENTS = 12;
const ACCENT_BY_THEME = { dark: '#6590CB', light: '#1E4D96' } as const;

export function Workshop() {
  const { theme } = useTheme();
  const { width, height } = useWindowSize();
  const selectedComponentId = useSceneStore((s) => s.selectedComponentId);
  const selectComponent = useSceneStore((s) => s.selectComponent);
  const discoveredComponentIds = useSceneStore((s) => s.discoveredComponentIds);
  const masteredComponentIds = useSceneStore((s) => s.masteredComponentIds);
  const discoverComponent = useSceneStore((s) => s.discoverComponent);

  const activeLesson = useLessonStore((s) => s.activeLesson);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showTour, setShowTour] = useState(() => !hasSeenOnboarding());

  function handleComponentClick(id: string) {
    selectComponent(id);
    discoverComponent(id);
  }

  const discoveredPct = Math.round((discoveredComponentIds.size / TOTAL_COMPONENTS) * 100);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <WorkshopStage
        width={width}
        height={height}
        accentColor={ACCENT_BY_THEME[theme]}
        discoveredIds={discoveredComponentIds}
        masteredIds={masteredComponentIds}
        onComponentClick={handleComponentClick}
      />

      <div className="glass fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-2">
        <span className="font-display text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>
          Sistema: Arranque y Carga
        </span>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
          >
            Lecciones
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Mi progreso
          </button>
          <ProgressRing progress={discoveredPct} size={40} strokeWidth={4} />
          <ThemeToggle />
        </div>
      </div>

      <IgnitionKey />
      <MultimeterHUD raised={!!activeLesson} />

      {selectedComponentId ? (
        <PartPanel componentId={selectedComponentId} onClose={() => selectComponent(null)} />
      ) : null}

      {pickerOpen ? <LessonPicker onClose={() => setPickerOpen(false)} /> : null}
      {activeLesson ? <LessonPlayer /> : null}
      {showTour ? <OnboardingTour onFinish={() => setShowTour(false)} /> : null}
      <GuestBanner />
    </main>
  );
}
