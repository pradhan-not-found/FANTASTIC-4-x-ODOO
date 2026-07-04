import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { Search, Check, X, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper function to render month calendar
function MonthlyCalendar({ month, year, requests }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayStatus = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const req = requests.find(r => r.status === 'Approved' && dateStr >= r.fromDate && dateStr <= r.toDate);
    if (req) {
      if (req.type === 'Sick Leave') return 'sick';
      return 'paid';
    }
    return null;
  };

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.12)] rounded-xl p-4 select-none w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <button type="button" className="p-1 hover:bg-[rgba(0,0,0,0.04)] rounded-md transition-colors"><ChevronLeft className="w-4 h-4 text-[var(--app-muted)]" /></button>
        <div className="text-[14px] font-bold text-[var(--app-ink)]">{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</div>
        <button type="button" className="p-1 hover:bg-[rgba(0,0,0,0.04)] rounded-md transition-colors"><ChevronRight className="w-4 h-4 text-[var(--app-muted)]" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-[11px] font-bold text-[var(--app-muted)] uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center flex-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {days.map(day => {
          const status = getDayStatus(day);
          return (
            <div 
              key={day} 
              className={cn(
                "relative h-10 flex flex-col items-center justify-center rounded-lg transition-all text-[13px] font-medium border border-transparent",
                status === 'paid' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                status === 'sick' ? 'bg-pink-50 text-pink-800 border-pink-200' :
                'text-[var(--app-ink)] hover:bg-[rgba(0,0,0,0.04)]'
              )}
            >
              {day}
              {status && (
                <div className={cn("absolute bottom-1 w-1.5 h-1.5 rounded-full", status === 'paid' ? 'bg-blue-500' : 'bg-pink-500')}></div>
              )}
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
  const [search, setSearch] = useState('');
  
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
    }
  };

  const filteredRequests = requests.filter(r => {
    const emp = employees.find(e => e.id === r.empId);
    const name = emp ? emp.name.toLowerCase() : r.empId.toLowerCase();
    return name.includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex-1 p-6 w-full mx-auto animate-in fade-in duration-500 flex flex-col h-full bg-[#f8f9fa]">
      <div className="bg-[#2a2f3a] p-4 rounded-xl mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white shadow-md">
         <div className="flex items-center gap-4">
            <button className="px-5 py-2 bg-[#8957e5] rounded-md text-[13px] font-bold text-white hover:opacity-90 shadow-sm transition-opacity uppercase tracking-wider">
               New
            </button>
            <div className="relative">
              <input 
                 type="text"
                 placeholder="Searchbar..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="bg-transparent border border-white/20 rounded-md px-3 py-2 text-[13px] text-white outline-none focus:border-white/40 w-[240px] placeholder:text-white/40"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-white/40" />
            </div>
         </div>
         <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-2">
               <span className="text-[#60a5fa] font-bold">Paid time Off</span>
               <span className="text-white/60 text-[11px]">24 Days Available</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
               <span className="text-[#a78bfa] font-bold">Sick time off</span>
               <span className="text-white/60 text-[11px]">09 Days Available</span>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-[#2a2f3a] rounded-xl overflow-hidden flex flex-col shadow-md border border-[#3b414f]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13px] text-left text-white/90 whitespace-nowrap">
            <thead className="bg-[#2a2f3a] border-b border-[#3b414f]">
              <tr>
                <th className="py-3 px-4 font-bold text-white/70">Name</th>
                <th className="py-3 px-4 font-bold text-white/70">Start Date</th>
                <th className="py-3 px-4 font-bold text-white/70">End Date</th>
                <th className="py-3 px-4 font-bold text-white/70">Time off Type</th>
                <th className="py-3 px-4 font-bold text-white/70">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b414f] bg-[#1e222a]">
              {filteredRequests.map(l => {
                const emp = employees.find(e => e.id === l.empId);
                const isPending = l.status.toLowerCase() === 'pending';
                const typeColor = l.type === 'Paid Time off' ? 'text-[#60a5fa]' : 'text-[#a78bfa]';
                return (
                <tr key={l.id} className="hover:bg-[#2a2f3a] transition-colors">
                  <td className="py-3.5 px-4 font-medium">{emp ? emp.name : l.empId}</td>
                  <td className="py-3.5 px-4 font-mono">{l.fromDate}</td>
                  <td className="py-3.5 px-4 font-mono">{l.toDate}</td>
                  <td className={`py-3.5 px-4 font-semibold ${typeColor}`}>{l.type}</td>
                  <td className="py-3.5 px-4">
                     {isPending ? (
                        <div className="flex gap-2">
                           <button onClick={() => handleUpdateStatus(l.id, 'Rejected')} className="w-6 h-6 rounded bg-[#ef4444] flex items-center justify-center hover:opacity-80 transition-opacity">
                              <X className="w-4 h-4 text-white" />
                           </button>
                           <button onClick={() => handleUpdateStatus(l.id, 'Approved')} className="w-6 h-6 rounded bg-[#22c55e] flex items-center justify-center hover:opacity-80 transition-opacity">
                              <Check className="w-4 h-4 text-white" />
                           </button>
                        </div>
                     ) : (
                        <span className={cn(
                           "px-2 py-1 rounded text-[11px] font-bold uppercase",
                           l.status === 'Approved' ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        )}>
                           {l.status}
                        </span>
                     )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeeLeaves() {
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  
  const [type, setType] = useState('Paid Time off');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [allocation, setAllocation] = useState('01.00');

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

  useEffect(() => {
    if (from && to) {
       const fromDate = new Date(from);
       const toDate = new Date(to);
       if (toDate >= fromDate) {
          const diffTime = Math.abs(toDate - fromDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          setAllocation(diffDays.toFixed(2));
       }
    }
  }, [from, to]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: user.id,
          type,
          fromDate: from,
          toDate: to,
          days: parseFloat(allocation),
          reason: 'N/A'
        })
      });

      if (response.ok) {
        fetchLeaves();
        setModalOpen(false);
        setType('Paid Time off');
        setFrom('');
        setTo('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 w-full mx-auto animate-in fade-in duration-500 flex flex-col h-full bg-[#f8f9fa] overflow-y-auto">
      <div className="bg-[#2a2f3a] p-4 rounded-xl mb-6 flex flex-col gap-4 text-white shadow-md">
         <div className="flex gap-4 border-b border-white/10 pb-4">
            <button onClick={() => setModalOpen(true)} className="px-5 py-2 bg-[#8957e5] rounded-md text-[13px] font-bold text-white hover:opacity-90 shadow-sm transition-opacity uppercase tracking-wider">
               New
            </button>
         </div>
         <div className="flex items-center gap-12 text-[14px]">
            <div className="flex flex-col gap-1">
               <span className="text-[#60a5fa] font-bold">Paid time Off</span>
               <span className="text-white/60 text-[12px]">24 Days Available</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[#a78bfa] font-bold">Sick time off</span>
               <span className="text-white/60 text-[12px]">09 Days Available</span>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-md border border-[rgba(0,0,0,0.06)] p-6 min-h-[500px]">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <MonthlyCalendar month={5} year={2026} requests={requests} />
            <MonthlyCalendar month={6} year={2026} requests={requests} />
         </div>
         <div className="mt-6 flex flex-col gap-2 border-t border-[rgba(0,0,0,0.06)] pt-4">
            <div className="text-[12px] font-bold text-[var(--app-ink)] uppercase tracking-wider mb-2">Legend</div>
            <div className="flex flex-wrap items-center gap-6 text-[13px] text-[var(--app-muted)] font-medium">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Paid Time off</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500 rounded-sm"></div> Sick Leave</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 border border-dashed border-gray-400 rounded-sm"></div> Unpaid Leaves</div>
            </div>
         </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e222a] border border-[#3b414f] rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#3b414f] bg-[#2a2f3a]">
               <h2 className="text-[15px] font-bold text-white">Time off Type: Request</h2>
               <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 text-[14px]">
               <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 mb-4 items-center">
                  <div className="text-white/80 font-medium">Employee</div>
                  <div className="text-[#60a5fa] font-bold bg-[#60a5fa]/10 px-3 py-1.5 rounded w-max">[{user.name || 'Employee'}]</div>
               </div>

               <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 mb-4 items-center">
                  <div className="text-white/80 font-medium">Time off Type</div>
                  <select 
                     value={type} 
                     onChange={e => setType(e.target.value)} 
                     className="bg-[#2a2f3a] border border-[#3b414f] text-[#60a5fa] font-bold rounded px-3 py-2 outline-none focus:border-[#60a5fa]/50 w-full"
                  >
                     <option>Paid Time off</option>
                     <option>Sick Leave</option>
                     <option>Unpaid Leaves</option>
                  </select>
               </div>

               <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 mb-4 items-center">
                  <div className="text-white/80 font-medium">Validity Period</div>
                  <div className="flex items-center gap-3 w-full">
                     <input 
                        type="date" 
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className="bg-[#2a2f3a] border border-[#3b414f] text-[#60a5fa] font-medium rounded px-3 py-2 outline-none focus:border-[#60a5fa]/50 w-full [color-scheme:dark]"
                        required
                     />
                     <span className="text-white/60">To</span>
                     <input 
                        type="date" 
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="bg-[#2a2f3a] border border-[#3b414f] text-[#60a5fa] font-medium rounded px-3 py-2 outline-none focus:border-[#60a5fa]/50 w-full [color-scheme:dark]"
                        required
                     />
                  </div>
               </div>

               <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 mb-4 items-center">
                  <div className="text-white/80 font-medium">Allocation</div>
                  <div className="flex items-center gap-2">
                     <input 
                        type="text" 
                        value={allocation}
                        onChange={e => setAllocation(e.target.value)}
                        className="bg-[#2a2f3a] border border-[#3b414f] text-[#60a5fa] font-bold rounded px-3 py-2 outline-none focus:border-[#60a5fa]/50 w-[80px] text-center"
                     />
                     <span className="text-white/60 text-[13px]">Days</span>
                  </div>
               </div>

               <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 mb-8 items-start">
                  <div className="text-white/80 font-medium mt-2">Attachments</div>
                  <div className="flex items-center gap-3">
                     <button type="button" className="w-10 h-10 bg-[#60a5fa] text-white rounded-md flex items-center justify-center hover:opacity-90 transition-opacity shrink-0">
                        <Paperclip className="w-5 h-5" />
                     </button>
                     <span className="text-white/60 text-[12px]">(For sick leave certificate)</span>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button type="submit" disabled={!from || !to} className="px-5 py-2 bg-[#8957e5] rounded text-[13px] font-bold text-white hover:opacity-90 transition-opacity uppercase disabled:opacity-50">
                     Submit
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 bg-transparent border border-white/20 rounded text-[13px] font-bold text-white/80 hover:bg-white/5 transition-colors uppercase">
                     Discard
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
  const [activeTab, setActiveTab] = useState('Time Off');

  return (
    <>
      <Topbar title="Time Off" subtitle="Manage time off requests" />
      
      {/* Sub Navigation */}
      <div className="bg-white border-b border-[rgba(0,0,0,0.08)] px-8 flex items-center gap-6 h-[48px] shrink-0">
         {['Time Off', 'Allocation'].map(tab => (
            <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                  "h-full px-2 border-b-2 text-[14px] font-semibold transition-all flex items-center",
                  activeTab === tab 
                     ? "border-[var(--app-ink)] text-[var(--app-ink)]" 
                     : "border-transparent text-[var(--app-muted)] hover:text-[var(--app-ink)]"
               )}
            >
               {tab}
            </button>
         ))}
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-[#f8f9fa]">
        {role === 'admin' ? <AdminLeaves /> : <EmployeeLeaves />}
      </div>
    </>
  );
}
