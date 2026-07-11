-- ZR Lab — Esquema inicial (doc 03 §4.1)
-- Ejecutar en Supabase Dashboard → SQL Editor, en el proyecto ubolltmmahcwdywdyssp.
-- RLS activo en TODAS las tablas, sin excepciones (doc 03 §4.3, regla dura de CLAUDE.md).

-- COHORTES Y PERFILES -------------------------------------------------------

create table cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_code text unique not null,
  instructor_id uuid,
  active boolean default true,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_key text default 'a1',
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  cohort_id uuid references cohorts(id),
  created_at timestamptz default now()
);

alter table cohorts
  add constraint cohorts_instructor_id_fkey foreign key (instructor_id) references profiles(id);

-- CONTENIDO (editable sin deploy) --------------------------------------------

create table systems (
  id text primary key,
  name text not null,
  description text,
  order_index int default 0,
  published boolean default false
);

create table components (
  id text primary key,
  system_id text references systems(id),
  name text not null,
  short_role text,
  full_description text,
  how_to_test jsonb,
  failure_signs jsonb,
  scene_key text,
  order_index int default 0
);

create table lessons (
  id text primary key,
  system_id text references systems(id),
  component_id text references components(id),
  title text not null,
  estimated_minutes int default 4,
  steps jsonb not null,
  badge_key text,
  order_index int not null,
  prerequisite_lesson_id text references lessons(id)
);

-- PROGRESO --------------------------------------------------------------------

create table component_discoveries (
  profile_id uuid references profiles(id) on delete cascade,
  component_id text references components(id),
  status text default 'seen' check (status in ('seen', 'mastered')),
  discovered_at timestamptz default now(),
  primary key (profile_id, component_id)
);

create table lesson_progress (
  profile_id uuid references profiles(id) on delete cascade,
  lesson_id text references lessons(id),
  status text default 'in_progress' check (status in ('in_progress', 'completed')),
  score int,
  completed_at timestamptz,
  primary key (profile_id, lesson_id)
);

create table badges_earned (
  profile_id uuid references profiles(id) on delete cascade,
  badge_key text not null,
  earned_at timestamptz default now(),
  primary key (profile_id, badge_key)
);

create table activity_log (
  id bigint generated always as identity primary key,
  profile_id uuid references profiles(id),
  event text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (doc 03 §4.3) --------------------------------------------

alter table cohorts enable row level security;
alter table profiles enable row level security;
alter table systems enable row level security;
alter table components enable row level security;
alter table lessons enable row level security;
alter table component_discoveries enable row level security;
alter table lesson_progress enable row level security;
alter table badges_earned enable row level security;
alter table activity_log enable row level security;

-- Helper: rol del usuario autenticado actual
create or replace function public.current_role() returns text
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function public.current_cohort_id() returns uuid
language sql stable security definer set search_path = public as $$
  select cohort_id from profiles where id = auth.uid();
$$;

-- profiles: cada usuario lee/edita el suyo; instructores leen los de su cohorte; admin todo
create policy "profiles_select_own" on profiles for select
  using (id = auth.uid());
create policy "profiles_select_cohort_instructor" on profiles for select
  using (public.current_role() = 'instructor' and cohort_id = public.current_cohort_id());
create policy "profiles_select_admin" on profiles for select
  using (public.current_role() = 'admin');
create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());
create policy "profiles_insert_own" on profiles for insert
  with check (id = auth.uid());

-- cohorts: cualquier autenticado puede leer (necesario para validar código de clase);
-- solo el propio instructor crea/edita la suya
create policy "cohorts_select_authenticated" on cohorts for select
  using (auth.role() = 'authenticated');
create policy "cohorts_insert_instructor" on cohorts for insert
  with check (public.current_role() = 'instructor' and instructor_id = auth.uid());
create policy "cohorts_update_own_instructor" on cohorts for update
  using (instructor_id = auth.uid());

-- contenido (systems, components, lessons): select público + autenticado; escritura solo admin
create policy "systems_select_public" on systems for select using (true);
create policy "systems_write_admin" on systems for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy "components_select_public" on components for select using (true);
create policy "components_write_admin" on components for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy "lessons_select_public" on lessons for select using (true);
create policy "lessons_write_admin" on lessons for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- progreso: insert/select solo del propio profile_id; instructores select de su cohorte
create policy "discoveries_own" on component_discoveries for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "discoveries_select_cohort_instructor" on component_discoveries for select
  using (
    public.current_role() = 'instructor'
    and exists (
      select 1 from profiles p
      where p.id = component_discoveries.profile_id
        and p.cohort_id = public.current_cohort_id()
    )
  );

create policy "lesson_progress_own" on lesson_progress for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "lesson_progress_select_cohort_instructor" on lesson_progress for select
  using (
    public.current_role() = 'instructor'
    and exists (
      select 1 from profiles p
      where p.id = lesson_progress.profile_id
        and p.cohort_id = public.current_cohort_id()
    )
  );

create policy "badges_own" on badges_earned for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "badges_select_cohort_instructor" on badges_earned for select
  using (
    public.current_role() = 'instructor'
    and exists (
      select 1 from profiles p
      where p.id = badges_earned.profile_id
        and p.cohort_id = public.current_cohort_id()
    )
  );

create policy "activity_log_own" on activity_log for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "activity_log_select_cohort_instructor" on activity_log for select
  using (
    public.current_role() = 'instructor'
    and exists (
      select 1 from profiles p
      where p.id = activity_log.profile_id
        and p.cohort_id = public.current_cohort_id()
    )
  );
