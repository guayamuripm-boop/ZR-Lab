export type ActivityLevel = 'active' | 'idle' | 'inactive' | 'never';

// Semáforo de actividad de un estudiante (doc 09 Parte II §3):
// 🟢 activo esta semana · 🟡 sin actividad 3-7 días · 🔴 más de 7 días.
export function activityLevel(lastActivity: string | null, now: Date = new Date()): ActivityLevel {
  if (!lastActivity) return 'never';
  const days = (now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
  if (days < 3) return 'active';
  if (days <= 7) return 'idle';
  return 'inactive';
}

export const ACTIVITY_META: Record<ActivityLevel, { color: string; label: string; dot: string }> = {
  active: { color: 'var(--success)', label: 'Activo esta semana', dot: '🟢' },
  idle: { color: 'var(--warning)', label: 'Sin actividad 3-7 días', dot: '🟡' },
  inactive: { color: 'var(--danger)', label: 'Más de 7 días sin actividad', dot: '🔴' },
  never: { color: 'var(--text-secondary)', label: 'Sin actividad aún', dot: '⚪' },
};
