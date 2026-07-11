import { navigate } from '../../hooks/usePathname';
import { useSession } from '../../stores/useSession';

// Banner del modo invitado (RF-A3): el explorador funciona sin registro, pero
// el progreso no se guarda. Invita a registrarse sin bloquear la exploración.
export function GuestBanner() {
  const isGuest = useSession((s) => s.isGuest);
  const userId = useSession((s) => s.userId);
  if (!isGuest || userId) return null;

  return (
    <div
      className="glass fixed inset-x-2 bottom-2 z-20 flex items-center justify-between gap-3 px-4 py-2 md:inset-x-auto md:right-4 md:bottom-auto md:top-16"
      role="status"
    >
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
        Estás explorando como invitado. Tu progreso no se guarda.
      </span>
      <button
        type="button"
        onClick={() => navigate('/entrar')}
        className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Crear cuenta
      </button>
    </div>
  );
}
