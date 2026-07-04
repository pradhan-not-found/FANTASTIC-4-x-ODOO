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
      <div className="liquid-card-shell border border-[rgba(0,0,0,0.07)] rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm card-elevate">
         <div className="flex items-center gap-4 border-r border-[rgba(0,0,0,0.06)] pr-6">
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-[13px] font-bold text-white shadow-sm transition-all uppercase tracking-wider">
               + New Request
            </button>
            <div className="relative">
              <input 
                 type="text"
                 placeholder="Search requests..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="bg-white border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2 text-[13px] text-[var(--app-ink)] outline-none focus:border-blue-500 w-[240px]"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-[var(--app-muted)]" />
            </div>
         </div>
         <div className="flex items-center gap-8 text-[14px]">
            <div className="flex flex-col gap-1">
               <span className="text-blue-600 font-bold">Paid Time Off</span>
               <span className="text-[var(--app-muted)] text-[12px]">24 Days Available</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-purple-600 font-bold">Sick Time Off</span>
               <span className="text-[var(--app-muted)] text-[12px]">09 Days Available</span>
            </div>
         </div>
      </div>

      <div className="liquid-card-shell rounded-[18px] overflow-hidden flex flex-col shadow-sm card-elevate flex-1">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13.5px] text-left">
            <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <tr>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Name</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Start Date</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">End Date</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Time off Type</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-center">Attachment</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)] bg-white">
              {filteredRequests.map(l => {
                const emp = employees.find(e => e.id === l.empId);
                const isPending = l.status.toLowerCase() === 'pending';
                const typeColor = l.type === 'Paid Time off' ? 'text-[#60a5fa]' : 'text-[#a78bfa]';
                return (
                <tr key={l.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{emp ? emp.name : l.empId}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{l.fromDate}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{l.toDate}</td>
                  <td className={`py-3.5 px-5 font-semibold ${typeColor}`}>{l.type}</td>
                  <td className="py-3.5 px-5 text-center">
                    {l.attachment ? (
                      <a href={l.attachment} download={`attachment_${l.id}`} className="text-blue-500 hover:text-blue-700 p-1.5 inline-flex bg-blue-50 rounded-lg" title="Download Attachment">
                        <Paperclip className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-[var(--app-muted)] text-[12px]">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                     {isPending ? (
                        <div className="flex gap-2">
                           <button onClick={() => handleUpdateStatus(l.id, 'Rejected')} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors border border-red-200">
                              <X className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleUpdateStatus(l.id, 'Approved')} className="w-7 h-7 rounded-lg bg-green-50 text-green-700 flex items-center justify-center hover:bg-green-100 transition-colors border border-green-200">
                              <Check className="w-4 h-4" />
                           </button>
                        </div>
                     ) : (
                        <span className={cn(
                           "px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border inline-flex items-center gap-1",
                           l.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
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
  const [attachment, setAttachment] = useState(null);

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
          let count = 0;
          let curDate = new Date(fromDate);
          while (curDate <= toDate) {
             const dayOfWeek = curDate.getDay();
             if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // Exclude weekends
             curDate.setDate(curDate.getDate() + 1);
          }
          setAllocation(count.toFixed(2));
       }
    }
  }, [from, to]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachment(null);
    }
  };

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
          reason: 'N/A',
          attachment: attachment
        })
      });

      if (response.ok) {
        fetchLeaves();
        setModalOpen(false);
        setType('Paid Time off');
        setFrom('');
        setTo('');
        setAttachment(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 w-full mx-auto animate-in fade-in duration-500 flex flex-col h-full overflow-y-auto">
      {/* Leave Balance Banner */}
      <div className="liquid-card-shell border border-[rgba(0,0,0,0.07)] rounded-2xl p-5 mb-6 flex flex-col gap-4 shadow-sm card-elevate">
         <div className="flex gap-4 border-b border-[rgba(0,0,0,0.06)] pb-4">
            <button onClick={() => setModalOpen(true)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-[13px] font-bold text-white shadow-sm transition-all uppercase tracking-wider">
               + New Request
            </button>
         </div>
         
         <div className="flex items-center gap-12 text-[14px]">
            <div className="flex flex-col gap-1">
               <span className="text-blue-600 font-bold">Paid Time Off</span>
               <span className="text-[var(--app-muted)] text-[12px]">
                 {Math.max(0, 24 - requests.filter(r => r.type === 'Paid Time off' && r.status !== 'Rejected').reduce((acc, r) => acc + r.days, 0)).toFixed(1)} Days Available
               </span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-purple-600 font-bold">Sick Time Off</span>
               <span className="text-[var(--app-muted)] text-[12px]">
                 {Math.max(0, 9 - requests.filter(r => r.type === 'Sick Leave' && r.status !== 'Rejected').reduce((acc, r) => acc + r.days, 0)).toFixed(1)} Days Available
               </span>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-6 min-h-[500px] card-elevate">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <MonthlyCalendar month={5} year={2026} requests={requests} />
            <MonthlyCalendar month={6} year={2026} requests={requests} />
         </div>
         <div className="mt-6 flex flex-col md:flex-row gap-8 border-t border-[rgba(0,0,0,0.06)] pt-6">
            <div className="flex-1">
               <div className="text-[12px] font-bold text-[var(--app-ink)] uppercase tracking-wider mb-3">Legend</div>
               <div className="flex flex-col gap-3 text-[13px] text-[var(--app-muted)] font-medium">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Paid Time off</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500 rounded-sm"></div> Sick Leave</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 border border-dashed border-gray-400 rounded-sm"></div> Unpaid Leaves</div>
               </div>
            </div>
            
            <div className="flex-[2]">
               <div className="text-[12px] font-bold text-[var(--app-ink)] uppercase tracking-wider mb-3">Upcoming Holidays (India)</div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                     { date: '15 Aug 2026', name: 'Independence Day' },
                     { date: '02 Oct 2026', name: 'Gandhi Jayanti' },
                     { date: '24 Oct 2026', name: 'Dussehra' },
                     { date: '12 Nov 2026', name: 'Diwali' },
                     { date: '25 Dec 2026', name: 'Christmas' }
                  ].map((h, i) => (
                     <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] bg-[var(--app-soft)]">
                        <span className="text-[13px] font-bold text-[var(--app-ink)]">{h.name}</span>
                        <span className="text-[12px] font-mono text-[var(--app-muted)]">{h.date}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl w-full max-w-[500px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(0,0,0,0.06)] bg-[var(--app-soft)]">
               <div>
                 <h2 className="text-[16px] font-bold text-[var(--app-ink)] tracking-tight">New Time Off Request</h2>
                 <p className="text-[12.5px] text-[var(--app-muted)] mt-0.5">Submit a leave request for approval.</p>
               </div>
               <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-[rgba(0,0,0,0.06)] text-[var(--app-muted)] transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 text-[14px] flex flex-col gap-5">
               <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</div>
                  <div className="text-blue-600 font-bold bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg w-max text-[13px]">{user.name || 'Employee'}</div>
               </div>

               <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Time Off Type</div>
                  <select 
                     value={type} 
                     onChange={e => setType(e.target.value)} 
                     className="border border-[rgba(0,0,0,0.12)] bg-white text-[var(--app-ink)] font-semibold rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 w-full text-[13.5px]"
                  >
                     <option>Paid Time off</option>
                     <option>Sick Leave</option>
                     <option>Unpaid Leaves</option>
                  </select>
               </div>

               <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Period</div>
                  <div className="flex items-center gap-3 w-full">
                     <input 
                        type="date" 
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className="border border-[rgba(0,0,0,0.12)] bg-white text-[var(--app-ink)] font-medium rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 w-full text-[13px]"
                        required
                     />
                     <span className="text-[var(--app-muted)] text-[13px] font-medium shrink-0">to</span>
                     <input 
                        type="date" 
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="border border-[rgba(0,0,0,0.12)] bg-white text-[var(--app-ink)] font-medium rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 w-full text-[13px]"
                        required
                     />
                  </div>
               </div>

               <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Allocation</div>
                  <div className="flex items-center gap-2">
                     <input 
                        type="text" 
                        value={allocation}
                        onChange={e => setAllocation(e.target.value)}
                        className="border border-[rgba(0,0,0,0.12)] bg-white text-[var(--app-ink)] font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500 w-[90px] text-center text-[13.5px]"
                     />
                     <span className="text-[var(--app-muted)] text-[13px]">Days</span>
                  </div>
               </div>

               <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mt-2">Attachments</div>
                  <div className="flex items-center gap-3">
                     <label className="cursor-pointer w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0">
                        <Paperclip className="w-5 h-5" />
                        <input type="file" className="hidden" onChange={handleFileChange} />
                     </label>
                     <span className="text-[var(--app-muted)] text-[12px] truncate max-w-[200px]">
                        {attachment ? "Attachment selected" : "(For sick leave certificate)"}
                     </span>
                  </div>
               </div>

               <div className="flex items-center gap-3 pt-2 border-t border-[rgba(0,0,0,0.06)]">
                  <button type="submit" disabled={!from || !to || parseFloat(allocation) <= 0} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-[13.5px] font-bold text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                     Submit Request
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] font-bold text-[var(--app-muted)] hover:text-[var(--app-ink)] hover:bg-[var(--app-soft)] transition-colors">
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
        {activeTab === 'Time Off' ? (
          role === 'admin' ? <AdminLeaves /> : <EmployeeLeaves />
        ) : (
          role === 'admin' ? <AllocationsAdmin /> : <AllocationsEmployee />
        )}
      </div>
    </>
  );
}

