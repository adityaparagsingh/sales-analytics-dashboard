import React, { useState } from 'react';
import { BarChart3, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@salesdashboard.com');
  const [password, setPassword] = useState('Admin@12345');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { const data = await api.login(email, password); localStorage.setItem('sales_token', data.token); localStorage.setItem('sales_user', JSON.stringify(data.user)); onLogin(data.user); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="login-page">
    <div className="login-art"><div className="login-orb one"/><div className="login-orb two"/><div className="mini-dashboard"><div className="mini-line"/><div className="mini-bars"><i/><i/><i/><i/><i/></div></div></div>
    <div className="login-panel">
      <div className="login-brand"><div className="brand-mark"><BarChart3 size={22}/></div><span>Salesly</span></div>
      <div className="login-copy"><h1>Welcome back 👋</h1><p>Sign in to your sales analytics workspace.</p></div>
      <form onSubmit={submit} className="login-form">
        <label>Email<div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div></label>
        <label>Password<div className="input-wrap"><LockKeyhole size={18}/><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="icon-button" onClick={()=>setShow(!show)} aria-label="Toggle password">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-button full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="demo-note"><strong>Demo account</strong><br/>admin@salesdashboard.com<br/>Admin@12345</div>
      <p className="login-foot">Your dashboard data is loaded from MySQL through the Express API.</p>
    </div>
  </div>;
}
