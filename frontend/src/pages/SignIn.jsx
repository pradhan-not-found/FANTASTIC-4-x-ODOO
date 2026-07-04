import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 900));
    if (form.email === 'admin@f4.co' && form.password === 'admin123') {
      localStorage.setItem('hrms_role', 'admin');
      navigate('/dashboard');
    } else if (form.password === 'emp123') {
      localStorage.setItem('hrms_role', 'employee');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try admin@f4.co / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card animate-fade">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏢</div>
          <div className="auth-logo-text">
            <strong>FANTASTIC 4 × ODOO</strong>
            <span>Human Resource Management</span>
          </div>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your HRMS account</p>

        {error && (
          <div className="alert-error">⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sign in as</label>
            <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="employee">👤 Employee</option>
              <option value="admin">🛡️ Admin / HR Officer</option>
            </select>
          </div>

          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '→ Sign In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--clr-text-3)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>

        <div className="alert-info" style={{ marginTop: '20px', marginBottom: 0 }}>
          <strong>Demo:</strong> admin@f4.co / admin123 (Admin) &nbsp;|&nbsp; any email / emp123 (Employee)
        </div>
      </div>
    </div>
  );
}
