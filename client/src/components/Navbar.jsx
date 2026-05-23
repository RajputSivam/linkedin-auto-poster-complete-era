import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600 px-3 py-2 text-white">in</div>
          <span className="text-xl font-semibold text-slate-900">LinkedIn Auto-Poster</span>
        </div>
        <nav className="flex items-center gap-4 text-slate-600">
          <NavLink className={({ isActive }) => isActive ? 'font-semibold text-slate-900' : ''} to="/dashboard">Dashboard</NavLink>
          <NavLink className={({ isActive }) => isActive ? 'font-semibold text-slate-900' : ''} to="/history">History</NavLink>
          <NavLink className={({ isActive }) => isActive ? 'font-semibold text-slate-900' : ''} to="/settings">Settings</NavLink>
          <button onClick={handleLogout} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-800 hover:bg-slate-200">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
