import { useState } from 'react';
import Topbar from '../components/Topbar';
import { LEAVE_REQUESTS, EMPLOYEES, CALENDAR_STATUS } from '../data/mockData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function InteractiveCalendar({ from, to, setFrom, setTo }) {
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (day) => {
    // Basic date formatting for UI purposes (July 2026)
    const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
    
    if (!from || (from && to)) {
      setFrom(dateStr);
      setTo('');
    } else {
      const fromDate = new Date(from);
      const clickedDate = new Date(dateStr);
      if (clickedDate >= fromDate) {
        setTo(dateStr);
      } else {
        setFrom(dateStr);
        setTo('');
      }
    }
  };

  const isSelected = (day) => {
    const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
    if (dateStr === from || dateStr === to) return true;
    if (from && to) {
      const d = new Date(dateStr);
      return d > new Date(from) && d < new Date(to);
    }
    return false;
  };

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.12)] rounded-xl p-4 mb-4 select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <button type="button" className="p-1 hover:bg-[rgba(0,0,0,0.04)] rounded-md transition-colors"><ChevronLeft className="w-4 h-4 text-[var(--app-muted)]" /></button>
        <div className="text-[13.5px] font-bold text-[var(--app-ink)]">July 2026</div>
        <button type="button" className="p-1 hover:bg-[rgba(0,0,0,0.04)] rounded-md transition-colors"><ChevronRight className="w-4 h-4 text-[var(--app-muted)]" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-[10px] font-bold text-[var(--app-muted)] uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Offset for Wed start of July 2026 */}
        <div className="p-2"></div><div className="p-2"></div><div className="p-2"></div>
        {days.map(day => {
          const status = CALENDAR_STATUS[day];
          const selected = isSelected(day);
          const isEndpoint = `2026-07-${String(day).padStart(2, '0')}` === from || `2026-07-${String(day).padStart(2, '0')}` === to;
          
          return (
            <div 
              key={day} 
              onClick={() => handleDateClick(day)}
              className={`relative cursor-pointer h-9 flex flex-col items-center justify-center rounded-lg transition-all text-[13px] font-medium ${
                selected 
                  ? (isEndpoint ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-800') 
                  : 'text-[var(--app-ink)] hover:bg-[rgba(0,0,0,0.04)]'
              }`}
            >
              {day}
              {status && !selected && (
                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                  status === 'present' ? 'bg-green-500' :
                  status === 'absent' ? 'bg-red-500' :
                  status === 'half' ? 'bg-amber-500' : 'bg-blue-400'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(0,0,0,0.06)] px-2 justify-center">
         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div><span className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Present</span></div>
         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Absent</span></div>
         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div><span className="text-[10px] text-[var(--app-muted)] font-semibold uppercase">Leave</span></div>
      </div>
    </div>
  );
}


function AdminLeaves() {
  const pending = LEAVE_REQUESTS.filter(l => l.status === 'pending');
  const history = LEAVE_REQUESTS.filter(l => l.status !== 'pending');

  return (
    <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Leave Approvals</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Manage employee time-off requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
            <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight flex items-center gap-2">
              Action Required
              <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
            </h2>
            <div className="flex flex-col gap-4">
              {pending.map(l => (
                <div key={l.id} className="p-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.02)] flex flex-wrap gap-4 justify-between items-center transition-all hover:bg-[rgba(0,0,0,0.03)]">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-[rgba(0,0,0,0.08)] flex items-center justify-center font-bold text-[13px] text-blue-700 shadow-sm shrink-0">
                      {l.empName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-[var(--app-ink)]">{l.empName}</div>
                      <div className="text-[12.5px] text-[var(--app-muted)] mt-0.5">{l.type} • {l.days} day{l.days > 1 ? 's' : ''}</div>
                      <div className="text-[11.5px] text-[var(--app-muted)] mt-1 font-mono">{l.from} to {l.to}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg text-[12.5px] font-bold bg-white text-red-600 border border-[rgba(0,0,0,0.12)] hover:bg-red-50 transition-colors shadow-sm">Reject</button>
                    <button className="px-4 py-2 rounded-lg text-[12.5px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">Approve</button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && (
                <div className="text-center py-8 text-[var(--app-muted)] text-[13.5px]">All caught up! No pending requests.</div>
              )}
            </div>
          </div>

          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
            <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight">Recent History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] text-left">
                <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
                  <tr>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Type & Dates</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                  {history.map(l => (
                    <tr key={l.id}>
                      <td className="py-3.5 px-4 font-semibold text-[var(--app-ink)]">{l.empName}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[var(--app-ink)]">{l.type}</div>
                        <div className="text-[11.5px] text-[var(--app-muted)] font-mono">{l.from} - {l.to}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
                          l.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
            <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight">Who's Away</h2>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Priya Sharma', dates: 'Jul 2 - Jul 5', type: 'Paid Leave', avatar: 'PS' },
                { name: 'Rahul Desai', dates: 'Jul 4', type: 'Sick Leave', avatar: 'RD' }
              ].map(emp => (
                <div key={emp.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-[11px] text-blue-700 shrink-0">
                    {emp.avatar}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-[var(--app-ink)]">{emp.name}</div>
                    <div className="text-[11.5px] text-[var(--app-muted)]">{emp.type} • {emp.dates}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeLeaves() {
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState(LEAVE_REQUESTS.filter(l => l.empId === 'EMP-001'));
  
  const [type, setType] = useState('Paid Leave');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) return;
    
    // Calculate simple days difference (naive for UI purposes)
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

    const newRequest = {
      id: `req-${Date.now()}`,
      empId: 'EMP-001',
      empName: 'Souradeep Pradhan',
      type,
      from,
      to,
      days: diffDays,
      reason: reason || 'N/A',
      status: 'pending'
    };

    setRequests([newRequest, ...requests]);
    setModalOpen(false);
    setType('Paid Leave');
    setFrom('');
    setTo('');
    setReason('');
  };

  return (
    <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Leave Requests</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Track your time off and apply for leaves.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all border border-blue-600">
          + New Request
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Annual Paid', val: '12 / 15', sub: '3 days used' },
          { label: 'Sick Leave', val: '4 / 7', sub: '3 days used' },
          { label: 'Casual Leave', val: '2 / 5', sub: '3 days used' },
          { label: 'Pending', val: requests.filter(r => r.status === 'pending').length.toString(), sub: 'Awaiting approval' }
        ].map((stat, i) => (
          <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate">
            <div className="text-[12.5px] font-semibold uppercase tracking-widest text-[var(--app-muted)] mb-2">{stat.label}</div>
            <div className="text-[24px] font-bold text-[var(--app-ink)] leading-none mb-1 tracking-tight">{stat.val}</div>
            <div className="text-[11.5px] font-medium text-[var(--app-muted)]">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate h-full">
            <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight">My Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] text-left">
                <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
                  <tr>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Type</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Duration</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Reason</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                  {requests.map(l => (
                    <tr key={l.id}>
                      <td className="py-3.5 px-4 font-semibold text-[var(--app-ink)]">{l.type}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[var(--app-ink)] text-[12.5px]">{l.from} to {l.to}</div>
                        <div className="text-[11.5px] text-[var(--app-muted)]">{l.days} day{l.days > 1 ? 's' : ''}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--app-muted)] text-[12.5px] max-w-[200px] truncate">{l.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
                          l.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                          l.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-6 text-[var(--app-muted)] text-[13.5px]">No requests found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate h-full">
            <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight">Upcoming Holidays</h2>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Independence Day', date: 'Aug 15, 2026', day: 'Saturday' },
                { name: 'Ganesh Chaturthi', date: 'Sep 14, 2026', day: 'Monday' },
                { name: 'Gandhi Jayanti', date: 'Oct 02, 2026', day: 'Friday' },
                { name: 'Diwali', date: 'Nov 08, 2026', day: 'Sunday' }
              ].map((h, i) => (
                <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-[rgba(0,0,0,0.02)] transition-colors border border-transparent hover:border-[rgba(0,0,0,0.05)]">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center text-blue-700 shrink-0 shadow-sm">
                     <span className="text-[10px] font-bold uppercase">{h.date.split(' ')[0]}</span>
                     <span className="text-[16px] font-black leading-none">{h.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-[var(--app-ink)]">{h.name}</div>
                    <div className="text-[12px] text-[var(--app-muted)]">{h.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-[480px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200 border border-[rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-bold text-[var(--app-ink)] tracking-tight">New Request</h2>
              <button onClick={() => setModalOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-ink)] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Leave Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 transition-all bg-white cursor-pointer appearance-none" 
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
                >
                  <option>Paid Leave</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Select Date Range</label>
                <InteractiveCalendar from={from} to={to} setFrom={setFrom} setTo={setTo} />
                
                {from && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-50 text-blue-700 text-[12.5px] font-semibold rounded-lg border border-blue-100">
                    <span>{from}</span>
                    {to && <span>→ {to}</span>}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Reason (Optional)</label>
                <textarea 
                  rows="3" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 transition-all resize-none placeholder:text-[var(--app-muted)]" 
                  placeholder="Briefly explain..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-[13.5px] font-semibold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Leaves() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  return (
    <>
      <Topbar title={role === 'admin' ? "Leave Approvals" : "Leave Requests"} />
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {role === 'admin' ? <AdminLeaves /> : <EmployeeLeaves />}
      </div>
    </>
  );
}
