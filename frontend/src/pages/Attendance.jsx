import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ATTENDANCE_TODAY, EMPLOYEES } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';

function AdminAttendance() {
  const presentCount = ATTENDANCE_TODAY.filter(a => a.status === 'present').length;
  const absentCount = ATTENDANCE_TODAY.filter(a => a.status === 'absent').length;

  return (
    <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Attendance Logs</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Monitor daily employee presence and time tracking.</p>
        </div>
        <div className="flex gap-3">
          <input type="date" defaultValue="2026-07-04" className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13px] bg-white text-[var(--app-ink)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
          <button className="px-4 py-2 rounded-lg text-[13.5px] font-medium bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Employees', val: EMPLOYEES.length, color: 'text-blue-600' },
          { label: 'Present Today', val: presentCount, color: 'text-green-600' },
          { label: 'Absent Today', val: absentCount, color: 'text-red-600' },
          { label: 'On Leave', val: EMPLOYEES.length - presentCount - absentCount, color: 'text-amber-600' }
        ].map((stat, i) => (
          <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate text-center">
            <div className={`text-[28px] font-bold ${stat.color} leading-none mb-2 tracking-tight`}>{stat.val}</div>
            <div className="text-[12.5px] font-semibold uppercase tracking-widest text-[var(--app-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="liquid-card-shell rounded-[18px] overflow-hidden card-elevate">
        <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] flex justify-between items-center">
          <div className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">Today's Logs</div>
          <input type="text" placeholder="Search employee..." className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white w-[200px] outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] text-left">
            <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <tr>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Check In</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Check Out</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {ATTENDANCE_TODAY.map(a => (
                <tr key={a.empId} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{a.name}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{a.checkIn}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{a.checkOut || '-'}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
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
    </div>
  );
}

function EmployeeAttendance() {
  return (
    <div className="flex-1 p-8 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">My Attendance</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">View your daily logs and check-in times.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-green-600 text-white hover:bg-green-700 shadow-sm transition-all border border-green-700">
            ✓ Check In Now
          </button>
        </div>
      </div>

      <div className="liquid-card-shell rounded-[18px] p-6 card-elevate mb-8 flex items-center justify-between flex-wrap gap-6 border-l-4 border-l-green-500">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Today's Status</div>
          <div className="text-[22px] font-bold text-[var(--app-ink)] tracking-tight">Checked In at 09:05 AM</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Hours Logged</div>
          <div className="text-[22px] font-bold text-blue-600 tracking-tight font-mono">02:15:30</div>
        </div>
      </div>

      <div className="liquid-card-shell rounded-[18px] overflow-hidden card-elevate">
        <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] flex justify-between items-center">
          <div className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">Recent Logs</div>
          <select className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white outline-none cursor-pointer">
            <option>July 2026</option>
            <option>June 2026</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] text-left">
            <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <tr>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Date</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Check In</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Check Out</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Hours</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {[
                { date: 'Jul 4', in: '09:05 AM', out: '-', hrs: '-', stat: 'present' },
                { date: 'Jul 3', in: '08:58 AM', out: '06:05 PM', hrs: '9h 7m', stat: 'present' },
                { date: 'Jul 2', in: '09:12 AM', out: '05:30 PM', hrs: '8h 18m', stat: 'present' },
                { date: 'Jul 1', in: '-', out: '-', hrs: '0h', stat: 'absent' },
              ].map(r => (
                <tr key={r.date} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{r.date}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{r.in}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{r.out}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-ink)] text-[12.5px] font-semibold">{r.hrs}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
                      r.stat === 'present' ? 'bg-green-50 text-green-700 border-green-200' : 
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {r.stat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Attendance() {
  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen apple-inset">
        <Topbar title="Attendance" subtitle="Time and presence tracking" />
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {role === 'admin' ? <AdminAttendance /> : <EmployeeAttendance />}
        </div>
      </div>
    </div>
  );
}
