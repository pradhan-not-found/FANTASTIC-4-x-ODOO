import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';

// Calculate hours difference between two "HH:MM" strings
function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  const diffMins = (outH * 60 + outM) - (inH * 60 + inM);
  if (diffMins <= 0) return null;
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return `${h}h ${m}m`;
}

function AdminAttendance() {
  const [viewMode, setViewMode] = useState('daily');
  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          fetch('http://localhost:3000/api/employees'),
          fetch('http://localhost:3000/api/attendance/today')
        ]);
        if (empRes.ok) setEmployees(await empRes.json());
        if (attRes.ok) setAttendanceToday(await attRes.json());
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const presentCount = attendanceToday.filter(a => a.status === 'present').length;
  const absentCount = attendanceToday.filter(a => a.status === 'absent').length;

  return (
    <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Attendance Logs</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Monitor daily employee presence and time tracking.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-[rgba(0,0,0,0.04)] p-1 rounded-lg">
            <button onClick={() => setViewMode('daily')} className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${viewMode === 'daily' ? 'bg-white text-[var(--app-ink)] shadow-sm' : 'text-[var(--app-muted)] hover:text-[var(--app-ink)]'}`}>Daily</button>
            <button onClick={() => setViewMode('weekly')} className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${viewMode === 'weekly' ? 'bg-white text-[var(--app-ink)] shadow-sm' : 'text-[var(--app-muted)] hover:text-[var(--app-ink)]'}`}>Weekly</button>
          </div>
          <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13px] bg-white text-[var(--app-ink)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
          <button className="px-4 py-2 rounded-lg text-[13.5px] font-medium bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Employees', val: employees.length, color: 'text-blue-600' },
          { label: 'Present Today', val: presentCount, color: 'text-green-600' },
          { label: 'Absent Today', val: absentCount, color: 'text-red-600' },
          { label: 'On Leave', val: employees.length - presentCount - absentCount, color: 'text-amber-600' }
        ].map((stat, i) => (
          <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate text-center">
            <div className={`text-[28px] font-bold ${stat.color} leading-none mb-2 tracking-tight`}>{stat.val}</div>
            <div className="text-[12.5px] font-semibold uppercase tracking-widest text-[var(--app-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="liquid-card-shell rounded-[18px] overflow-hidden card-elevate">
        <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] flex justify-between items-center">
          <div className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">
            {viewMode === 'daily' ? "Today's Logs" : "This Week's Summary"}
          </div>
          <input type="text" placeholder="Search employee..." className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white w-[200px] outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="overflow-x-auto">
          {viewMode === 'daily' ? (
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
                {attendanceToday.map(a => {
                  const emp = employees.find(e => e.id === a.empId);
                  return (
                  <tr key={a.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{emp ? emp.name : a.empId}</td>
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
                )})}
                {attendanceToday.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-[13px] text-[var(--app-muted)]">No attendance records found for today.</td></tr>}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-[13.5px] text-left">
              <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
                <tr>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Mon</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Tue</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Wed</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Thu</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Fri</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{emp.name}</td>
                    {[1,2,3,4,5].map(day => (
                      <td key={day} className="py-3.5 px-5">
                        <div className={`w-3 h-3 rounded-full mx-auto ${Math.random() > 0.15 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </td>
                    ))}
                    <td className="py-3.5 px-5 font-mono text-[var(--app-ink)] text-[13px] font-bold text-right">{Math.floor(35 + Math.random() * 5)}h</td>
                  </tr>
                ))}
                {employees.length === 0 && <tr><td colSpan="7" className="py-8 text-center text-[13px] text-[var(--app-muted)]">No employees found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeAttendance() {
  const [viewMode, setViewMode] = useState('daily');
  const [myAttendance, setMyAttendance] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  useEffect(() => {
    if (!user.id) return;
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/attendance/${user.id}`);
        if (res.ok) setMyAttendance(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttendance();
  }, [user.id]);

  const handleCheckIn = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/attendance/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId: user.id })
      });
      if (response.ok) {
        alert('Checked in successfully!');
        window.location.reload();
      } else {
        alert('Failed to check in');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to check in');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/attendance/checkout/${id}`, {
        method: 'PUT'
      });
      if (response.ok) {
        alert('Checked out successfully!');
        window.location.reload();
      } else {
        alert('Failed to check out');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to check out');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = myAttendance.find(a => a.date === today);

  return (
    <div className="flex-1 p-8 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">My Attendance</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">View your daily logs and check-in times.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-[rgba(0,0,0,0.04)] p-1 rounded-lg mr-2">
            <button onClick={() => setViewMode('daily')} className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${viewMode === 'daily' ? 'bg-white text-[var(--app-ink)] shadow-sm' : 'text-[var(--app-muted)] hover:text-[var(--app-ink)]'}`}>Daily</button>
            <button onClick={() => setViewMode('weekly')} className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${viewMode === 'weekly' ? 'bg-white text-[var(--app-ink)] shadow-sm' : 'text-[var(--app-muted)] hover:text-[var(--app-ink)]'}`}>Weekly</button>
          </div>
          {!todaysAttendance ? (
            <button onClick={handleCheckIn} className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-green-600 text-white hover:bg-green-700 shadow-sm transition-all border border-green-700">
              ✓ Check In Now
            </button>
          ) : !todaysAttendance.checkOut ? (
            <button onClick={() => handleCheckOut(todaysAttendance.id)} className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all border border-amber-700">
              ✓ Check Out Now
            </button>
          ) : (
            <button disabled className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-gray-300 text-gray-600 shadow-sm transition-all border border-gray-300 cursor-not-allowed">
              ✓ Completed for Today
            </button>
          )}
        </div>
      </div>

      {todaysAttendance && (
        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate mb-8 flex items-center justify-between flex-wrap gap-6 border-l-4 border-l-green-500">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Today's Status</div>
            <div className="text-[22px] font-bold text-[var(--app-ink)] tracking-tight">
              {todaysAttendance.checkOut ? `Checked Out at ${todaysAttendance.checkOut}` : `Checked In at ${todaysAttendance.checkIn}`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Hours Logged</div>
            <div className="text-[22px] font-bold text-blue-600 tracking-tight font-mono">
              {todaysAttendance.checkOut
                ? calcHours(todaysAttendance.checkIn, todaysAttendance.checkOut)
                : (() => {
                    const [inH, inM] = todaysAttendance.checkIn.split(':').map(Number);
                    const now = new Date();
                    const diffMins = (now.getHours() * 60 + now.getMinutes()) - (inH * 60 + inM);
                    if (diffMins <= 0) return '0h 0m';
                    return `${Math.floor(diffMins/60)}h ${diffMins%60}m`;
                  })()
              }
            </div>
          </div>
        </div>
      )}

      <div className="liquid-card-shell rounded-[18px] overflow-hidden card-elevate">
        <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] flex justify-between items-center">
          <div className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">
            {viewMode === 'daily' ? "Recent Logs" : "This Week's Breakdown"}
          </div>
          <select className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white outline-none cursor-pointer">
            <option>July 2026</option>
            <option>June 2026</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {viewMode === 'daily' ? (
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
                {myAttendance.slice().reverse().map((r, idx) => (
                  <tr key={idx} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{r.date}</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{r.checkIn}</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{r.checkOut || '-'}</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--app-ink)] text-[12.5px] font-semibold">{calcHours(r.checkIn, r.checkOut) || (r.checkOut ? '-' : '–')}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
                        r.status === 'present' ? 'bg-green-50 text-green-700 border-green-200' : 
                        r.status === 'half-day' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myAttendance.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-[13px] text-[var(--app-muted)]">No attendance records found.</td></tr>}
              </tbody>
            </table>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="flex-1 bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-5 shadow-sm">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Total Hours</div>
                  <div className="text-[24px] font-mono font-bold text-[var(--app-ink)]">-</div>
                  <div className="text-[12.5px] text-[var(--app-muted)] mt-1">N/A</div>
                </div>
                <div className="flex-1 bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-5 shadow-sm">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Days Present</div>
                  <div className="text-[24px] font-mono font-bold text-[var(--app-ink)]">{myAttendance.filter(a => a.status === 'present').length}</div>
                  <div className="text-[12.5px] text-[var(--app-muted)] mt-1">This month</div>
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-[var(--app-ink)] mb-4">Daily Breakdown</h3>
              <div className="flex flex-col gap-3">
                {myAttendance.slice(-5).reverse().map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.04)] hover:bg-white hover:shadow-sm transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${r.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="font-semibold text-[13.5px] text-[var(--app-ink)] w-24">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-[13px] text-[var(--app-muted)]">{r.date}</div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="font-mono text-[13px] text-[var(--app-muted)]">{r.checkIn} — {r.checkOut || '?'}</div>
                      <div className="font-mono text-[14px] font-bold text-[var(--app-ink)] w-12 text-right">{calcHours(r.checkIn, r.checkOut) || '-'}</div>
                    </div>
                  </div>
                ))}
                {myAttendance.length === 0 && <div className="text-center text-[13px] text-[var(--app-muted)]">No recent logs</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Attendance() {
  const role = localStorage.getItem('hrms_role') || 'admin';

  return (
    <>
      <Topbar title="Attendance" subtitle="Time and presence tracking" />
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {role === 'admin' ? <AdminAttendance /> : <EmployeeAttendance />}
      </div>
    </>
  );
}
