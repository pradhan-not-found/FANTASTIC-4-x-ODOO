import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, User, Shield, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';

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
        <div className="w-full max-w-[440px] bg-white border border-[rgba(0,0,0,0.08)] rounded-[24px] p-10 relative z-10 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
          <div className="w-16 h-16 bg-[var(--app-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
            <MailCheck className="w-8 h-8 text-[var(--app-ink)]" />
          </div>
          <h2 className="text-[22px] font-bold text-[var(--app-ink)] mb-2 tracking-tight">Verify your email</h2>
          <p className="text-[14px] text-[var(--app-muted)] mb-8 leading-relaxed font-medium">
            We've sent a verification link to <strong className="text-[var(--app-ink)]">{form.email}</strong>.<br/>
            Please check your inbox and verify before signing in.
          </p>
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14px] font-bold bg-[#171717] text-white hover:bg-black shadow-sm transition-all" onClick={() => navigate('/')}>
            Go to Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-canvas)] relative overflow-hidden">
      <div className="w-full max-w-[440px] bg-white border border-[rgba(0,0,0,0.08)] rounded-[24px] p-10 relative z-10 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain grayscale brightness-0 opacity-90" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step >= s ? 'bg-[var(--app-ink)]' : 'bg-[var(--app-hairline)]'}`} />
          ))}
        </div>

        <h2 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight text-center">{step === 1 ? 'Create account' : 'Set your password'}</h2>
        <p className="text-[14px] text-[var(--app-muted)] mb-6 text-center font-medium">{step === 1 ? 'Join your team on Workplace' : 'Choose a strong, secure password'}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Employee ID</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" placeholder="EMP-001" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Full Name</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" placeholder="Souradeep Pradhan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Work Email</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-6 relative">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Role</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)]">
                  {form.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <select 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none appearance-none cursor-pointer"
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">HR Officer / Admin</option>
                </select>
              </div>
            </div>
            <button className="w-full flex items-center justify-center px-6 py-4 rounded-full text-[22px] font-serif bg-[#2D2E3E] text-white hover:bg-[#1f202b] shadow-md transition-all mt-4" type="submit">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Password</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="mb-6">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Confirm Password</label>
              <input className="w-full px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg text-[var(--app-ink)] text-[14px] focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)]" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button type="button" className="shrink-0 flex items-center justify-center px-6 py-4 rounded-full text-[16px] font-bold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all" onClick={() => setStep(1)}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="flex-1 flex items-center justify-center px-6 py-4 rounded-full text-[22px] font-serif bg-[#2D2E3E] text-white hover:bg-[#1f202b] shadow-md transition-all" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Sign up'}
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center gap-3 text-[var(--app-muted)] text-[12px] my-6 font-medium">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
          or
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]"></div>
        </div>
        
        <p className="text-center text-[13px] text-[var(--app-muted)] font-medium">
          Already have an account?{' '}
          <Link to="/" className="text-[var(--app-ink)] font-bold hover:underline transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
