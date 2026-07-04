import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { EMPLOYEES } from '../data/mockData';
import { X, UserPlus, Mail, CheckCircle2, User } from 'lucide-react';

export default function Employees() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const [employeesList, setEmployeesList] = useState(EMPLOYEES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', role: '', department: '' });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email || !newEmp.role || !newEmp.department) return;
    
    const emp = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newEmp.name,
      role: newEmp.role,
      department: newEmp.department,
      email: newEmp.email,
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'active'
    };
    
    setEmployeesList([emp, ...employeesList]);
    setIsModalOpen(false);
    setNewEmp({ name: '', email: '', role: '', department: '' });
  };

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
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all border border-blue-600"
              >
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
                Showing {employeesList.length} results
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
                  {employeesList.map(e => (
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

      {/* Professional Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative h-[120px] bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex items-end">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,15,24,0.6)_100%)] pointer-events-none opacity-50 mix-blend-overlay"></div>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors z-10">
                <X className="w-4 h-4" />
              </button>
              <div className="relative z-10 flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-sm">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-[24px] font-bold tracking-tight leading-tight">Add Employee</h2>
                  <p className="text-[13px] font-medium text-blue-100">Onboard a new team member</p>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <form onSubmit={handleAddEmployee} className="p-8">
              <div className="grid grid-cols-1 gap-5 mb-8">
                <div>
                  <label className="block text-[12.5px] font-bold text-[var(--app-muted)] mb-2 tracking-tight uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-[var(--app-ink)] outline-none focus:border-blue-500 focus:bg-white transition-all" 
                      placeholder="e.g. Jane Doe"
                      value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12.5px] font-bold text-[var(--app-muted)] mb-2 tracking-tight uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-[var(--app-ink)] outline-none focus:border-blue-500 focus:bg-white transition-all" 
                      placeholder="jane@company.com"
                      value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12.5px] font-bold text-[var(--app-muted)] mb-2 tracking-tight uppercase">Role</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-[var(--app-ink)] outline-none focus:border-blue-500 focus:bg-white transition-all" 
                      placeholder="e.g. Designer"
                      value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-bold text-[var(--app-muted)] mb-2 tracking-tight uppercase">Department</label>
                    <select 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-[var(--app-ink)] outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer" 
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b6b6b\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '18px' }}
                      value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})}
                    >
                      <option value="" disabled>Select</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-xl text-[14px] font-bold bg-white border border-gray-200 text-[var(--app-ink)] hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-bold bg-blue-600 border border-transparent text-white hover:bg-blue-700 shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)] transition-all">
                  <CheckCircle2 className="w-4 h-4" />
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
