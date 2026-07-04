import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, User, Shield, ArrowRight } from 'lucide-react';

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
      <div className="w-full max-w-[440px] bg-white border border-[rgba(0,0,0,0.08)] rounded-[24px] p-10 relative z-10 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain grayscale brightness-0 opacity-90" />
        </div>

        <h2 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight text-center">Welcome back</h2>
        <p className="text-[14px] text-[var(--app-muted)] mb-8 text-center">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Email Address</label>
            <input
              className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-5">
            <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Password</label>
            <input
              className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Sign in as</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                {form.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none appearance-none cursor-pointer"
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin / HR Officer</option>
              </select>
            </div>
          </div>

          <button className="w-full flex items-center justify-center px-6 py-4 rounded-full text-[22px] font-serif bg-[#2D2E3E] text-white hover:bg-[#1f202b] shadow-md transition-all mt-4" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-[var(--app-muted)] text-[12px] my-6 font-medium">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
          or
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
        </div>

        <p className="text-center text-[13px] text-[var(--app-muted)] font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--app-ink)] font-bold hover:underline transition-colors">Sign Up</Link>
        </p>

        <div className="mt-6 border border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] rounded-lg p-3 text-[12px] text-[var(--app-muted)] text-center font-medium">
          <strong className="text-[var(--app-ink)]">Demo:</strong> admin@f4.co / admin123 <br/>
          <span className="opacity-80">or any email / emp123 (Employee)</span>
        </div>
      </div>
    </div>
  );
}
