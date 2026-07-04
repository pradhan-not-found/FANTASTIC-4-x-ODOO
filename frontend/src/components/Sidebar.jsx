import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const NAV_EMPLOYEE = [
  { label: 'Main', items: [
    { to: '/dashboard',  icon: '📊', label: 'Dashboard'      },
    { to: '/profile',    icon: '👤', label: 'My Profile'     },
    { to: '/attendance', icon: '🕐', label: 'Attendance'     },
    { to: '/leaves',     icon: '🌴', label: 'Leave Requests' },
    { to: '/payroll',    icon: '💰', label: 'Payroll'        },
  ]},
];

const NAV_ADMIN = [
  { label: 'Overview', items: [
    { to: '/dashboard',  icon: '📊', label: 'Dashboard' },
  ]},
  { label: 'HR Management', items: [
    { to: '/employees',  icon: '👥', label: 'Employees'       },
    { to: '/attendance', icon: '🕐', label: 'Attendance'      },
    { to: '/leaves',     icon: '🌴', label: 'Leave Approvals', badge: 2 },
    { to: '/payroll',    icon: '💰', label: 'Payroll'         },
  ]},
  { label: 'Account', items: [
    { to: '/profile',    icon: '👤', label: 'My Profile' },
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
    <aside className="w-64 h-screen fixed left-0 top-0 bg-transparent flex flex-col z-[100] overflow-y-auto">
      <div className="flex items-center gap-3 px-6 py-5 h-[60px]">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white text-sm shrink-0">
          W
        </div>
        <div className="flex flex-col leading-[1.1]">
          <span className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">WorkAlign</span>
          <span className="text-[11px] text-[var(--app-muted)]">HR System</span>
        </div>
      </div>

      <div className="px-6 py-4 flex items-center gap-3 bg-transparent">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[13px] text-blue-700 shrink-0 border border-blue-200">
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
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--app-muted)] px-3 pb-2">
              {section.label}
            </div>
            {section.items.map(item => {
              const active = location.pathname === item.to;
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
                  <span className="w-5 h-5 flex items-center justify-center text-[15px] shrink-0">{item.icon}</span>
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 w-full text-red-600 hover:bg-red-50"
        >
          <span className="w-5 h-5 flex items-center justify-center text-[15px] shrink-0">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
