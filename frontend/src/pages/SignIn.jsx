import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, User, Shield, ArrowRight } from 'lucide-react';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fillDemoAdmin = () => setForm({ email: 'admin@f4.co', password: 'admin123', role: 'admin' });
  const fillDemoEmployee = () => setForm({ email: 'employee@f4.co', password: 'emp123', role: 'employee' });

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
              <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Email Address</label>
              <input
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.15)] rounded-xl text-[var(--app-ink)] text-[15px] font-medium focus:border-blue-600 focus:ring-[4px] focus:ring-blue-600/10 transition-all outline-none placeholder:text-[var(--app-muted)] placeholder:font-normal"
                type="email"
                placeholder="you@company.com"
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

            <div className="mb-8 relative">
              <label className="block text-[13px] font-bold text-[var(--app-muted)] mb-2 tracking-tight">Sign in as</label>
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
            Build the Future of Your Team<br/>with Workplace
          </h1>
          
          <div className="flex flex-col items-center">
            {/* Star Icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="mb-10 animate-pulse">
              <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
            </svg>

            {/* Glass button */}
            <Link to="/signup" className="px-8 py-3 rounded-full text-[15px] font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)] hover:bg-white/20 transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
