import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, User, Clock, CalendarDays, Wallet, Users, LogOut,
  Bell, Building2, MessageSquare, Settings, ChevronUp, PanelLeftClose
} from 'lucide-react';

const NAV_EMPLOYEE = [
  { label: 'HR Management', items: [
    { to: '/attendance', icon: Clock,           label: 'Attendance'     },
    { to: '/leaves',     icon: CalendarDays,    label: 'Time Off'       },
    { to: '/payroll',    icon: Wallet,          label: 'Payroll'        },
  ]},
  { label: 'Communication', items: [
    { to: '/notices',    icon: Bell,            label: 'Notice Board'   },
  ]},
  { label: 'Account', items: [
    { to: '/profile',    icon: User,            label: 'My Profile'     },
  ]},
];

const NAV_ADMIN = [
  { label: 'HR Management', items: [
    { to: '/employees',  icon: Users,           label: 'Employees'       },
    { to: '/attendance', icon: Clock,           label: 'Attendance'      },
    { to: '/leaves',     icon: CalendarDays,    label: 'Time Off', badge: 2 },
    { to: '/payroll',    icon: Wallet,          label: 'Payroll'         },
  ]},
  { label: 'Communication', items: [
    { to: '/notices',    icon: Bell,            label: 'Notice Board' },
  ]},
  { label: 'Account', items: [
    { to: '/profile',    icon: User,            label: 'My Profile' },
  ]},
];

export default function Sidebar({ role = 'admin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const nav = role === 'admin' ? NAV_ADMIN : NAV_EMPLOYEE;

  const getUser = () => JSON.parse(localStorage.getItem('hrms_user') || '{}');
  const [user, setUser] = useState(getUser);

  useEffect(() => {
    const onStorage = () => setUser(getUser());
    window.addEventListener('storage', onStorage);
    // Poll every 2s so avatar updates from Profile page are reflected immediately
    const interval = setInterval(() => setUser(getUser()), 2000);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(interval); };
  }, []);

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  const handleLogout = () => {
    localStorage.removeItem('hrms_role');
    localStorage.removeItem('hrms_user');
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 h-screen flex z-[100] bg-[var(--app-canvas)]">
      
      {/* Primary Sidebar (Thin) */}
      <aside className="w-[72px] h-full bg-white border-r border-[rgba(0,0,0,0.06)] flex flex-col items-center pt-6 pb-5 gap-6 shrink-0 relative z-10 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        
        {/* Global Nav */}
        <div className="flex-1 flex flex-col items-center gap-4 w-full px-2 mt-2">
          <Link to="/dashboard" className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm border group relative", location.pathname === '/dashboard' ? "bg-pink-50 text-pink-600 border-pink-100" : "bg-white text-[var(--app-muted)] hover:text-[var(--app-ink)] border-transparent hover:bg-[var(--app-soft)]")}>
            <Building2 className="w-[20px] h-[20px]" strokeWidth={2.2} />
          </Link>
          <Link to="/notices" className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm border group relative", location.pathname === '/notices' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-[var(--app-muted)] hover:text-[var(--app-ink)] border-transparent hover:bg-[var(--app-soft)]")}>
            <MessageSquare className="w-[20px] h-[20px]" strokeWidth={2.2} />
          </Link>
          <Link to="/profile" className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm border group relative", location.pathname === '/profile' ? "bg-green-50 text-green-600 border-green-100" : "bg-white text-[var(--app-muted)] hover:text-[var(--app-ink)] border-transparent hover:bg-[var(--app-soft)]")}>
            <Settings className="w-[20px] h-[20px]" strokeWidth={2.2} />
          </Link>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          <div className="w-5 h-5 rounded-full border-[2.5px] border-green-500 bg-white shadow-sm"></div>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden cursor-pointer border border-[rgba(0,0,0,0.08)] shadow-sm hover:shadow-md transition-all shrink-0">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-700 font-bold text-[13px]">{initials}</div>
            }
          </Link>
        </div>
      </aside>

      {/* Secondary Sidebar (Wide) */}
      <aside className="w-[240px] h-full bg-[#fafafa] flex flex-col overflow-y-auto border-r border-[rgba(0,0,0,0.06)] shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center justify-between mb-6 px-1">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <img src="/logo.png" className="h-[28px] w-auto object-contain brightness-0 opacity-90" alt="Logo" />
            </Link>
            <button className="p-1.5 rounded-md border border-[rgba(0,0,0,0.08)] text-[var(--app-muted)] hover:text-[var(--app-ink)] hover:bg-white shadow-sm transition-colors">
              <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <Link 
            to="/dashboard" 
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition-all mb-4",
              location.pathname === '/dashboard' ? "bg-[rgba(0,0,0,0.05)] text-[var(--app-ink)] shadow-sm border border-[rgba(0,0,0,0.04)]" : "text-[var(--app-muted)] hover:bg-[rgba(0,0,0,0.03)] hover:text-[var(--app-ink)]"
            )}
          >
             <LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={2.2} />
             Home
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
          {nav.map(section => (
            <div key={section.label} className="mb-6">
              <div className="flex items-center justify-between px-2 pb-2 mb-1 opacity-80 cursor-default group">
                <span className="text-[12.5px] font-semibold tracking-wide text-[var(--app-muted)]">
                  {section.label}
                </span>
                <ChevronUp className="w-3.5 h-3.5 text-[var(--app-muted)]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map(item => {
                  const active = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13.5px] font-medium transition-all duration-200 w-full group",
                        active 
                          ? "bg-[rgba(0,0,0,0.04)] text-[var(--app-ink)]" 
                          : "text-[var(--app-muted)] hover:bg-[rgba(0,0,0,0.02)] hover:text-[var(--app-ink)]"
                      )}
                    >
                      <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active ? "text-[var(--app-ink)]" : "text-[var(--app-muted)] group-hover:text-[var(--app-ink)]")} strokeWidth={2.2} />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto bg-[rgba(0,0,0,0.05)] text-[var(--app-ink)] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center border border-[rgba(0,0,0,0.04)]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(0,0,0,0.06)]">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-[10px] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-[rgba(0,0,0,0.08)] shrink-0">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-700 font-bold text-[11px]">{initials}</div>
              }
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[var(--app-ink)] truncate">{user.name || 'User'}</div>
              <div className="text-[11px] text-[var(--app-muted)] truncate">{user.email || ''}</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition-all duration-200 w-full text-[var(--app-muted)] hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2.2} />
            Logout
          </button>
        </div>
      </aside>

    </div>
  );
}
