import { DevEngine } from './pages/DevEngine';
import { Home } from './pages/Home';
import { usePathname } from './hooks/usePathname';

function App() {
  const pathname = usePathname();
  if (pathname === '/dev/engine') return <DevEngine />;
  return <Home />;
}

export default App;
