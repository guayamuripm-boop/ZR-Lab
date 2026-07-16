import componentsFallback from '../content/components.json';
import lessonsFallback from '../content/lessons.json';
import type { ComponentContent, LessonContent } from '../content/types';
import { supabase } from './supabaseClient';

// Contenido en Supabase (editable sin deploy) con espejo JSON para desarrollo
// offline y demo (doc 03 ADR-4). Si la tabla aún no existe (migraciones no
// ejecutadas) o falla la red -- incluso a nivel de fetch, antes de una
// respuesta HTTP -- se cae al JSON local.

export async function getComponents(): Promise<ComponentContent[]> {
  try {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return componentsFallback as ComponentContent[];
    }
    return data as ComponentContent[];
  } catch {
    return componentsFallback as ComponentContent[];
  }
}

export async function getComponent(id: string): Promise<ComponentContent | undefined> {
  const components = await getComponents();
  return components.find((c) => c.id === id);
}

export async function getLessons(): Promise<LessonContent[]> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      console.log('[ContentService] Fallback a JSON local (error/data vacío):', error?.message);
      return lessonsFallback as LessonContent[];
    }
    console.log('[ContentService] Lecciones desde Supabase:', data.length);
    return data as LessonContent[];
  } catch (e) {
    console.log('[ContentService] Excepción, fallback a JSON local:', e);
    return lessonsFallback as LessonContent[];
  }
}

export async function getLesson(id: string): Promise<LessonContent | undefined> {
  const lessons = await getLessons();
  return lessons.find((l) => l.id === id);
}
