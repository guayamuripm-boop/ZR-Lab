import { supabase } from './supabaseClient';

// Único punto de escritura de progreso (doc 03 §7): nunca se llama a
// supabase directamente desde componentes. Modo invitado (RF-A3): sin
// sesión, no hay nada que guardar — falla en silencio, es el comportamiento
// esperado, no un error.

async function getAuthenticatedProfileId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function recordDiscovery(componentId: string): Promise<void> {
  const profileId = await getAuthenticatedProfileId();
  if (!profileId) return;
  try {
    await supabase
      .from('component_discoveries')
      .upsert({ profile_id: profileId, component_id: componentId, status: 'seen' }, { onConflict: 'profile_id,component_id' });
  } catch {
    // Sin conexión o tabla aún no migrada: el progreso se reintentará en la próxima visita.
  }
}

export async function markComponentMastered(componentId: string): Promise<void> {
  const profileId = await getAuthenticatedProfileId();
  if (!profileId) return;
  try {
    await supabase
      .from('component_discoveries')
      .upsert({ profile_id: profileId, component_id: componentId, status: 'mastered' }, { onConflict: 'profile_id,component_id' });
  } catch {
    // Sin conexión o tabla aún no migrada: el progreso se reintentará en la próxima visita.
  }
}

export async function recordLessonProgress(
  lessonId: string,
  status: 'in_progress' | 'completed',
  score?: number,
): Promise<void> {
  const profileId = await getAuthenticatedProfileId();
  if (!profileId) return;
  try {
    await supabase.from('lesson_progress').upsert(
      {
        profile_id: profileId,
        lesson_id: lessonId,
        status,
        score: score ?? null,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      },
      { onConflict: 'profile_id,lesson_id' },
    );
  } catch {
    // Sin conexión o tabla aún no migrada: el progreso se reintentará en la próxima visita.
  }
}

export async function awardBadge(badgeKey: string): Promise<void> {
  const profileId = await getAuthenticatedProfileId();
  if (!profileId) return;
  try {
    await supabase
      .from('badges_earned')
      .upsert({ profile_id: profileId, badge_key: badgeKey }, { onConflict: 'profile_id,badge_key' });
  } catch {
    // Best-effort: la insignia se reintentará al completar de nuevo la lección.
  }
}

export async function logActivity(event: string, payload?: Record<string, unknown>): Promise<void> {
  const profileId = await getAuthenticatedProfileId();
  if (!profileId) return;
  try {
    await supabase.from('activity_log').insert({ profile_id: profileId, event, payload: payload ?? {} });
  } catch {
    // Best-effort: el registro de actividad nunca debe romper la UI.
  }
}
