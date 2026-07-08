import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const stored = localStorage.getItem('tabmarko_theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Outlet />
  )
}

export default App;