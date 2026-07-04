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
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-canvas)] relative overflow-hidden">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.03) 0%, transparent 50%)' }}></div>

      <div className="w-full max-w-[440px] bg-white border border-[rgba(0,0,0,0.08)] rounded-[20px] p-10 relative z-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            W
          </div>
          <div className="flex flex-col">
            <strong className="text-[17px] font-black text-[var(--app-ink)] tracking-tight">WorkAlign</strong>
            <span className="text-[11px] text-[var(--app-muted)] mt-0.5">Human Resource Management</span>
          </div>
        </div>

        <h2 className="text-[22px] font-black text-[var(--app-ink)] mb-1 tracking-tight">Welcome back</h2>
        <p className="text-[14px] text-[var(--app-muted)] mb-8">Sign in to your HRMS account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-600 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Email Address</label>
            <input
              className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Password</label>
            <input
              className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Sign in as</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none appearance-none cursor-pointer"
              value={form.role} 
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
            >
              <option value="employee">👤 Employee</option>
              <option value="admin">🛡️ Admin / HR Officer</option>
            </select>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all" type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '→ Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-[var(--app-muted)] text-[12px] my-6 font-medium">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
          or
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
        </div>

        <p className="text-center text-[13px] text-[var(--app-muted)]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign Up</Link>
        </p>

        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-[12px] text-blue-700 text-center">
          <strong>Demo:</strong> admin@f4.co / admin123 (Admin) &nbsp;|&nbsp; any email / emp123 (Employee)
        </div>
      </div>
    </div>
  );
}
