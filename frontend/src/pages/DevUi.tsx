import { useState } from 'react';
import { BadgeCard } from '../components/ui/BadgeCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassPanel } from '../components/ui/GlassPanel';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Toast } from '../components/ui/Toast';
import { ThemeToggle } from '../components/ThemeToggle';

export function DevUi() {
  const [showToast, setShowToast] = useState(false);

  return (
    <main style={{ padding: 32, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="font-display" style={{ color: 'var(--text-primary)', fontSize: 28 }}>
          /dev/ui — kit glass ZR
        </h1>
        <ThemeToggle />
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>GlassPanel (3 elevaciones)</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <GlassPanel elevation="hud" style={{ padding: 16, width: 200 }}>
            <span style={{ color: 'var(--text-primary)' }}>hud (blur 12)</span>
          </GlassPanel>
          <GlassPanel elevation="panel" style={{ padding: 16, width: 200 }}>
            <span style={{ color: 'var(--text-primary)' }}>panel (blur 18)</span>
          </GlassPanel>
          <GlassPanel elevation="modal" style={{ padding: 16, width: 200 }}>
            <span style={{ color: 'var(--text-primary)' }}>modal (blur 24)</span>
          </GlassPanel>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>GlassButton (3 variantes)</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <GlassButton variant="primary">Continuar lección</GlassButton>
          <GlassButton variant="secondary">Ver ficha</GlassButton>
          <GlassButton variant="ghost">Cancelar</GlassButton>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>ProgressRing</h2>
        <div style={{ display: 'flex', gap: 24 }}>
          <ProgressRing progress={25} label="Piezas" />
          <ProgressRing progress={60} label="Lecciones" />
          <ProgressRing progress={100} label="Sistema" />
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>BadgeCard</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <BadgeCard name="Primera Visita" icon="🚪" earned />
          <BadgeCard name="Corazón Cargado" icon="🔋" earned />
          <BadgeCard name="Primera Chispa" icon="⚡" />
          <BadgeCard name="Técnico en Formación" icon="🎓" />
        </div>
      </section>

      <section>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Toast</h2>
        <GlassButton variant="secondary" onClick={() => setShowToast(true)}>
          Mostrar toast de éxito
        </GlassButton>
        {showToast && (
          <Toast message="¡Bien ahí! Medición perfecta." variant="success" onDismiss={() => setShowToast(false)} />
        )}
      </section>
    </main>
  );
}
