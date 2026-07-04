import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function InteractiveCalendar({ from, to, setFrom, setTo }) {
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (day) => {
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
        <div className="p-2"></div><div className="p-2"></div><div className="p-2"></div>
        {days.map(day => {
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminLeaves() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const fetchLeaves = async () => {
    try {
      const [leavesRes, empRes] = await Promise.all([
        fetch('http://localhost:3000/api/leaves'),
        fetch('http://localhost:3000/api/employees')
      ]);
      if (leavesRes.ok) setRequests(await leavesRes.json());
      if (empRes.ok) setEmployees(await empRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const pending = requests.filter(l => l.status === 'Pending' || l.status === 'pending');
  const history = requests.filter(l => l.status !== 'Pending' && l.status !== 'pending');

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchLeaves();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

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
              {pending.map(l => {
                const emp = employees.find(e => e.id === l.empId);
                return (
                <div key={l.id} className="p-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.02)] flex flex-wrap gap-4 justify-between items-center transition-all hover:bg-[rgba(0,0,0,0.03)]">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-[rgba(0,0,0,0.08)] flex items-center justify-center font-bold text-[13px] text-blue-700 shadow-sm shrink-0">
                      {emp ? emp.name.substring(0,2).toUpperCase() : l.empId.substring(0,3)}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-[var(--app-ink)]">{emp ? emp.name : l.empId}</div>
                      <div className="text-[12.5px] text-[var(--app-muted)] mt-0.5">{l.type} • {l.days} day{l.days > 1 ? 's' : ''}</div>
                      <div className="text-[11.5px] text-[var(--app-muted)] mt-1 font-mono">{l.fromDate} to {l.toDate}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(l.id, 'Rejected')} className="px-4 py-2 rounded-lg text-[12.5px] font-bold bg-white text-red-600 border border-[rgba(0,0,0,0.12)] hover:bg-red-50 transition-colors shadow-sm">Reject</button>
                    <button onClick={() => handleUpdateStatus(l.id, 'Approved')} className="px-4 py-2 rounded-lg text-[12.5px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">Approve</button>
                  </div>
                </div>
              )})}
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
                  {history.map(l => {
                    const emp = employees.find(e => e.id === l.empId);
                    return (
                    <tr key={l.id}>
                      <td className="py-3.5 px-4 font-semibold text-[var(--app-ink)]">{emp ? emp.name : l.empId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[var(--app-ink)]">{l.type}</div>
                        <div className="text-[11.5px] text-[var(--app-muted)] font-mono">{l.fromDate} - {l.toDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
                          (l.status === 'approved' || l.status === 'Approved') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  )})}
                  {history.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-[13px] text-[var(--app-muted)]">No leave history</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
            <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight">Who's Away</h2>
            <div className="flex flex-col gap-4">
              {history.filter(l => l.status === 'Approved').slice(0, 5).map(l => {
                const emp = employees.find(e => e.id === l.empId);
                return (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-[11px] text-blue-700 shrink-0">
                    {emp ? emp.name.substring(0,2).toUpperCase() : 'EMP'}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-[var(--app-ink)]">{emp ? emp.name : l.empId}</div>
                    <div className="text-[11.5px] text-[var(--app-muted)]">{l.type} • {l.fromDate}</div>
                  </div>
                </div>
              )})}
              {history.filter(l => l.status === 'Approved').length === 0 && <div className="text-[13px] text-[var(--app-muted)]">No one is currently away.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeLeaves() {
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  
  const [type, setType] = useState('Paid Leave');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  const fetchLeaves = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/leaves/${user.id}`);
      if (res.ok) setRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to) return;
    
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    try {
      const response = await fetch('http://localhost:3000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: user.id,
          type,
          fromDate: from,
          toDate: to,
          days: diffDays,
          reason: reason || 'N/A'
        })
      });

      if (response.ok) {
        fetchLeaves();
        setModalOpen(false);
        setType('Paid Leave');
        setFrom('');
        setTo('');
        setReason('');
      } else {
        alert('Failed to submit request');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit request');
    }
  };

  const approvedLeaves = requests.filter(l => l.status === 'Approved').reduce((acc, l) => acc + (l.days || 1), 0);
  const sickLeaves = requests.filter(l => l.status === 'Approved' && l.type === 'Sick Leave').reduce((acc, l) => acc + (l.days || 1), 0);
  const casualLeaves = requests.filter(l => l.status === 'Approved' && l.type === 'Casual Leave').reduce((acc, l) => acc + (l.days || 1), 0);

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
          { label: 'Annual Paid', val: `${15 - approvedLeaves} / 15`, sub: `${approvedLeaves} days used` },
          { label: 'Sick Leave', val: `${7 - sickLeaves} / 7`, sub: `${sickLeaves} days used` },
          { label: 'Casual Leave', val: `${5 - casualLeaves} / 5`, sub: `${casualLeaves} days used` },
          { label: 'Pending', val: requests.filter(r => r.status === 'Pending').length.toString(), sub: 'Awaiting approval' }
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
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Dates</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Days</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[var(--app-ink)]">{r.type}</td>
                      <td className="py-3.5 px-4 font-mono text-[var(--app-muted)] text-[12.5px]">{r.fromDate} to {r.toDate}</td>
                      <td className="py-3.5 px-4 font-mono text-[var(--app-ink)] font-semibold">{r.days}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${
                          (r.status === 'approved' || r.status === 'Approved') ? 'bg-green-50 text-green-700 border-green-200' :
                          (r.status === 'rejected' || r.status === 'Rejected') ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-[13px] text-[var(--app-muted)]">No leave requests found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
             <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight">Upcoming Holidays</h2>
             <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center p-3 rounded-lg bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.04)]">
                 <div className="font-semibold text-[13px] text-[var(--app-ink)]">Independence Day</div>
                 <div className="text-[12px] text-[var(--app-muted)] font-mono">Aug 15</div>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.04)]">
                 <div className="font-semibold text-[13px] text-[var(--app-ink)]">Gandhi Jayanti</div>
                 <div className="text-[12px] text-[var(--app-muted)] font-mono">Oct 2</div>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.04)]">
                 <div className="font-semibold text-[13px] text-[var(--app-ink)]">Diwali</div>
                 <div className="text-[12px] text-[var(--app-muted)] font-mono">Nov 12</div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[440px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)]">
              <div>
                <h2 className="text-[18px] font-bold tracking-tight text-[var(--app-ink)]">Request Leave</h2>
                <p className="text-[13px] text-[var(--app-muted)] mt-0.5">Select dates and leave type.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[var(--app-muted)] hover:text-[var(--app-ink)] bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)] rounded-full p-2 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <InteractiveCalendar from={from} to={to} setFrom={setFrom} setTo={setTo} />

              <div className="space-y-4 mb-6 mt-4 border-t border-[rgba(0,0,0,0.06)] pt-4">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Leave Type</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-xl text-[14px] bg-white text-[var(--app-ink)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm font-medium cursor-pointer"
                  >
                    <option>Paid Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">From</label>
                    <input 
                      type="text" 
                      value={from}
                      readOnly
                      placeholder="Select on calendar"
                      className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-xl text-[14px] bg-[var(--app-soft)] text-[var(--app-muted)] font-mono outline-none shadow-sm cursor-not-allowed"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">To</label>
                    <input 
                      type="text" 
                      value={to}
                      readOnly
                      placeholder="Select on calendar"
                      className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-xl text-[14px] bg-[var(--app-soft)] text-[var(--app-muted)] font-mono outline-none shadow-sm cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Reason (Optional)</label>
                  <textarea 
                    value={reason} 
                    onChange={e => setReason(e.target.value)}
                    placeholder="Brief reason for your leave..."
                    className="w-full px-4 py-3 border border-[rgba(0,0,0,0.12)] rounded-xl text-[14px] bg-white text-[var(--app-ink)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm min-h-[80px] resize-none"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl text-[14px] font-bold text-[var(--app-ink)] bg-white border border-[rgba(0,0,0,0.12)] hover:bg-[var(--app-soft)] transition-colors shadow-sm">
                  Cancel
                </button>
                <button type="submit" disabled={!from || !to} className={`flex-1 py-3 rounded-xl text-[14px] font-bold text-white transition-all shadow-sm ${(!from || !to) ? 'bg-blue-400 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Submit Request
                </button>
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
      <Topbar title="Leave Management" subtitle="Time off requests and balances" />
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {role === 'admin' ? <AdminLeaves /> : <EmployeeLeaves />}
      </div>
    </>
  );
}
