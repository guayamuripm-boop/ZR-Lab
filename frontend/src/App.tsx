import { DevEngine } from './pages/DevEngine';
import { DevUi } from './pages/DevUi';
import { Home } from './pages/Home';
import { usePathname } from './hooks/usePathname';

function App() {
  const pathname = usePathname();
  if (pathname === '/dev/engine') return <DevEngine />;
  if (pathname === '/dev/ui') return <DevUi />;
  return <Home />;
}

export default App;
