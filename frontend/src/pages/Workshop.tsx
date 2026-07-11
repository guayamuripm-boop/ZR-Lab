import { IgnitionKey } from '../components/IgnitionKey/IgnitionKey';
import { MultimeterHUD } from '../components/MultimeterHUD/MultimeterHUD';
import { PartPanel } from '../components/PartPanel/PartPanel';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { useWindowSize } from '../hooks/useWindowSize';
import { WorkshopStage } from '../scene/WorkshopStage';
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
        <div className="flex items-center gap-3">
          <ProgressRing progress={discoveredPct} size={40} strokeWidth={4} />
          <ThemeToggle />
        </div>
      </div>

      <IgnitionKey />
      <MultimeterHUD />

      {selectedComponentId ? (
        <PartPanel componentId={selectedComponentId} onClose={() => selectComponent(null)} />
      ) : null}
    </main>
  );
}
