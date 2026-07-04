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
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-canvas)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.03) 0%, transparent 50%)' }}></div>
        <div className="w-full max-w-[440px] bg-white border border-[rgba(0,0,0,0.08)] rounded-[20px] p-10 relative z-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
          <div className="text-[64px] mb-6">📧</div>
          <h2 className="text-[22px] font-black text-[var(--app-ink)] mb-1 tracking-tight">Verify your email</h2>
          <p className="text-[14px] text-[var(--app-muted)] mb-8 leading-relaxed">
            We've sent a verification link to <strong className="text-blue-600 font-semibold">{form.email}</strong>.<br/>
            Please check your inbox and verify before signing in.
          </p>
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all" onClick={() => navigate('/')}>
            → Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-canvas)] relative overflow-hidden">
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

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step >= s ? 'bg-blue-600' : 'bg-[var(--app-hairline)]'}`} />
          ))}
        </div>

        <h2 className="text-[22px] font-black text-[var(--app-ink)] mb-1 tracking-tight">{step === 1 ? 'Create account' : 'Set your password'}</h2>
        <p className="text-[14px] text-[var(--app-muted)] mb-6">{step === 1 ? 'Join your team on WorkAlign' : 'Choose a strong, secure password'}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-600 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Employee ID</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" placeholder="EMP-001" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Full Name</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" placeholder="Souradeep Pradhan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Work Email</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Role</label>
              <select 
                className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none appearance-none cursor-pointer"
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
              >
                <option value="employee">👤 Employee</option>
                <option value="admin">🛡️ HR Officer / Admin</option>
              </select>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all" type="submit">Continue →</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Password</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Confirm Password</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button type="button" className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-[14.5px] font-semibold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-muted)] hover:text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all" onClick={() => setStep(1)}>← Back</button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all" type="submit" disabled={loading}>
                {loading ? '⏳ Creating...' : '✓ Create Account'}
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center gap-3 text-[var(--app-muted)] text-[12px] my-6 font-medium">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
          or
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
        </div>
        
        <p className="text-center text-[13px] text-[var(--app-muted)]">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
