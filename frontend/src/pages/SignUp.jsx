import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, User, Shield, ArrowRight, ArrowLeft, MailCheck, ChevronDown, Check } from 'lucide-react';

export default function SignUp() {
  const [form, setForm] = useState({ empId: '', name: '', email: '', password: '', confirm: '', role: 'employee' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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
                  <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="text" placeholder="John" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Last Name</label>
                  <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="text" placeholder="Doe" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} required />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Employee ID</label>
                <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="text" placeholder="EMP-001" value={form.empId || ''} onChange={e => setForm({ ...form, empId: e.target.value })} required />
              </div>
              <div className="mb-5">
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Email Address</label>
                <input className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="mb-8 relative" ref={dropdownRef}>
                <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">I am a...</label>
                
                {/* Custom Dropdown Trigger */}
                <div 
                  className={`w-full px-4 py-3 bg-white border ${dropdownOpen ? 'border-blue-600 ring-[4px] ring-blue-600/10' : 'border-[rgba(0,0,0,0.15)]'} rounded-xl cursor-pointer flex items-center justify-between transition-all`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="flex items-center gap-3 text-[var(--app-ink)] font-medium text-[15px]">
                    {form.role === 'admin' ? <Shield className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-[var(--app-muted)]" />}
                    <span>{form.role === 'admin' ? 'Admin / HR Officer' : 'Employee'}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--app-muted)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Custom Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[rgba(0,0,0,0.12)] rounded-xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.2)] overflow-hidden z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
                    <div 
                      className={`flex items-center justify-between px-4 py-3.5 hover:bg-[rgba(0,0,0,0.03)] cursor-pointer transition-colors border-b border-[rgba(0,0,0,0.04)] ${form.role === 'employee' ? 'bg-blue-50/50' : ''}`}
                      onClick={() => { setForm({ ...form, role: 'employee' }); setDropdownOpen(false); }}
                    >
                      <div className="flex items-center gap-3">
                        <User className={`w-4 h-4 ${form.role === 'employee' ? 'text-blue-600' : 'text-[var(--app-muted)]'}`} />
                        <span className={`text-[14.5px] font-medium ${form.role === 'employee' ? 'text-blue-700' : 'text-[var(--app-ink)]'}`}>Employee</span>
                      </div>
                      {form.role === 'employee' && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div 
                      className={`flex items-center justify-between px-4 py-3.5 hover:bg-[rgba(0,0,0,0.03)] cursor-pointer transition-colors ${form.role === 'admin' ? 'bg-blue-50/50' : ''}`}
                      onClick={() => { setForm({ ...form, role: 'admin' }); setDropdownOpen(false); }}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className={`w-4 h-4 ${form.role === 'admin' ? 'text-blue-600' : 'text-[var(--app-muted)]'}`} />
                        <span className={`text-[14.5px] font-medium ${form.role === 'admin' ? 'text-blue-700' : 'text-[var(--app-ink)]'}`}>Admin / HR Officer</span>
                      </div>
                      {form.role === 'admin' && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                )}
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
      <div className="hidden lg:flex flex-1 relative rounded-[28px] overflow-hidden bg-[#11131e] bg-gradient-to-br from-[#11131e] to-[#25324b]">
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,15,24,0.6)_100%)] z-10 pointer-events-none"></div>
        
        {/* Bottom subtle glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[#5d7c9f] rounded-full blur-[140px] opacity-30 z-0 pointer-events-none"></div>

        {/* Minimal Globe Grid */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] min-w-[900px] flex justify-center opacity-[0.25] mix-blend-screen pointer-events-none z-0 translate-y-[35%]">
          <svg viewBox="0 0 800 400" className="w-full h-auto" stroke="white" strokeWidth="0.8" fill="none">
            <g opacity="0.8">
              {/* Horizontal Rings */}
              <ellipse cx="400" cy="400" rx="380" ry="70" />
              <ellipse cx="400" cy="400" rx="380" ry="140" />
              <ellipse cx="400" cy="400" rx="380" ry="210" />
              <ellipse cx="400" cy="400" rx="380" ry="280" />
              {/* Vertical Arcs */}
              <path d="M20,400 A380,380 0 0,1 780,400" />
              <path d="M120,400 A280,380 0 0,1 680,400" />
              <path d="M220,400 A180,380 0 0,1 580,400" />
              <path d="M320,400 A80,380 0 0,1 480,400" />
              <line x1="400" y1="20" x2="400" y2="400" />
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-12 text-center">
          <h1 className="text-[40px] md:text-[46px] leading-[1.15] tracking-tight font-medium text-white mb-[72px] text-balance max-w-[550px]" style={{ fontFamily: 'Matter, sans-serif' }}>
            Build the Future of Your Team<br/>with Workplace
          </h1>
          
          <div className="flex flex-col items-center">
            {/* Elegant 4-point Star */}
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-[64px] animate-pulse">
              <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" fill="white" fillOpacity="0.95"/>
            </svg>

            {/* Premium Glass Button */}
            <Link to="/" className="px-7 py-2.5 rounded-full text-[14.5px] font-medium text-white/90 bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] hover:bg-white/[0.08] hover:text-white transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
