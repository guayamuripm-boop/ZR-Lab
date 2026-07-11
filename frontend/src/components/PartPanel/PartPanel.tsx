import { useEffect, useState } from 'react';
import type { ComponentContent } from '../../content/types';
import { getComponent } from '../../services/contentService';
import { recordDiscovery } from '../../services/progressService';

type TabId = 'que-es' | 'como-funciona' | 'como-se-prueba' | 'cuando-falla';

const TABS: { id: TabId; label: string }[] = [
  { id: 'que-es', label: 'Qué es' },
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'como-se-prueba', label: 'Cómo se prueba' },
  { id: 'cuando-falla', label: 'Cuando falla' },
];

export interface PartPanelProps {
  componentId: string;
  onClose: () => void;
}

export function PartPanel({ componentId, onClose }: PartPanelProps) {
  const [component, setComponent] = useState<ComponentContent | null>(null);
  const [tab, setTab] = useState<TabId>('que-es');

  useEffect(() => {
    setTab('que-es');
    let cancelled = false;
    getComponent(componentId).then((c) => {
      if (!cancelled) setComponent(c ?? null);
    });
    recordDiscovery(componentId);
    return () => {
      cancelled = true;
    };
  }, [componentId]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!component) return null;

  return (
    <div
      className="glass fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-[24px] p-5 md:inset-x-auto md:right-4 md:top-20 md:bottom-4 md:w-[380px] md:max-h-none md:rounded-[20px]"
      role="dialog"
      aria-label={`Ficha de ${component.name}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {component.name}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {component.short_role}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
          style={{ color: 'var(--text-secondary)' }}
        >
          ×
        </button>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors"
            style={{
              background: tab === t.id ? 'var(--accent)' : 'transparent',
              color: tab === t.id ? 'var(--zr-white)' : 'var(--text-secondary)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ color: 'var(--text-primary)', fontFamily: 'Roboto, sans-serif', fontSize: 14, lineHeight: 1.6 }}>
        {tab === 'que-es' && <p>{component.short_role}</p>}
        {tab === 'como-funciona' && <p>{component.full_description}</p>}
        {tab === 'como-se-prueba' && (
          <div>
            <p className="mb-2 font-medium">{component.how_to_test.tool}</p>
            <ol className="list-decimal space-y-1 pl-5">
              {component.how_to_test.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 font-mono text-sm" style={{ color: 'var(--accent)' }}>
              {component.how_to_test.normal_values}
            </p>
          </div>
        )}
        {tab === 'cuando-falla' && (
          <div>
            <p className="mb-1 font-medium">Síntomas</p>
            <ul className="mb-3 list-disc space-y-1 pl-5">
              {component.failure_signs.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <p className="mb-1 font-medium">Causas comunes</p>
            <ul className="list-disc space-y-1 pl-5">
              {component.failure_signs.common_causes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
