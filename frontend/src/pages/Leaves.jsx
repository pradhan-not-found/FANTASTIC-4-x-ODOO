import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { LEAVE_REQUESTS, EMPLOYEES } from '../data/mockData';
import { X } from 'lucide-react';


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
  const myRequests = LEAVE_REQUESTS.filter(l => l.empId === 'EMP-001');

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
          { label: 'Pending', val: '1', sub: 'Awaiting approval' }
        ].map((stat, i) => (
          <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate">
            <div className="text-[12.5px] font-semibold uppercase tracking-widest text-[var(--app-muted)] mb-2">{stat.label}</div>
            <div className="text-[24px] font-bold text-[var(--app-ink)] leading-none mb-1 tracking-tight">{stat.val}</div>
            <div className="text-[11.5px] font-medium text-[var(--app-muted)]">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
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
              {myRequests.map(l => (
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
              {myRequests.length === 0 && (
                <tr><td colSpan="4" className="text-center py-6 text-[var(--app-muted)] text-[13.5px]">No requests found.</td></tr>
              )}
            </tbody>
          </table>
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
            
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Leave Type</label>
              <select className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 transition-all bg-white cursor-pointer appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}>
                <option>Paid Leave</option>
                <option>Sick Leave</option>
                <option>Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">From Date</label>
                <input type="date" className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 transition-all bg-white" />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">To Date</label>
                <input type="date" className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 transition-all bg-white" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[12.5px] font-semibold text-[var(--app-muted)] mb-2 tracking-tight">Reason (Optional)</label>
              <textarea rows="3" className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 transition-all resize-none placeholder:text-[var(--app-muted)]" placeholder="Briefly explain..."></textarea>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-[13.5px] font-semibold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all">Cancel</button>
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Leaves() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen apple-inset">
        <Topbar title={role === 'admin' ? "Leave Approvals" : "Leave Requests"} />
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {role === 'admin' ? <AdminLeaves /> : <EmployeeLeaves />}
        </div>
      </div>
    </div>
  );
}
