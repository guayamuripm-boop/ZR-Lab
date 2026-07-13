import { useState } from 'react';
import { GuestBanner } from '../components/GuestBanner/GuestBanner';
import { IgnitionKey } from '../components/IgnitionKey/IgnitionKey';
import { LessonCelebration } from '../components/LessonPlayer/LessonCelebration';
import { LessonPicker } from '../components/LessonPlayer/LessonPicker';
import { LessonPlayer } from '../components/LessonPlayer/LessonPlayer';
import { MultimeterHUD } from '../components/MultimeterHUD/MultimeterHUD';
import { OnboardingTour } from '../components/OnboardingTour/OnboardingTour';
import { hasSeenOnboarding } from '../components/OnboardingTour/onboardingState';
import { OrientationHint } from '../components/OrientationHint/OrientationHint';
import { PartPanel } from '../components/PartPanel/PartPanel';
import { PartsList } from '../components/PartsList/PartsList';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ThemeToggle } from '../components/ThemeToggle';
import { navigate } from '../hooks/usePathname';
import { useTheme } from '../hooks/useTheme';
import { useWindowSize } from '../hooks/useWindowSize';
import { LAYER_OPTIONS } from '../scene/subsystems';
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
  const layerView = useSceneStore((s) => s.layerView);
  const setLayerView = useSceneStore((s) => s.setLayerView);

  const activeLesson = useLessonStore((s) => s.activeLesson);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [partsOpen, setPartsOpen] = useState(false);
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
        theme={theme}
        accentColor={ACCENT_BY_THEME[theme]}
        discoveredIds={discoveredComponentIds}
        masteredIds={masteredComponentIds}
        onComponentClick={handleComponentClick}
      />

      <div className="glass fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-2">
        <span className="hidden font-display text-sm md:inline md:text-base" style={{ color: 'var(--text-primary)' }}>
          Sistema: Arranque y Carga
        </span>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => {
              setPartsOpen((v) => !v);
              setPickerOpen(false);
            }}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
          >
            Piezas
          </button>
          <button
            type="button"
            onClick={() => {
              setPickerOpen((v) => !v);
              setPartsOpen(false);
            }}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
          >
            Lecciones
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="hidden rounded-full px-3 py-1.5 text-sm md:inline"
            style={{ color: 'var(--text-secondary)' }}
          >
            Mi progreso
          </button>
          <ProgressRing progress={discoveredPct} size={40} strokeWidth={4} />
          <ThemeToggle />
        </div>
      </div>

      {/* Vista por capas (RF-B4): atenúa las piezas fuera del subcircuito elegido */}
      <div
        className="glass fixed bottom-24 left-4 z-20 flex flex-col gap-1 p-2 md:bottom-auto md:top-64"
        role="radiogroup"
        aria-label="Vista por capas"
      >
        {LAYER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={layerView === opt.value}
            onClick={() => setLayerView(opt.value)}
            className="rounded-full px-3 py-1 text-xs"
            style={{
              background: layerView === opt.value ? 'var(--accent)' : 'transparent',
              color: layerView === opt.value ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <IgnitionKey />
      <MultimeterHUD raised={!!activeLesson} />
      <OrientationHint />

      {selectedComponentId ? (
        <PartPanel componentId={selectedComponentId} onClose={() => selectComponent(null)} />
      ) : null}

      {partsOpen ? <PartsList onClose={() => setPartsOpen(false)} /> : null}
      {pickerOpen ? <LessonPicker onClose={() => setPickerOpen(false)} /> : null}
      {activeLesson ? <LessonPlayer /> : null}
      {showTour ? <OnboardingTour onFinish={() => setShowTour(false)} /> : null}
      <LessonCelebration />
      <GuestBanner />
    </main>
  );
}
