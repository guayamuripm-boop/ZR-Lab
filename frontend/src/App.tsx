import { Dashboard } from './components/Dashboard/Dashboard';
import { DevEngine } from './pages/DevEngine';
import { DevUi } from './pages/DevUi';
import { Home } from './pages/Home';
import { Workshop } from './pages/Workshop';
import { usePathname } from './hooks/usePathname';

function App() {
  const pathname = usePathname();
  if (pathname === '/dev/engine') return <DevEngine />;
  if (pathname === '/dev/ui') return <DevUi />;
  if (pathname === '/taller') return <Workshop />;
  if (pathname === '/dashboard') return <Dashboard />;
  return <Home />;
}

export default App;
