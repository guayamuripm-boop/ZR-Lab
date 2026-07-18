import { lazy, Suspense, useEffect } from 'react';
import { Home } from './pages/Home';
import { usePathname } from './hooks/usePathname';
import { useSession } from './stores/useSession';

// Rutas pesadas cargadas de forma diferida (F7.2): la escena Konva y las
// pantallas secundarias no se incluyen en el bundle inicial. Home queda
// eager para que la primera pantalla cargue al instante.
const Workshop = lazy(() => import('./pages/Workshop').then((m) => ({ default: m.Workshop })));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const InstructorPanel = lazy(() => import('./pages/InstructorPanel').then((m) => ({ default: m.InstructorPanel })));
const Auth = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Auth })));
const DevEngine = lazy(() => import('./pages/DevEngine').then((m) => ({ default: m.DevEngine })));
const DevFaults = lazy(() => import('./pages/DevFaults').then((m) => ({ default: m.DevFaults })));
const DevUi = lazy(() => import('./pages/DevUi').then((m) => ({ default: m.DevUi })));
const OscilloscopeScreen = lazy(() => import('./pages/OscilloscopeScreen').then((m) => ({ default: m.OscilloscopeScreen })));
const ChallengeScreen = lazy(() => import('./pages/ChallengeScreen').then((m) => ({ default: m.ChallengeScreen })));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
      Cargando…
    </div>
  );
}

function App() {
  const pathname = usePathname();
  const init = useSession((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  function renderRoute() {
    switch (pathname) {
      case '/dev/engine':
        return <DevEngine />;
      case '/dev/faults':
        return <DevFaults />;
      case '/dev/ui':
        return <DevUi />;
      case '/osciloscopio':
        return <OscilloscopeScreen />;
      case '/reto':
        return <ChallengeScreen />;
      case '/entrar':
        return <Auth />;
      case '/taller':
        return <Workshop />;
      case '/dashboard':
        return <Dashboard />;
      case '/instructor':
        return <InstructorPanel />;
      default:
        return <Home />;
    }
  }

  return <Suspense fallback={<RouteFallback />}>{renderRoute()}</Suspense>;
}

export default App;
