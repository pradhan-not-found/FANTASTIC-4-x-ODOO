import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { EMPLOYEES } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';

export default function Employees() {
  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen apple-inset">
        <Topbar title="Employees" subtitle="Manage your organization's workforce" />
        
        <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 no-scrollbar">
          
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Employee Directory</h1>
              <p className="text-[13.5px] text-[var(--app-muted)]">{EMPLOYEES.length} active employees in the system.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all">
                Export CSV
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all border border-blue-600">
                + Add Employee
              </button>
            </div>
          </div>

          <div className="liquid-card-shell rounded-[18px] overflow-hidden card-elevate">
            <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] flex justify-between items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <input type="text" placeholder="Search by name, ID, role..." className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white w-[250px] outline-none focus:border-blue-500 transition-all placeholder:text-[var(--app-muted)]" />
                <select className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white outline-none cursor-pointer">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Product</option>
                  <option>HR</option>
                </select>
              </div>
              <div className="text-[12px] text-[var(--app-muted)] font-medium">
                Showing {EMPLOYEES.length} results
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] text-left">
                <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
                  <tr>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">ID</th>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Role & Department</th>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Join Date</th>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Status</th>
                    <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
                  {EMPLOYEES.map(e => (
                    <tr key={e.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-[11px] text-blue-700 shrink-0 shadow-sm">
                            {e.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-[13.5px] text-[var(--app-ink)]">{e.name}</div>
                            <div className="text-[11.5px] text-[var(--app-muted)]">{e.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-[12.5px]">{e.id}</td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-[13.5px] text-[var(--app-ink)]">{e.role}</div>
                        <div className="text-[11.5px] text-[var(--app-muted)]">{e.department}</div>
                      </td>
                      <td className="py-3.5 px-5 text-[12.5px] text-[var(--app-muted)] font-medium">{e.joinDate}</td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border bg-green-50 text-green-700 border-green-200">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button className="text-[var(--app-muted)] hover:text-blue-600 font-semibold text-[13px] opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-[rgba(0,0,0,0.06)] bg-[var(--app-soft)] flex justify-between items-center text-[12.5px]">
              <button className="px-3 py-1 rounded-md text-[var(--app-muted)] hover:bg-[rgba(0,0,0,0.04)] transition-colors" disabled>Previous</button>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-md bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] font-bold flex items-center justify-center shadow-sm">1</button>
                <button className="w-7 h-7 rounded-md text-[var(--app-muted)] hover:bg-[rgba(0,0,0,0.04)] font-medium flex items-center justify-center transition-colors">2</button>
                <button className="w-7 h-7 rounded-md text-[var(--app-muted)] hover:bg-[rgba(0,0,0,0.04)] font-medium flex items-center justify-center transition-colors">3</button>
              </div>
              <button className="px-3 py-1 rounded-md text-[var(--app-ink)] hover:bg-[rgba(0,0,0,0.04)] font-medium transition-colors">Next</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
