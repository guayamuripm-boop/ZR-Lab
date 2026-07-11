import { useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Auth } from './pages/Auth';
import { DevEngine } from './pages/DevEngine';
import { DevUi } from './pages/DevUi';
import { Home } from './pages/Home';
import { InstructorPanel } from './pages/InstructorPanel';
import { Workshop } from './pages/Workshop';
import { usePathname } from './hooks/usePathname';
import { useSession } from './stores/useSession';

function App() {
  const pathname = usePathname();
  const init = useSession((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  if (pathname === '/dev/engine') return <DevEngine />;
  if (pathname === '/dev/ui') return <DevUi />;
  if (pathname === '/entrar') return <Auth />;
  if (pathname === '/taller') return <Workshop />;
  if (pathname === '/dashboard') return <Dashboard />;
  if (pathname === '/instructor') return <InstructorPanel />;
  return <Home />;
}

export default App;
