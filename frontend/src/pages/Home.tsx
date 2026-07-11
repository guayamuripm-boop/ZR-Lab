import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export function Home() {
  const { theme } = useTheme();
  const logoSrc =
    theme === 'dark' ? '/assets/brand/bLANCO COMPLETO.svg' : '/assets/brand/Color 1.svg';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <img src={logoSrc} alt="ZR Mecademy" className="w-64 max-w-full" />
      <div className="glass px-8 py-6 text-center">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          ZR Lab
        </h1>
        <p className="mt-2 font-body" style={{ color: 'var(--text-secondary)' }}>
          El taller virtual de ZR Mecademy
        </p>
      </div>
    </main>
  );
}
