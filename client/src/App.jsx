import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import BackendLoadingScreen from './components/BackendLoadingScreen';

const MIN_WARMUP_MS = 3000;
const MAX_WARMUP_MS = 5000;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = localStorage.getItem('token');
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_WARMUP_MS));
    const maxDelay = new Promise((resolve) => setTimeout(resolve, MAX_WARMUP_MS));

    const healthPing = apiUrl
      ? fetch(`${apiUrl}/health`).catch(() => { })
      : Promise.resolve();

    const warmup = async () => {
      await Promise.race([Promise.all([minDelay, healthPing]), maxDelay]);
      setIsWarmingUp(false);
    };

    warmup();
  }, []);

  useEffect(() => {
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      navigate('/dashboard', { replace: true });
    }
  }, [location.search, navigate, params]);

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  if (isWarmingUp) {
    return <BackendLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login />} />
        <Route path="/history" element={isLoggedIn ? <History /> : <Login />} />
        <Route path="/settings" element={isLoggedIn ? <Settings /> : <Login />} />
      </Routes>
    </div>
  );
}

export default App;
