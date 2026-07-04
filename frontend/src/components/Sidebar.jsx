import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  CalendarDays, 
  Wallet, 
  Users, 
  LogOut,
  ShieldAlert
} from 'lucide-react';

const NAV_EMPLOYEE = [
  { label: 'Main', items: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'      },
    { to: '/profile',    icon: User,            label: 'My Profile'     },
    { to: '/attendance', icon: Clock,           label: 'Attendance'     },
    { to: '/leaves',     icon: CalendarDays,    label: 'Leave Requests' },
    { to: '/payroll',    icon: Wallet,          label: 'Payroll'        },
  ]},
];

const NAV_ADMIN = [
  { label: 'Overview', items: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { label: 'HR Management', items: [
    { to: '/employees',  icon: Users,           label: 'Employees'       },
    { to: '/attendance', icon: Clock,           label: 'Attendance'      },
    { to: '/leaves',     icon: CalendarDays,    label: 'Leave Approvals', badge: 2 },
    { to: '/payroll',    icon: Wallet,          label: 'Payroll'         },
  ]},
  { label: 'Account', items: [
    { to: '/profile',    icon: User,            label: 'My Profile' },
  ]},
];

export default function Sidebar({ role = 'admin' }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const nav = role === 'admin' ? NAV_ADMIN : NAV_EMPLOYEE;

  const handleLogout = () => {
    localStorage.removeItem('hrms_role');
    navigate('/');
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-transparent flex flex-col z-[100] overflow-y-auto border-r border-[rgba(0,0,0,0.06)] bg-white/50 backdrop-blur-md">
      <div className="flex items-center justify-center py-6 h-[72px] mt-4 mb-2">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto max-w-[200px] object-contain shrink-0 grayscale brightness-0 opacity-90" />
      </div>

      <div className="px-6 py-4 flex items-center gap-3 bg-transparent">
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center font-bold text-[13px] text-blue-600 shrink-0 border border-blue-100">
          SP
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <strong className="text-[13px] font-semibold text-[var(--app-ink)] truncate">Souradeep P.</strong>
          <span className="text-[11px] text-blue-600 font-semibold uppercase tracking-widest">{role === 'admin' ? 'Admin' : 'Employee'}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        {nav.map(section => (
          <div key={section.label} className="mb-4">
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] px-3 pb-2 opacity-80">
              {section.label}
            </div>
            {section.items.map(item => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 mb-0.5 w-full apple-sidebar-item",
                    active 
                      ? "apple-active-item" 
                      : "text-[var(--app-muted)] hover:bg-[var(--app-soft)] hover:text-[var(--app-ink)]"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-80" strokeWidth={2.2} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 w-full text-[var(--app-muted)] hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 shrink-0 opacity-80" strokeWidth={2.2} />
          Logout
        </button>
      </div>
    </aside>
  );
}
