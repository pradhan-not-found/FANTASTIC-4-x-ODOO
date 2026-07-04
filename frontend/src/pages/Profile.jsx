import { useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { MY_PROFILE } from '../data/mockData';
import html2canvas from 'html2canvas';

export default function Profile() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const idCardRef = useRef(null);

  const handleDownload = async () => {
    if (!idCardRef.current) return;
    try {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${MY_PROFILE.name.replace(/\s+/g, '_')}_ID_Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download ID card", err);
    }
  };
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

              {/* Leave Balance Widget */}
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Leave Balance</h3>
                  <a href="/leaves" className="text-[12px] text-blue-600 font-medium hover:underline">View all</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
                    <span className="text-[13px] font-semibold">Paid Leave</span>
                    <span className="text-[16px] font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] text-[var(--app-ink)]">
                    <span className="text-[13px] font-semibold">Sick Leave</span>
                    <span className="text-[16px] font-bold">4</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] text-[var(--app-ink)]">
                    <span className="text-[13px] font-semibold">Unpaid Leave</span>
                    <span className="text-[16px] font-bold">∞</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate mt-6">
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
              {/* Professional ID Card */}
              <div>
                <div ref={idCardRef} className="relative group w-full mx-auto" style={{ perspective: '1000px' }}>
                  {/* Lanyard Hole */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 border-[3px] border-[rgba(0,0,0,0.15)] rounded-t-xl bg-gradient-to-b from-gray-50 to-gray-200 shadow-sm z-0"></div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-3 rounded-full bg-[var(--app-canvas)] border-[2px] border-[rgba(0,0,0,0.1)] z-20 shadow-inner"></div>
                
                {/* Card Container */}
                <div className="relative bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-[rgba(0,0,0,0.08)] z-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
                  {/* Card Header */}
                  <div className="h-[100px] bg-gradient-to-br from-[#11131e] to-[#25324b] relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,15,24,0.6)_100%)] pointer-events-none"></div>
                    <div className="absolute top-5 w-full px-6 flex justify-between items-center">
                      <img src="/logo.png" className="h-5 brightness-0 invert opacity-90" alt="Company Logo" />
                      <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/10 px-2 py-1 rounded backdrop-blur-md border border-white/10">STAFF</span>
                    </div>
                  </div>
                  
                  {/* Photo */}
                  <div className="absolute top-[52px] left-1/2 -translate-x-1/2 p-1.5 bg-white rounded-2xl shadow-sm z-20">
                    <div className="w-[80px] h-[80px] bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-[12px] flex items-center justify-center text-blue-700 font-bold text-[28px] tracking-tight overflow-hidden shadow-inner">
                      {MY_PROFILE.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="pt-[52px] pb-7 px-7 text-center bg-white relative">
                    <h3 className="text-[20px] font-bold text-[var(--app-ink)] tracking-tight leading-tight mb-1">{MY_PROFILE.name}</h3>
                    <p className="text-[13px] font-semibold text-blue-600 mb-6">{MY_PROFILE.role}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left border-t border-[rgba(0,0,0,0.06)] pt-5 mb-6">
                      <div>
                        <div className="text-[9.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">ID Number</div>
                        <div className="text-[13.5px] font-mono font-semibold text-[var(--app-ink)]">{MY_PROFILE.empId}</div>
                      </div>
                      <div>
                        <div className="text-[9.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Date Joined</div>
                        <div className="text-[13.5px] font-semibold text-[var(--app-ink)]">{MY_PROFILE.joinDate}</div>
                      </div>
                    </div>
                    
                    {/* Fake Barcode */}
                    <div className="flex justify-center h-10 w-full px-2 opacity-80 overflow-hidden mix-blend-multiply">
                      {[3,1,4,1,5,9,2,6,5,3,5,8,9,7,9,3,2,3,8,4,6,2,6,4,3,3,8,3,2,7,9,5].map((w, i) => (
                        <div key={i} className="bg-[#111] h-full" style={{ width: `${w * 1.2}px`, marginRight: `${(w % 2 === 0 ? 1 : 2)}px` }}></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subtle holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay transition-all duration-[1.5s] pointer-events-none -translate-x-[150%] group-hover:translate-x-[150%]"></div>
                </div>
              </div>
            </div>

            {/* Download Button */}
              <button 
                onClick={handleDownload}
                className="mt-2 w-full py-3.5 bg-white border border-[rgba(0,0,0,0.12)] rounded-2xl text-[14px] font-bold text-[var(--app-ink)] hover:bg-[var(--app-soft)] flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group"
              >
                <svg className="text-[var(--app-muted)] group-hover:text-blue-600 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download ID Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
