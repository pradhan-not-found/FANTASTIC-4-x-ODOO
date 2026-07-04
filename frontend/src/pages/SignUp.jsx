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
    <div className="min-h-screen flex bg-white p-3 lg:p-5 gap-5">
      {/* Form Side */}
      <div className="w-full lg:w-[500px] xl:w-[560px] flex flex-col justify-center px-8 sm:px-12 lg:px-16 shrink-0 relative z-10">
        <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-start gap-3 mb-10">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain grayscale brightness-0 opacity-90" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[var(--app-ink)]' : 'bg-[rgba(0,0,0,0.06)]'} transition-colors`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--app-ink)]' : 'bg-[rgba(0,0,0,0.06)]'} transition-colors`}></div>
          </div>

          <h2 className="text-[36px] font-serif font-medium text-[var(--app-ink)] mb-2 tracking-tight">Sign up</h2>
          <p className="text-[15px] text-[var(--app-muted)] mb-10">
            {step === 1 ? 'Start by telling us about yourself.' : 'Secure your account with a password.'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-[13px] text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext}>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">First Name</label>
                  <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="text" placeholder="John" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Last Name</label>
                  <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="text" placeholder="Doe" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Email Address</label>
                <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="mb-8 relative">
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">I am a...</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--app-muted)] pointer-events-none">
                    {form.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <select 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none appearance-none cursor-pointer"
                    value={form.role} 
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '20px' }}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin / HR Officer</option>
                  </select>
                </div>
              </div>
              <button className="w-full flex items-center justify-center px-6 py-4 rounded-full text-[22px] font-serif bg-[#2D2E3E] text-white hover:bg-[#1f202b] shadow-lg transition-all mt-4" type="submit">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="animate-in slide-in-from-right-4 duration-300">
              <div className="mb-5">
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Create Password</label>
                <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="mb-8">
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Confirm Password</label>
                <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="button" className="shrink-0 flex items-center justify-center px-6 py-4 rounded-full text-[16px] font-bold bg-white border border-[rgba(0,0,0,0.15)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button className="flex-1 flex items-center justify-center px-6 py-4 rounded-full text-[22px] font-serif bg-[#2D2E3E] text-white hover:bg-[#1f202b] shadow-lg transition-all" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Sign up'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-[14px] text-[var(--app-muted)] font-medium mt-10">
            Already have an account?{' '}
            <Link to="/" className="text-[var(--app-ink)] font-bold hover:underline transition-colors">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Graphic Side */}
      <div className="hidden lg:flex flex-1 relative rounded-[32px] overflow-hidden bg-gradient-to-b from-[#1C1E2D] via-[#2A3445] to-[#71859D]">
        {/* Deep inner shadow / vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] pointer-events-none z-20"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none z-20"></div>

        {/* Wireframe Globe grid effect */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-end justify-center overflow-hidden opacity-30 z-0">
          <svg viewBox="0 0 800 400" className="w-[120%] h-auto min-w-[800px] mb-[-10%] translate-y-[20%]">
            <g stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8">
              {/* Horizontal curves */}
              <path d="M-100,200 Q400,0 900,200" />
              <path d="M0,250 Q400,100 800,250" />
              <path d="M100,300 Q400,200 700,300" />
              <path d="M200,350 Q400,300 600,350" />
              <path d="M300,400 Q400,380 500,400" />
              
              {/* Vertical curves */}
              <path d="M400,-100 Q400,200 400,500" />
              <path d="M400,-100 Q300,200 200,500" />
              <path d="M400,-100 Q500,200 600,500" />
              <path d="M400,-100 Q200,200 0,500" />
              <path d="M400,-100 Q600,200 800,500" />
              <path d="M400,-100 Q50,200 -200,500" />
              <path d="M400,-100 Q750,200 1000,500" />
            </g>
          </svg>
        </div>

        {/* Glow effect in the center of the grid */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#93b3dc] rounded-[100%] blur-[120px] opacity-20 z-0"></div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <h1 className="text-[44px] leading-[1.1] font-medium text-white mb-20 tracking-tight text-balance max-w-[600px]">
            Join Workplace and Build<br/>Your Dream Team
          </h1>
          
          <div className="flex flex-col items-center">
            {/* Star Icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="mb-10 animate-pulse">
              <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
            </svg>

            {/* Glass button */}
            <Link to="/" className="px-8 py-3 rounded-full text-[15px] font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)] hover:bg-white/20 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
