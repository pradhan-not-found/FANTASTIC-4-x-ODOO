import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { MY_PROFILE } from '../data/mockData';


export default function Profile() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen apple-inset">
        <Topbar title="My Profile" subtitle="Manage your personal information" />
        
        <div className="flex-1 overflow-y-auto p-8 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 no-scrollbar">
          
          {/* Profile hero */}
          <div className="liquid-card-shell rounded-[18px] mb-6 overflow-hidden border border-[rgba(0,0,0,0.08)]">
            <div className="h-32 bg-blue-50/50 border-b border-[rgba(0,0,0,0.04)] relative">
              <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
            </div>
            <div className="px-8 pb-8 pt-0 relative flex flex-wrap items-end justify-between gap-6 -mt-12">
              <div className="flex items-end gap-6 flex-wrap relative z-10">
                <div className="w-[100px] h-[100px] bg-blue-100 border-[4px] border-white rounded-2xl flex items-center justify-center text-blue-700 font-bold text-[36px] shadow-sm">
                  {MY_PROFILE.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="mb-1">
                  <h1 className="text-[24px] font-bold text-[var(--app-ink)] tracking-tight mb-1">{MY_PROFILE.name}</h1>
                  <div className="text-[14px] text-[var(--app-muted)] font-medium flex items-center gap-3">
                    <span>{MY_PROFILE.role}</span>
                    <span className="w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                    <span>{MY_PROFILE.department}</span>
                  </div>
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-lg text-[13.5px] font-medium bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all mb-1 z-10">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
              
              {/* Personal Info */}
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                  <div>
                    <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Full Name</label>
                    <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.name}</div>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Email Address</label>
                    <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.email}</div>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Phone Number</label>
                    <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.phone}</div>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Location</label>
                    <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.location}</div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">Bank Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                  <div>
                    <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Bank Name</label>
                    <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">HDFC Bank</div>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Account Number</label>
                    <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">•••• •••• 8432</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Job Details Widget */}
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate bg-gradient-to-b from-blue-50/30 to-transparent">
                <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight">Employment</h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Employee ID</div>
                    <div className="text-[14px] font-medium text-[var(--app-ink)]">{MY_PROFILE.empId}</div>
                  </div>
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Date Joined</div>
                    <div className="text-[14px] font-medium text-[var(--app-ink)]">{MY_PROFILE.joinDate}</div>
                  </div>
                  <div>
                    <div className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Reporting Manager</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold border border-blue-200">
                        {MY_PROFILE.manager.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div className="text-[14px] font-medium text-[var(--app-ink)]">{MY_PROFILE.manager}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Balance Widget */}
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Leave Balance</h3>
                  <a href="/leaves" className="text-[12px] text-blue-600 font-medium hover:underline">View all</a>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
                    <span className="text-[13px] font-semibold">Paid Leave</span>
                    <span className="text-[15px] font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] text-[var(--app-ink)]">
                    <span className="text-[13px] font-semibold">Sick Leave</span>
                    <span className="text-[15px] font-bold">4</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] text-[var(--app-ink)]">
                    <span className="text-[13px] font-semibold">Unpaid Leave</span>
                    <span className="text-[15px] font-bold">∞</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
