import { useEffect, useState } from 'react';
import type { ComponentContent } from '../../content/types';
import { searchPieces } from '../../lib/searchPieces';
import { LAYER_OPTIONS } from '../../scene/subsystems';
import { getComponents } from '../../services/contentService';
import { useSceneStore } from '../../stores/useSceneStore';

// Lista de piezas con buscador (RF-C5) y navegable por teclado: es la vía
// alternativa de acceso a la escena exigida por doc 04 §6 (accesibilidad).
export function PartsList({ onClose }: { onClose: () => void }) {
  const [pieces, setPieces] = useState<ComponentContent[]>([]);
  const [query, setQuery] = useState('');
  const layerView = useSceneStore((s) => s.layerView);
  const setLayerView = useSceneStore((s) => s.setLayerView);
  const selectComponent = useSceneStore((s) => s.selectComponent);
  const discoverComponent = useSceneStore((s) => s.discoverComponent);
  const discoveredIds = useSceneStore((s) => s.discoveredComponentIds);
  const masteredIds = useSceneStore((s) => s.masteredComponentIds);

  useEffect(() => {
    getComponents().then(setPieces);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results = searchPieces(pieces, query, layerView);

  return (
    <div
      className="glass fixed inset-x-4 top-16 bottom-4 z-40 flex flex-col overflow-hidden rounded-[20px] p-5 md:inset-x-auto md:left-4 md:w-[340px]"
      role="dialog"
      aria-label="Lista de piezas"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Piezas
        </h2>
        <button type="button" onClick={onClose} aria-label="Cerrar" style={{ color: 'var(--text-secondary)' }}>
          ×
        </button>
      </div>

      <input
        type="search"
        placeholder="Buscar pieza…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar pieza"
        className="mb-3 w-full rounded-xl px-3 py-2 text-sm"
        style={{
          background: 'var(--glass-surface-2)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-primary)',
        }}
      />

      <div className="mb-3 flex gap-1" role="radiogroup" aria-label="Filtrar por circuito">
        {LAYER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={layerView === opt.value}
            onClick={() => setLayerView(opt.value)}
            className="flex-1 rounded-full py-1 text-xs"
            style={{
              background: layerView === opt.value ? 'var(--accent)' : 'var(--glass-surface-2)',
              color: layerView === opt.value ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ul className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {results.map((piece) => {
          const mastered = masteredIds.has(piece.id);
          const seen = discoveredIds.has(piece.id);
          return (
            <li key={piece.id}>
              <button
                type="button"
                onClick={() => {
                  selectComponent(piece.id);
                  discoverComponent(piece.id);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                style={{
                  background: 'var(--glass-surface-2)',
                  color: 'var(--text-primary)',
                  border: mastered ? '1px solid var(--gold)' : '1px solid transparent',
                }}
              >
                <span aria-hidden="true">{mastered ? '🏅' : seen ? '👁️' : '❔'}</span>
                <span className="flex-1">
                  {piece.name}
                  <span className="block text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {piece.short_role}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {results.length === 0 ? (
          <li className="py-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ninguna pieza coincide con la búsqueda.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
