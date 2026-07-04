import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { EMPLOYEES } from '../data/mockData';
import { X, UserPlus, Mail, CheckCircle2, User, Plane, Circle } from 'lucide-react';

export default function Employees() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const [employeesList, setEmployeesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', role: '', department: '' });

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees');
      if (res.ok) {
        const data = await res.json();
        // Backend returns oldest first generally, or based on db. We can reverse it to show newest first.
        setEmployeesList(data.reverse());
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email || !newEmp.role || !newEmp.department) return;
    
    const nameParts = newEmp.name.trim().split(/\s+/);
    const firstName = nameParts[0] || 'XX';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'XX';
    
    const first2First = firstName.substring(0, 2).toUpperCase().padEnd(2, 'X');
    const first2Last = lastName.substring(0, 2).toUpperCase().padEnd(2, 'X');
    
    const currentYear = new Date().getFullYear();
    const companyInitials = "OI";
    
    // Filter employees by year to get serial number
    const employeesThisYear = employeesList.filter(e => {
       const yearPart = e.id.substring(6, 10);
       return yearPart === currentYear.toString();
    });
    const serialNumber = (employeesThisYear.length + 1).toString().padStart(4, '0');
    
    const generatedId = `${companyInitials}${first2First}${first2Last}${currentYear}${serialNumber}`;
    // Simple secure auto-generated password
    const generatedPassword = Math.random().toString(36).slice(-6) + "A1!";

    const emp = {
      id: generatedId,
      name: newEmp.name,
      role: newEmp.role,
      position: newEmp.role,
      department: newEmp.department,
      email: newEmp.email,
      password: generatedPassword,
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'active'
    };
    
    try {
      const res = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emp)
      });
      
      if (res.ok) {
        setEmployeesList([emp, ...employeesList]);
        setIsModalOpen(false);
        setNewEmp({ name: '', email: '', role: '', department: '' });
        alert(`Employee added successfully!\n\nLogin ID: ${generatedId}\nPassword: ${generatedPassword}\n\nPlease share these credentials with the employee.`);
      } else {
        const errorData = await res.json();
        alert(`Failed to add employee: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Network error while adding employee.');
    }
  };

  return (
    <>
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

          <div className="mb-6 flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search by name, ID, role..." className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13px] bg-white w-[280px] outline-none focus:border-blue-500 transition-all placeholder:text-[var(--app-muted)] shadow-sm" />
              <select className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13px] bg-white outline-none cursor-pointer shadow-sm text-[var(--app-ink)] font-medium">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>HR</option>
              </select>
            </div>
            <div className="text-[13px] text-[var(--app-muted)] font-medium bg-[var(--app-soft)] px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.06)]">
              Showing {employeesList.length} results
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employeesList.map(e => {
              // Determine visual status based on mockup logic
              const isOnLeave = e.status === 'on-leave';
              const isAbsent = e.status === 'absent'; // Simulate absent
              
              let StatusIcon = Circle;
              let statusColor = "bg-green-500";
              
              if (isOnLeave) {
                 StatusIcon = Plane;
                 statusColor = "bg-blue-500 text-white";
              } else if (isAbsent) {
                 statusColor = "bg-amber-500";
              }
              
              return (
                <div key={e.id} className="liquid-card-shell rounded-[18px] p-6 card-elevate relative group hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center cursor-pointer">
                  
                  {/* Status Indicator (Top Right) */}
                  <div className="absolute top-4 right-4" title={isOnLeave ? 'On Leave' : isAbsent ? 'Absent' : 'Present'}>
                    {isOnLeave ? (
                       <div className={`w-7 h-7 rounded-full flex items-center justify-center ${statusColor} shadow-sm`}>
                         <StatusIcon className="w-4 h-4" />
                       </div>
                    ) : (
                       <div className={`w-3.5 h-3.5 rounded-full ${statusColor} border-2 border-white shadow-sm ring-1 ring-[rgba(0,0,0,0.05)]`}></div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[24px] text-blue-700 mb-4 shadow-sm relative overflow-hidden">
                     {e.avatar || e.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  
                  {/* Details */}
                  <h3 className="font-bold text-[16px] text-[var(--app-ink)] tracking-tight mb-1">{e.name}</h3>
                  <div className="text-[13px] font-medium text-[var(--app-muted)] mb-0.5">{e.role}</div>
                  <div className="text-[11.5px] font-bold tracking-widest uppercase text-blue-600 mb-4">{e.department}</div>
                  
                  <div className="w-full h-[1px] bg-[rgba(0,0,0,0.06)] my-4"></div>
                  
                  <div className="w-full flex justify-between items-center text-[12px]">
                    <span className="font-mono text-[var(--app-muted)]">{e.id}</span>
                    <button className="text-blue-600 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Profile</button>
                  </div>
                </div>
              );
            })}
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
    </>
  );
}
