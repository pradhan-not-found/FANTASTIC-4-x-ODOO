import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [form, setForm] = useState({ empId: '', name: '', email: '', password: '', confirm: '', role: 'employee' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (!form.empId || !form.name || !form.email) { setError('All fields are required.'); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.password || form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setStep(3);
    setLoading(false);
  };

  if (step === 3) {
    return (
      <div className="auth-page">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-card animate-fade" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📧</div>
          <h2 className="auth-title">Verify your email</h2>
          <p style={{ color: 'var(--clr-text-3)', marginBottom: '32px', lineHeight: '1.7' }}>
            We've sent a verification link to <strong style={{ color: 'var(--clr-accent)' }}>{form.email}</strong>.<br/>
            Please check your inbox and verify before signing in.
          </p>
          <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/')}>
            → Go to Sign In
          </button>
        </div>
      </div>
    );
  }

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

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: '3px', borderRadius: '99px', background: step >= s ? 'var(--clr-primary)' : 'var(--clr-border)', transition: 'background 0.3s' }} />
          ))}
        </div>

        <h2 className="auth-title">{step === 1 ? 'Create account' : 'Set your password'}</h2>
        <p className="auth-subtitle">{step === 1 ? 'Join your team on HRMS' : 'Choose a strong, secure password'}</p>

        {error && (
          <div style={{ background: 'var(--clr-danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: 'var(--clr-danger)' }}>
            ⚠️ {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input className="form-input" placeholder="EMP-001" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Souradeep Pradhan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Work Email</label>
              <input className="form-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="employee">👤 Employee</option>
                <option value="admin">🛡️ HR Officer / Admin</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full btn-lg" type="submit">Continue →</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-secondary btn-lg" style={{ flex: '0 0 auto' }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
                {loading ? '⏳ Creating...' : '✓ Create Account'}
              </button>
            </div>
          </form>
        )}

        <div className="auth-divider">or</div>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--clr-text-3)' }}>
          Already have an account?{' '}
          <Link to="/" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
