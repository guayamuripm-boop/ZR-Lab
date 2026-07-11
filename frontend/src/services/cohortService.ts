import { generateClassCode, normalizeClassCode } from '../lib/classCode';
import { supabase } from './supabaseClient';

export interface Cohort {
  id: string;
  name: string;
  class_code: string;
  instructor_id: string;
  active: boolean;
}

export interface CohortStudentProgress {
  profileId: string;
  displayName: string;
  lessonsCompleted: number;
  componentsDiscovered: number;
  lastActivity: string | null;
}

// Crea una cohorte con un código único. Reintenta si el código generado ya
// existe (colisión improbable pero posible).
export async function createCohort(name: string, instructorId: string): Promise<Cohort | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const classCode = generateClassCode();
    const { data, error } = await supabase
      .from('cohorts')
      .insert({ name, class_code: classCode, instructor_id: instructorId })
      .select()
      .single();
    if (!error && data) return data as Cohort;
    // 23505 = unique_violation → reintenta con otro código
    if (error && error.code !== '23505') return null;
  }
  return null;
}

// Une al estudiante a la cohorte que corresponde al código de clase (RF-A2).
export async function joinCohortByCode(profileId: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const classCode = normalizeClassCode(code);
  const { data: cohort, error: findError } = await supabase
    .from('cohorts')
    .select('id')
    .eq('class_code', classCode)
    .eq('active', true)
    .maybeSingle();

  if (findError) return { ok: false, error: 'No se pudo verificar el código. Intenta de nuevo.' };
  if (!cohort) return { ok: false, error: 'Código de clase inválido. Revisa con tu instructor.' };

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ cohort_id: cohort.id })
    .eq('id', profileId);

  if (updateError) return { ok: false, error: 'No se pudo unir a la cohorte.' };
  return { ok: true };
}

export async function getInstructorCohorts(instructorId: string): Promise<Cohort[]> {
  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Cohort[];
}

// Progreso de los estudiantes de una cohorte (RF-F2). Las políticas RLS
// garantizan que el instructor solo ve a los suyos (doc 03 §4.3).
export async function getCohortProgress(cohortId: string): Promise<CohortStudentProgress[]> {
  const { data: students, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('cohort_id', cohortId);
  if (error || !students) return [];

  const result: CohortStudentProgress[] = [];
  for (const student of students) {
    const [{ count: lessons }, { count: components }, { data: lastLog }] = await Promise.all([
      supabase
        .from('lesson_progress')
        .select('lesson_id', { count: 'exact', head: true })
        .eq('profile_id', student.id)
        .eq('status', 'completed'),
      supabase
        .from('component_discoveries')
        .select('component_id', { count: 'exact', head: true })
        .eq('profile_id', student.id),
      supabase
        .from('activity_log')
        .select('created_at')
        .eq('profile_id', student.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    result.push({
      profileId: student.id,
      displayName: student.display_name,
      lessonsCompleted: lessons ?? 0,
      componentsDiscovered: components ?? 0,
      lastActivity: lastLog?.created_at ?? null,
    });
  }
  return result;
}
