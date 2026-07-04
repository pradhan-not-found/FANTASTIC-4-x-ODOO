import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { EMPLOYEES, ATTENDANCE_TODAY, LEAVE_REQUESTS, DEPT_STATS } from '../data/mockData';
import { 
  Users, CheckCircle2, Clock, Wallet, Check, X, Bell,
  User as UserIcon, CalendarDays, History, ArrowRight, Sun, TrendingUp, CircleDot
} from 'lucide-react';

const role = localStorage.getItem('hrms_role') || 'admin';

function AdminDashboard() {
  const pending = LEAVE_REQUESTS.filter(l => l.status === 'pending');
  const present = ATTENDANCE_TODAY.filter(a => a.status === 'present').length;

  return (
    <div className="flex-1 p-8 max-w-[1300px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Sun className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] tracking-tight">Good morning, Souradeep</h1>
        </div>
          <p className="text-[13.5px] text-[var(--app-muted)]">Here's what's happening across your organization today.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-bold bg-[#171717] text-white hover:bg-black shadow-sm transition-all">
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Employees', val: EMPLOYEES.length, sub: <><TrendingUp className="w-3 h-3" /> 2 this month</>, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', subColor: 'text-green-600' },
          { label: 'Present Today', val: present, sub: <><TrendingUp className="w-3 h-3" /> {Math.round((present / EMPLOYEES.length) * 100)}% rate</>, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', subColor: 'text-green-600' },
          { label: 'Pending Leaves', val: pending.length, sub: <><CircleDot className="w-3 h-3" /> Needs review</>, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', subColor: 'text-[var(--app-muted)]' },
          { label: 'Monthly Payroll', val: '₹4.3L', sub: <><Check className="w-3 h-3" /> Processed</>, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50', subColor: 'text-green-600' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate group relative overflow-hidden">
              <div className={`w-10 h-10 rounded-md ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="text-[26px] font-bold text-[var(--app-ink)] leading-none mb-1 tracking-tight">{stat.val}</div>
              <div className="text-[12.5px] text-[var(--app-muted)] font-medium">{stat.label}</div>
              <div className={`text-[11.5px] font-medium mt-2 flex items-center gap-1 ${stat.subColor}`}>{stat.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Attendance */}
        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Today's Attendance</div>
              <div className="text-[12px] text-[var(--app-muted)] mt-0.5">July 4, 2026</div>
            </div>
            <a href="/attendance" className="text-[13px] text-[var(--app-ink)] font-bold hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="overflow-x-auto border border-[rgba(0,0,0,0.08)] rounded-xl">
            <table className="w-full text-[13.5px] text-left">
              <thead className="bg-[var(--app-soft)] border-b border-[rgba(0,0,0,0.08)]">
                <tr>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Check In</th>
                  <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                {ATTENDANCE_TODAY.map(a => (
                  <tr key={a.empId} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--app-ink)]">{a.name.split(' ')[0]}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--app-muted)] text-[12.5px]">{a.checkIn}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        a.status === 'present' ? 'bg-green-50 text-green-700 border-green-200' : 
                        a.status === 'absent' ? 'bg-red-50 text-red-700 border-red-200' : 
                        a.status === 'half-day' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Approvals */}
        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Leave Approvals</div>
              <div className="text-[12px] text-[var(--app-muted)] mt-0.5">{pending.length} pending review</div>
            </div>
            <a href="/leaves" className="text-[13px] text-[var(--app-ink)] font-bold hover:underline inline-flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map(l => (
              <div key={l.id} className="p-4 bg-[var(--app-soft)] rounded-xl border border-[rgba(0,0,0,0.06)] liquid-row">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-[13.5px] text-[var(--app-ink)]">{l.empName}</div>
                    <div className="text-[12px] text-[var(--app-muted)]">{l.type} · {l.days} day{l.days > 1 ? 's' : ''}</div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
                </div>
                <div className="text-[12px] text-[var(--app-muted)] mb-3">{l.from} → {l.to}</div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-bold bg-white text-green-700 border border-[rgba(0,0,0,0.12)] hover:bg-green-50 transition-colors shadow-sm inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-bold bg-white text-red-700 border border-[rgba(0,0,0,0.12)] hover:bg-red-50 transition-colors shadow-sm inline-flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
            {pending.length === 0 && <div className="py-8 flex flex-col items-center justify-center text-center"><CheckCircle2 className="w-8 h-8 text-[var(--app-muted)] opacity-50 mb-3" /><p className="text-[13px] text-[var(--app-muted)] font-medium">No pending requests</p></div>}
          </div>
        </div>
      </div>

      {/* Department overview */}
      <div className="liquid-card-shell rounded-[18px] p-6 mt-6 card-elevate">
        <div className="mb-5">
          <div className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Department Overview</div>
          <div className="text-[12px] text-[var(--app-muted)] mt-0.5">Today's presence by team</div>
        </div>
        <div className="flex flex-col gap-4">
          {DEPT_STATS.map(d => (
            <div key={d.dept} className="flex items-center gap-4">
              <div className="min-w-[110px] text-[13px] font-semibold text-[var(--app-muted)]">{d.dept}</div>
              <div className="flex-1 h-2 bg-[var(--app-hairline)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${d.present === d.count ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${(d.present / d.count) * 100}%` }} />
              </div>
              <div className="text-[12px] text-[var(--app-muted)] min-w-[72px] text-right">{d.present}/{d.count} present</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  return (
    <div className="flex-1 p-8 max-w-[1300px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Sun className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] tracking-tight">Good morning, Souradeep</h1>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-bold bg-[#171717] text-white hover:bg-black shadow-sm transition-all">
          Request Leave
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Days Present (June)', val: '22', sub: <><TrendingUp className="w-3 h-3" /> 95.6% attendance</>, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', subColor: 'text-green-600' },
          { label: 'Leave Balance', val: '8', sub: '3 Paid · 2 Sick · 3 Unpaid', icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50', subColor: 'text-[var(--app-muted)]' },
          { label: 'Net Salary (June)', val: '₹90.3K', sub: <><Check className="w-3 h-3" /> Credited</>, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', subColor: 'text-green-600' },
          { label: 'Today\'s Check-In', val: '09:05', sub: <><CircleDot className="w-3 h-3 text-green-500" /> Active now</>, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', subColor: 'text-green-600' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate group">
              <div className={`w-10 h-10 rounded-md ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="text-[26px] font-bold text-[var(--app-ink)] leading-none mb-1 tracking-tight">{stat.val}</div>
              <div className="text-[12.5px] text-[var(--app-muted)] font-medium">{stat.label}</div>
              <div className={`text-[11.5px] font-medium mt-2 flex items-center gap-1 ${stat.subColor}`}>{stat.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: UserIcon,     label: 'My Profile',    desc: 'View & update your info',     href: '/profile',    color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: History,      label: 'Attendance',     desc: 'Check your logs & hours',     href: '/attendance', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: CalendarDays, label: 'Leave Requests', desc: 'Apply & track your leaves',   href: '/leaves',     color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: Wallet,       label: 'Payroll',        desc: 'View your salary breakdown',  href: '/payroll',    color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map(c => {
          const Icon = c.icon;
          return (
            <a key={c.label} href={c.href} className="liquid-card-shell rounded-[18px] p-4 flex items-center gap-4 card-elevate group no-underline text-inherit cursor-pointer">
              <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-bold text-[14px] text-[var(--app-ink)] mb-0.5 tracking-tight group-hover:text-blue-600 transition-colors">{c.label}</div>
                <div className="text-[12.5px] text-[var(--app-muted)]">{c.desc}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen apple-inset">
        <Topbar title="Dashboard" subtitle={role === 'admin' ? 'Admin Overview' : 'Employee Portal'} />
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
        </div>
      </div>
    </div>
  );
}
