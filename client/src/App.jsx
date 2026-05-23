import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      navigate('/dashboard', { replace: true });
    }
  }, [location.search, navigate, params]);

  const isLoggedIn = Boolean(localStorage.getItem('token'));

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
