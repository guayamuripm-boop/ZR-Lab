import { useState } from 'react';
import { GlassButton } from '../components/ui/GlassButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { navigate } from '../hooks/usePathname';
import { useTheme } from '../hooks/useTheme';
import { isValidClassCode } from '../lib/classCode';
import { joinCohortByCode } from '../services/cohortService';
import { useSession } from '../stores/useSession';

type Mode = 'login' | 'register' | 'recover';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-button)',
  background: 'var(--glass-surface-2)',
  border: '1px solid var(--glass-border)',
  color: 'var(--text-primary)',
  fontSize: 15,
  minHeight: 44,
};

export function Auth() {
  const { theme } = useTheme();
  const signIn = useSession((s) => s.signIn);
  const signUp = useSession((s) => s.signUp);
  const recoverPassword = useSession((s) => s.recoverPassword);
  const continueAsGuest = useSession((s) => s.continueAsGuest);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const logoSrc = theme === 'dark' ? '/assets/brand/bLANCO COMPLETO.svg' : '/assets/brand/Color 1.svg';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    if (mode === 'recover') {
      const res = await recoverPassword(email);
      setBusy(false);
      if (res.ok) setNotice('Te enviamos un correo para recuperar tu contraseña.');
      else setError(res.error ?? 'No se pudo enviar el correo.');
      return;
    }

    if (mode === 'register') {
      if (classCode && !isValidClassCode(classCode)) {
        setBusy(false);
        setError('El código de clase no es válido (6 caracteres).');
        return;
      }
      const res = await signUp(email, password, displayName);
      if (!res.ok) {
        setBusy(false);
        setError(res.error ?? 'No se pudo crear la cuenta.');
        return;
      }
      const userId = useSession.getState().userId;
      if (classCode && userId) await joinCohortByCode(userId, classCode);
      setBusy(false);
      navigate('/taller');
      return;
    }

    const res = await signIn(email, password);
    setBusy(false);
    if (res.ok) navigate('/taller');
    else setError(res.error ?? 'No se pudo iniciar sesión.');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="glass w-full max-w-sm p-6" style={{ borderRadius: 'var(--radius-modal)' }}>
        <img src={logoSrc} alt="ZR Mecademy" className="mx-auto mb-5 w-40" />

        <div className="mb-4 flex gap-1">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className="flex-1 rounded-full py-1.5 text-sm"
              style={{
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {m === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' ? (
            <input
              style={fieldStyle}
              placeholder="Tu nombre"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
            />
          ) : null}

          <input
            style={fieldStyle}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {mode !== 'recover' ? (
            <input
              style={fieldStyle}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          ) : null}

          {mode === 'register' ? (
            <input
              style={fieldStyle}
              placeholder="Código de clase (opcional)"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              maxLength={6}
              autoComplete="off"
            />
          ) : null}

          {error ? (
            <p className="text-sm" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="text-sm" style={{ color: 'var(--success)' }}>
              {notice}
            </p>
          ) : null}

          <GlassButton variant="primary" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Un momento…' : mode === 'login' ? 'Ingresar' : mode === 'register' ? 'Crear cuenta' : 'Enviar correo'}
          </GlassButton>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          {mode === 'login' ? (
            <button type="button" onClick={() => setMode('recover')} style={{ color: 'var(--text-secondary)' }}>
              ¿Olvidaste tu contraseña?
            </button>
          ) : null}
          {mode === 'recover' ? (
            <button type="button" onClick={() => setMode('login')} style={{ color: 'var(--text-secondary)' }}>
              Volver a ingresar
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              continueAsGuest();
              navigate('/taller');
            }}
            style={{ color: 'var(--accent)' }}
          >
            Explorar como invitado
          </button>
        </div>
      </div>
    </main>
  );
}