function AllocationsAdmin() {
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [type, setType] = useState('Paid Time off');
  const [days, setDays] = useState('15');

  const fetchData = async () => {
    try {
      const [allocRes, empRes] = await Promise.all([
        fetch('http://localhost:3000/api/allocations'),
        fetch('http://localhost:3000/api/employees')
      ]);
      if (allocRes.ok) setAllocations(await allocRes.json());
      if (empRes.ok) {
        const emps = await empRes.json();
        setEmployees(emps);
        if (emps.length > 0) setSelectedEmp(emps[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedEmp || !type || !days) return;
    try {
      const res = await fetch('http://localhost:3000/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId: selectedEmp, type, days: parseFloat(days) })
      });
      if (res.ok) {
        fetchData();
        setDays('15');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 w-full mx-auto animate-in fade-in duration-500 flex flex-col h-full bg-[#f8f9fa]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-1 liquid-card-shell rounded-[18px] p-6 card-elevate self-start">
          <h2 className="text-[16px] font-bold text-[var(--app-ink)] mb-4 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">New Allocation</h2>
          <form onSubmit={handleAllocate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</label>
              <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="bg-white border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2.5 text-[13.5px] outline-none">
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Time Off Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="bg-white border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2.5 text-[13.5px] outline-none">
                <option value="Paid Time off">Paid Time off</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Days Allocated</label>
              <input type="number" step="0.5" value={days} onChange={e => setDays(e.target.value)} className="bg-white border border-[rgba(0,0,0,0.12)] rounded-lg px-3 py-2.5 text-[13.5px] outline-none" required />
            </div>
            <button type="submit" className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-[13.5px] font-bold text-white shadow-sm transition-all w-full">Allocate Leave</button>
          </form>
        </div>
        <div className="md:col-span-2 liquid-card-shell rounded-[18px] flex flex-col shadow-sm card-elevate overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-[13.5px] text-left">
              <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
                <tr>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Time off Type</th>
                  <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Allocated Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,0,0,0.06)] bg-white">
                {allocations.map(a => {
                  const emp = employees.find(e => e.id === a.empId);
                  return (
                    <tr key={a.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{emp ? emp.name : a.empId}</td>
                      <td className="py-3.5 px-5 font-medium text-[var(--app-muted)]">{a.type}</td>
                      <td className="py-3.5 px-5 font-semibold text-blue-600">{a.days} Days</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllocationsEmployee() {
  const [allocations, setAllocations] = useState([]);
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  useEffect(() => {
    if (!user.id) return;
    const fetchAllocs = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/allocations/${user.id}`);
        if (res.ok) setAllocations(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllocs();
  }, [user.id]);

  const totalPaid = allocations.filter(a => a.type === 'Paid Time off').reduce((sum, a) => sum + a.days, 0);
  const totalSick = allocations.filter(a => a.type === 'Sick Leave').reduce((sum, a) => sum + a.days, 0);

  return (
    <div className="flex-1 p-6 max-w-[800px] mx-auto w-full animate-in fade-in duration-500">
      <h2 className="text-[20px] font-black tracking-tight mb-6 text-[var(--app-ink)]">My Leave Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="liquid-card-shell rounded-[24px] p-8 card-elevate bg-gradient-to-br from-blue-500 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="text-[13px] font-bold uppercase tracking-widest text-blue-100 mb-2 relative z-10">Paid Time Off</div>
          <div className="text-[48px] font-black tracking-tighter leading-none mb-1 relative z-10">{totalPaid}</div>
          <div className="text-[14px] text-blue-100 font-medium relative z-10">Total Days Allocated</div>
        </div>
        <div className="liquid-card-shell rounded-[24px] p-8 card-elevate bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="text-[13px] font-bold uppercase tracking-widest text-pink-100 mb-2 relative z-10">Sick Leave</div>
          <div className="text-[48px] font-black tracking-tighter leading-none mb-1 relative z-10">{totalSick}</div>
          <div className="text-[14px] text-pink-100 font-medium relative z-10">Total Days Allocated</div>
        </div>
      </div>
      
      <div className="mt-8 liquid-card-shell rounded-[18px] flex flex-col shadow-sm card-elevate overflow-hidden border border-[rgba(0,0,0,0.06)]">
        <div className="p-4 bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
           <h3 className="font-bold text-[14px] text-[var(--app-ink)]">Allocation History</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13.5px] text-left">
            <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <tr>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Type</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Days Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)] bg-white">
              {allocations.map(a => (
                <tr key={a.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{a.type}</td>
                  <td className="py-3.5 px-5 font-semibold text-green-600 text-right">+{a.days}</td>
                </tr>
              ))}
              {allocations.length === 0 && (
                 <tr>
                    <td colSpan={2} className="py-8 text-center text-[var(--app-muted)] text-[13px]">No allocations granted yet.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
