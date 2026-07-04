import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { 
  Users, CheckCircle2, Clock, Wallet, Check, X, Bell,
  User as UserIcon, CalendarDays, History, ArrowRight, Sun, TrendingUp, CircleDot
} from 'lucide-react';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');
  const firstName = user.name ? user.name.split(' ')[0] : 'Admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, attRes, leavesRes] = await Promise.all([
          fetch('http://localhost:3000/api/employees'),
          fetch('http://localhost:3000/api/attendance/today'),
          fetch('http://localhost:3000/api/leaves')
        ]);
        if (empRes.ok) setEmployees(await empRes.json());
        if (attRes.ok) setAttendanceToday(await attRes.json());
        if (leavesRes.ok) setLeaveRequests(await leavesRes.json());
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const presentCount = attendanceToday.filter(a => a.status === 'present').length;

  const deptStatsMap = {};
  employees.forEach(emp => {
    if (!deptStatsMap[emp.department]) {
      deptStatsMap[emp.department] = { dept: emp.department, count: 0, present: 0 };
    }
    deptStatsMap[emp.department].count++;
  });
  attendanceToday.forEach(att => {
    const emp = employees.find(e => e.id === att.empId);
    if (emp && att.status === 'present') {
      if (deptStatsMap[emp.department]) deptStatsMap[emp.department].present++;
    }
  });
  const DEPT_STATS = Object.values(deptStatsMap);

  return (
    <div className="flex-1 p-8 max-w-[1300px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
            <h1 className="text-[22px] font-bold text-[var(--app-ink)] tracking-tight">Good morning, {firstName}</h1>
          </div>
          <p className="text-[13.5px] text-[var(--app-muted)]">Here's what's happening across your organization today.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-bold bg-[#171717] text-white hover:bg-black shadow-sm transition-all">
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Employees', val: employees.length, sub: <><TrendingUp className="w-3 h-3" /> New this month</>, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', subColor: 'text-green-600' },
          { label: 'Present Today', val: presentCount, sub: <><TrendingUp className="w-3 h-3" /> {employees.length ? Math.round((presentCount / employees.length) * 100) : 0}% rate</>, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', subColor: 'text-green-600' },
          { label: 'Pending Leaves', val: pendingLeaves.length, sub: <><CircleDot className="w-3 h-3" /> Needs review</>, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', subColor: 'text-[var(--app-muted)]' },
          { label: 'Monthly Payroll', val: 'Processed', sub: <><Check className="w-3 h-3" /> Up to date</>, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50', subColor: 'text-green-600' }
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
              <div className="text-[12px] text-[var(--app-muted)] mt-0.5">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
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
                {attendanceToday.slice(0,5).map(a => {
                  const emp = employees.find(e => e.id === a.empId);
                  return (
                  <tr key={a.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--app-ink)]">{emp ? emp.name.split(' ')[0] : a.empId}</td>
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
                )})}
                {attendanceToday.length === 0 && (
                  <tr><td colSpan="3" className="py-8 text-center text-[13px] text-[var(--app-muted)]">No attendance records today</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Approvals */}
        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Leave Approvals</div>
              <div className="text-[12px] text-[var(--app-muted)] mt-0.5">{pendingLeaves.length} pending review</div>
            </div>
            <a href="/leaves" className="text-[13px] text-[var(--app-ink)] font-bold hover:underline inline-flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {pendingLeaves.slice(0, 4).map(l => {
              const emp = employees.find(e => e.id === l.empId);
              return (
              <div key={l.id} className="p-4 bg-[var(--app-soft)] rounded-xl border border-[rgba(0,0,0,0.06)] liquid-row">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-[13.5px] text-[var(--app-ink)]">{emp ? emp.name : l.empId}</div>
                    <div className="text-[12px] text-[var(--app-muted)]">{l.type} · {l.days} day{l.days > 1 ? 's' : ''}</div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
                </div>
                <div className="text-[12px] text-[var(--app-muted)] mb-3">{l.fromDate} → {l.toDate}</div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-bold bg-white text-green-700 border border-[rgba(0,0,0,0.12)] hover:bg-green-50 transition-colors shadow-sm inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-bold bg-white text-red-700 border border-[rgba(0,0,0,0.12)] hover:bg-red-50 transition-colors shadow-sm inline-flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            )})}
            {pendingLeaves.length === 0 && <div className="py-8 flex flex-col items-center justify-center text-center"><CheckCircle2 className="w-8 h-8 text-[var(--app-muted)] opacity-50 mb-3" /><p className="text-[13px] text-[var(--app-muted)] font-medium">No pending requests</p></div>}
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
                <div className={`h-full rounded-full transition-all duration-500 ${d.present === d.count ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${d.count > 0 ? (d.present / d.count) * 100 : 0}%` }} />
              </div>
              <div className="text-[12px] text-[var(--app-muted)] min-w-[72px] text-right">{d.present}/{d.count} present</div>
            </div>
          ))}
          {DEPT_STATS.length === 0 && <div className="text-[13px] text-[var(--app-muted)] py-4">No department data available.</div>}
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');
  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    if (!user.id) return;
    const fetchData = async () => {
      try {
        const [attRes, leavesRes, payrollRes] = await Promise.all([
          fetch(`http://localhost:3000/api/attendance/${user.id}`),
          fetch(`http://localhost:3000/api/leaves/${user.id}`),
          fetch(`http://localhost:3000/api/payroll/${user.id}`)
        ]);
        if (attRes.ok) setAttendance(await attRes.json());
        if (leavesRes.ok) setLeaves(await leavesRes.json());
        if (payrollRes.ok) setPayroll(await payrollRes.json());
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, [user.id]);

  const presentDays = attendance.filter(a => a.status === 'present').length;
  
  // Calculate basic leave balance (assuming 15 total allowed for simplicity)
  const approvedLeaves = leaves.filter(l => l.status === 'Approved').reduce((acc, l) => acc + (l.days || 1), 0);
  const leaveBalance = Math.max(15 - approvedLeaves, 0);

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendance.find(a => a.date === today);

  return (
    <div className="flex-1 p-8 max-w-[1300px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
            <h1 className="text-[22px] font-bold text-[var(--app-ink)] tracking-tight">Good morning, {firstName}</h1>
          </div>
          <p className="text-[13.5px] text-[var(--app-muted)]">Welcome back to your employee portal.</p>
        </div>
        <Link to="/leaves" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-bold bg-[#171717] text-white hover:bg-black shadow-sm transition-all">
          Request Leave
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Days Present (This Month)', val: presentDays, sub: <><TrendingUp className="w-3 h-3" /> Tracked</>, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', subColor: 'text-green-600' },
          { label: 'Leave Balance', val: leaveBalance, sub: `${approvedLeaves} used so far`, icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50', subColor: 'text-[var(--app-muted)]' },
          { label: 'Net Salary', val: payroll.length > 0 ? payroll[0].netSalary : 'Pending', sub: <><Check className="w-3 h-3" /> Most recent</>, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', subColor: 'text-green-600' },
          { label: 'Today\'s Check-In', val: todaysAttendance ? todaysAttendance.checkIn : 'Not yet', sub: todaysAttendance ? <><CircleDot className="w-3 h-3 text-green-500" /> Active now</> : 'Pending check-in', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', subColor: todaysAttendance ? 'text-green-600' : 'text-amber-600' }
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
  const role = localStorage.getItem('hrms_role') || 'admin';

  return (
    <>
      <Topbar title="Dashboard" subtitle={role === 'admin' ? 'Admin Overview' : 'Employee Portal'} />
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
      </div>
    </>
  );
}
