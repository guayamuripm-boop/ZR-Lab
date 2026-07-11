import { useEffect, useMemo, useState } from 'react';
import { GlassButton } from '../components/ui/GlassButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { navigate } from '../hooks/usePathname';
import { ACTIVITY_META, activityLevel } from '../lib/activityStatus';
import {
  createCohort,
  getCohortProgress,
  getInstructorCohorts,
  type Cohort,
  type CohortStudentProgress,
} from '../services/cohortService';
import { useSession } from '../stores/useSession';

type SortKey = 'displayName' | 'lessonsCompleted' | 'componentsDiscovered' | 'lastActivity';

export function InstructorPanel() {
  const profile = useSession((s) => s.profile);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selected, setSelected] = useState<Cohort | null>(null);
  const [rows, setRows] = useState<CohortStudentProgress[]>([]);
  const [newName, setNewName] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('displayName');
  const [sortAsc, setSortAsc] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile?.id) getInstructorCohorts(profile.id).then(setCohorts);
  }, [profile?.id]);

  useEffect(() => {
    if (selected) getCohortProgress(selected.id).then(setRows);
    else setRows([]);
  }, [selected]);

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortAsc]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.id || !newName.trim()) return;
    const cohort = await createCohort(newName.trim(), profile.id);
    if (cohort) {
      setCohorts((c) => [cohort, ...c]);
      setSelected(cohort);
      setNewName('');
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  if (profile && profile.role !== 'instructor' && profile.role !== 'admin') {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="glass p-6 text-center" style={{ color: 'var(--text-primary)' }}>
          <p>Este panel es solo para instructores.</p>
          <GlassButton variant="secondary" onClick={() => navigate('/taller')} style={{ marginTop: 12 }}>
            Ir al taller
          </GlassButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Panel de Instructor
        </h1>
        <div className="flex items-center gap-2">
          <GlassButton variant="secondary" onClick={() => navigate('/taller')}>
            Ir al taller
          </GlassButton>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <aside className="glass flex flex-col gap-3 p-4">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Mis cohortes
          </h2>
          {cohorts.map((cohort) => (
            <button
              key={cohort.id}
              type="button"
              onClick={() => setSelected(cohort)}
              className="rounded-lg px-3 py-2 text-left text-sm"
              style={{
                background: selected?.id === cohort.id ? 'var(--accent)' : 'var(--glass-surface-2)',
                color: selected?.id === cohort.id ? '#fff' : 'var(--text-primary)',
              }}
            >
              {cohort.name}
            </button>
          ))}

          <form onSubmit={handleCreate} className="mt-2 flex flex-col gap-2">
            <input
              placeholder="Nombre de la nueva cohorte"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ background: 'var(--glass-surface-2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
            />
            <GlassButton variant="primary" type="submit">
              Crear cohorte
            </GlassButton>
          </form>
        </aside>

        <section className="glass p-4">
          {selected ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                    {selected.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Comparte este código con tus estudiantes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(selected.class_code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg"
                  style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
                >
                  {selected.class_code}
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {copied ? '¡copiado!' : 'copiar'}
                  </span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: 'var(--text-secondary)' }}>
                      {(
                        [
                          ['displayName', 'Estudiante'],
                          ['lessonsCompleted', 'Lecciones'],
                          ['componentsDiscovered', 'Piezas'],
                          ['lastActivity', 'Actividad'],
                        ] as [SortKey, string][]
                      ).map(([key, label]) => (
                        <th key={key} className="cursor-pointer py-2 text-left" onClick={() => toggleSort(key)}>
                          {label} {sortKey === key ? (sortAsc ? '▲' : '▼') : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((row) => {
                      const level = activityLevel(row.lastActivity);
                      const meta = ACTIVITY_META[level];
                      return (
                        <tr key={row.profileId} style={{ borderTop: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                          <td className="py-2">{row.displayName}</td>
                          <td className="py-2">{row.lessonsCompleted}/15</td>
                          <td className="py-2">{row.componentsDiscovered}/12</td>
                          <td className="py-2">
                            <span title={meta.label}>
                              {meta.dot} {meta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {sortedRows.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                          Aún no hay estudiantes en esta cohorte.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Selecciona o crea una cohorte para ver su progreso.</p>
          )}
        </section>
      </div>
    </main>
  );
}
