import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, User, Shield, ChevronDown, Check } from 'lucide-react';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const fillDemoAdmin = () => setForm({ email: 'admin@f4.co', password: 'admin123', role: 'admin' });
  const fillDemoEmployee = () => setForm({ email: 'employee@f4.co', password: 'emp123', role: 'employee' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginIdOrEmail: form.email,
          password: form.password
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid credentials');
      
      localStorage.setItem('hrms_role', data.user.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white p-3 lg:p-5 gap-5">
      {/* Form Side */}
      <div className="w-full lg:w-[500px] xl:w-[560px] flex flex-col justify-center px-8 sm:px-12 lg:px-16 shrink-0 relative z-10">
        <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-start gap-3 mb-10">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain grayscale brightness-0 opacity-90" />
          </div>

          <h2 className="text-[36px] font-serif font-medium text-[var(--app-ink)] mb-2 tracking-tight">Sign in</h2>
          <p className="text-[15px] text-[var(--app-muted)] mb-10">Welcome back! Please enter your details.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-[13px] text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Login ID / Email</label>
              <input
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal"
                type="text"
                placeholder="OIJODO20220001 or you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Password</label>
              <input
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="mb-8 relative" ref={dropdownRef}>
              <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Sign in as</label>
              
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

            <button className="w-full flex items-center justify-center px-6 py-4 rounded-full text-[22px] font-serif bg-[#2D2E3E] text-white hover:bg-[#1f202b] shadow-lg transition-all mt-4" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-[14px] text-[var(--app-muted)] font-medium mt-10">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--app-ink)] font-bold hover:underline transition-colors">Sign Up</Link>
          </p>

          <div className="mt-8 border border-[rgba(0,0,0,0.06)] bg-[var(--app-soft)] rounded-[16px] p-5">
            <div className="text-[11px] font-bold text-[var(--app-muted)] uppercase tracking-widest mb-4 text-center">Quick Demo Access</div>
            <div className="flex gap-3">
              <button type="button" onClick={fillDemoAdmin} className="flex-1 py-2.5 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-[13px] font-bold text-[var(--app-ink)] shadow-sm hover:shadow hover:-translate-y-[1px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> Admin
              </button>
              <button type="button" onClick={fillDemoEmployee} className="flex-1 py-2.5 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-[13px] font-bold text-[var(--app-ink)] shadow-sm hover:shadow hover:-translate-y-[1px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <User className="w-4 h-4" /> Employee
              </button>
            </div>
          </div>
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
            <Link to="/signup" className="px-7 py-2.5 rounded-full text-[14.5px] font-medium text-white/90 bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] hover:bg-white/[0.08] hover:text-white transition-all duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
