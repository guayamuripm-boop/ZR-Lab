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

export async function logActivity(event: string, payload?: Record<string, unknown>): Promise<void> {
  const profileId = await getAuthenticatedProfileId();
  if (!profileId) return;
  try {
    await supabase.from('activity_log').insert({ profile_id: profileId, event, payload: payload ?? {} });
  } catch {
    // Best-effort: el registro de actividad nunca debe romper la UI.
  }
}
