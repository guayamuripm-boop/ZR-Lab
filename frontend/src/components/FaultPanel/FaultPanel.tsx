import { useState } from 'react';
import { FAULT_CATALOG, getFaultById } from '../../engine/faultCatalog';
import { useSceneStore } from '../../stores/useSceneStore';

const LEVEL_COLORS: Record<number, string> = {
  1: 'var(--danger)',
  2: 'var(--warning)',
  3: '#a78bfa',
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Básico',
  2: 'Intermedio',
  3: 'Avanzado',
};

interface FaultPanelProps {
  onClose: () => void;
}

export function FaultPanel({ onClose }: FaultPanelProps) {
  const activeFault = useSceneStore((s) => s.activeFault);
  const setActiveFault = useSceneStore((s) => s.setActiveFault);
  const [selectedId, setSelectedId] = useState<string | null>(activeFault?.id ?? null);

  const selected = selectedId ? getFaultById(selectedId) ?? null : null;

  function handleApply() {
    setActiveFault(selected);
    onClose();
  }

  function handleClear() {
    setSelectedId(null);
    setActiveFault(null);
    onClose();
  }

  return (
    <div className="glass fixed inset-x-4 top-16 bottom-4 z-40 overflow-y-auto rounded-[20px] p-5 md:inset-x-auto md:left-4 md:w-[380px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Inyectar falla
        </h2>
        <button type="button" onClick={onClose} aria-label="Cerrar" style={{ color: 'var(--text-secondary)' }}>
          ×
        </button>
      </div>

      <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Selecciona una falla para simularla en el motor. El motor aplicará los efectos de voltaje correspondientes.
      </p>

      {/* Botón limpiar */}
      <button
        type="button"
        onClick={handleClear}
        className="mb-3 w-full rounded-xl px-4 py-2 text-sm font-medium transition-colors"
        style={{
          background: selectedId ? 'var(--glass-surface-2)' : 'color-mix(in srgb, var(--success) 20%, transparent)',
          color: selectedId ? 'var(--text-secondary)' : 'var(--success)',
        }}
      >
        {activeFault ? '⚠️ Limpiar falla activa' : '✓ Sin falla (normal)'}
      </button>

      {/* Lista de fallas */}
      <div className="flex flex-col gap-2">
        {FAULT_CATALOG.map((fault) => {
          const isSelected = selectedId === fault.id;
          const isActive = activeFault?.id === fault.id;
          return (
            <button
              key={fault.id}
              type="button"
              onClick={() => setSelectedId(isSelected ? null : fault.id)}
              className="w-full rounded-xl px-3 py-2.5 text-left transition-colors"
              style={{
                background: isActive
                  ? 'color-mix(in srgb, var(--accent) 20%, transparent)'
                  : isSelected
                    ? 'var(--glass-surface-2)'
                    : 'transparent',
                border: isActive
                  ? '1px solid var(--accent)'
                  : isSelected
                    ? '1px solid var(--text-secondary)'
                    : '1px solid transparent',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: LEVEL_COLORS[fault.level] }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {fault.name}
                </span>
                <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {LEVEL_LABELS[fault.level]}
                </span>
              </div>
              {isSelected ? (
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {fault.description}
                </p>
              ) : null}
              {isSelected ? (
                <p className="mt-1 text-xs italic" style={{ color: LEVEL_COLORS[fault.level] }}>
                  Síntoma: "{fault.symptom}"
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Botón aplicar */}
      <button
        type="button"
        onClick={handleApply}
        disabled={!selected && !activeFault}
        className="mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity"
        style={{
          background: 'var(--accent)',
          color: '#fff',
          opacity: selected || activeFault ? 1 : 0.4,
          cursor: selected || activeFault ? 'pointer' : 'not-allowed',
        }}
      >
        {selected ? 'Aplicar falla' : activeFault ? 'Mantener falla actual' : 'Selecciona una falla'}
      </button>
    </div>
  );
}
