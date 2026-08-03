import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Boxes, FileText, LayoutDashboard, LogOut, Menu, Search, Settings, ShoppingBag, Users, X, CircleHelp } from 'lucide-react';
import { api } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

export function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sales_user') || 'null'));
  return { user, setUser };
}

function Protected({ children }) {
  return localStorage.getItem('sales_token') ? children : <Navigate to="/login" replace />;
}

const nav = [
  ['/','Dashboard',LayoutDashboard], ['/analytics','Analytics',BarChart3], ['/products','Products',Boxes],
  ['/customers','Customers',Users], ['/orders','Orders',ShoppingBag], ['/reports','Reports',FileText], ['/settings','Settings',Settings]
];

function AppShell({ children, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (q.trim().length < 2) return setResults([]);
      try { setResults(await api.search(q)); } catch { setResults([]); }
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  const go = (path) => { navigate(path); setOpen(false); };
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><BarChart3 size={20}/></div><span>Salesly</span></div>
      <nav className="side-nav">
        {nav.map(([path,label,Icon]) => <button key={path} className={`nav-item ${location.pathname === path ? 'active' : ''}`} onClick={() => go(path)} title={label}><Icon size={20}/><span>{label}</span></button>)}
      </nav>
      <div className="side-bottom">
        <button className="nav-item" title="Help"><CircleHelp size={20}/><span>Help</span></button>
        <button className="nav-item" title="Logout" onClick={onLogout}><LogOut size={20}/><span>Logout</span></button>
      </div>
    </aside>
    {open && <button className="scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <main className="main-content">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={22}/></button>
        <div><h1>Sales Dashboard</h1><p>Monitor your business performance</p></div>
        <div className="header-actions">
          <div className="global-search"><Search size={17}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." aria-label="Global search"/>
            {results.length > 0 && <div className="search-results">{results.map((r,i)=><button key={`${r.type}-${r.id}-${i}`} onClick={() => { setQ(''); setResults([]); if (r.type === 'product') navigate('/products'); else if (r.type === 'customer') navigate('/customers'); else navigate('/orders'); }}><span>{r.type}</span><strong>{r.label}</strong><small>{r.detail}</small></button>)}</div>}
          </div>
          <div className="avatar" title={user?.email}>{(user?.name || 'A').slice(0,1)}</div>
        </div>
      </header>
      {children}
    </main>
  </div>;
}

export default function App() {
  const { user, setUser } = useAuth();
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('sales_token')));
  useEffect(() => { if (!checking) return; api.me().catch(() => { localStorage.clear(); setUser(null); }).finally(() => setChecking(false)); }, []);
  const logout = () => { localStorage.removeItem('sales_token'); localStorage.removeItem('sales_user'); setUser(null); };
  if (checking) return <div className="loading-screen">Loading dashboard…</div>;
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace/> : <Login onLogin={setUser}/>} />
    <Route path="/*" element={<Protected><AppShell user={user} onLogout={logout}><Routes>
      <Route index element={<Dashboard/>}/><Route path="analytics" element={<Analytics/>}/><Route path="products" element={<Products/>}/><Route path="customers" element={<Customers/>}/><Route path="orders" element={<Orders/>}/><Route path="reports" element={<Reports/>}/><Route path="settings" element={<SettingsPage user={user}/>} />
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes></AppShell></Protected>} />
  </Routes>;
}
