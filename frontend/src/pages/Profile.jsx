import { useRef, useState } from 'react';
import Topbar from '../components/Topbar';
import { MY_PROFILE, MY_PAYROLL } from '../data/mockData';
import html2canvas from 'html2canvas';

export default function Profile() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const idCardRef = useRef(null);
  const [activeTab, setActiveTab] = useState('resume');

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
    <>
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
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-[rgba(0,0,0,0.06)] mb-2 overflow-x-auto no-scrollbar liquid-row">
              {['Resume', 'Private Info', role === 'admin' ? 'Salary Info' : null, 'Security'].filter(Boolean).map(tab => {
                const tabKey = tab.toLowerCase().replace(' ', '-');
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tabKey)}
                    className={`px-5 py-3 text-[13.5px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tabKey ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-ink)] hover:border-[rgba(0,0,0,0.1)]'}`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {activeTab === 'resume' && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">About Me</h3>
                    <button className="text-[12px] text-blue-600 font-bold hover:underline">Edit</button>
                  </div>
                  <p className="text-[14px] text-[var(--app-muted)] leading-relaxed">{MY_PROFILE.about}</p>
                </div>
                
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4">What I love about my job</h3>
                  <p className="text-[14px] text-[var(--app-muted)] leading-relaxed">{MY_PROFILE.loveAboutJob}</p>
                </div>

                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4">My interests and hobbies</h3>
                  <p className="text-[14px] text-[var(--app-muted)] leading-relaxed">{MY_PROFILE.interests}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Skills</h3>
                      <button className="text-[12px] text-blue-600 font-bold hover:underline">+ Add skills</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {MY_PROFILE.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] rounded-lg text-[12.5px] font-medium text-[var(--app-ink)]">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Certifications</h3>
                      <button className="text-[12px] text-blue-600 font-bold hover:underline">+ Add cert</button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {MY_PROFILE.certifications.map(cert => (
                        <div key={cert} className="px-3 py-2 bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] rounded-lg text-[12.5px] font-medium text-[var(--app-ink)] leading-tight">{cert}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'private-info' && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Personal Details */}
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Date of Birth</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.dob}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Nationality</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.nationality}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Gender</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.gender}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Marital Status</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.maritalStatus}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Residing Address</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.residingAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">Bank Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Bank Name</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.bankDetails.bankName}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Account Number</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.bankDetails.accountNo}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">IFSC Code</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.bankDetails.ifsc}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">PAN No.</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{MY_PROFILE.bankDetails.pan}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salary-info' && role === 'admin' && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <div className="flex items-center justify-between mb-5 border-b border-[rgba(0,0,0,0.06)] pb-4">
                    <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Salary Configuration</h3>
                    <div className="flex gap-4 items-center">
                       <span className="text-[12px] font-bold text-[var(--app-muted)] uppercase tracking-widest">Monthly Wage</span>
                       <div className="bg-[var(--app-soft)] px-4 py-2 rounded-lg font-mono font-bold text-[16px] text-[var(--app-ink)]">₹{MY_PROFILE.salary.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <h4 className="text-[13px] font-bold text-[var(--app-muted)] uppercase tracking-widest mb-3">Earnings</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[var(--app-ink)] font-medium">Basic Salary (50%)</span>
                          <span className="font-mono font-bold">₹{(MY_PROFILE.salary * 0.5).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[var(--app-ink)] font-medium">House Rent Allowance (50% of Basic)</span>
                          <span className="font-mono font-bold">₹{(MY_PROFILE.salary * 0.25).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[var(--app-ink)] font-medium">Standard Allowance</span>
                          <span className="font-mono font-bold">₹4,167</span>
                        </div>
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[var(--app-ink)] font-medium">Fixed Allowance</span>
                          <span className="font-mono font-bold">₹{(MY_PROFILE.salary - (MY_PROFILE.salary * 0.75) - 4167).toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] flex justify-between items-center text-[15px]">
                          <span className="text-green-700 font-bold">Total Earnings</span>
                          <span className="font-mono font-bold text-green-700">₹{MY_PROFILE.salary.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-bold text-[var(--app-muted)] uppercase tracking-widest mb-3">Deductions</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[var(--app-ink)] font-medium">Provident Fund (12% of Basic)</span>
                          <span className="font-mono font-bold text-red-600">₹{(MY_PROFILE.salary * 0.5 * 0.12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[14px]">
                          <span className="text-[var(--app-ink)] font-medium">Professional Tax</span>
                          <span className="font-mono font-bold text-red-600">₹200</span>
                        </div>
                        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] flex justify-between items-center text-[15px] mt-auto">
                          <span className="text-red-700 font-bold">Total Deductions</span>
                          <span className="font-mono font-bold text-red-700">₹{((MY_PROFILE.salary * 0.5 * 0.12) + 200).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">Update Password</h3>
                  <div className="flex flex-col gap-4 max-w-sm">
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] border border-[rgba(0,0,0,0.08)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">New Password</label>
                      <input type="password" placeholder="Min 8 characters" className="w-full text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] border border-[rgba(0,0,0,0.08)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Confirm New Password</label>
                      <input type="password" placeholder="Min 8 characters" className="w-full text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] border border-[rgba(0,0,0,0.08)] px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
                    </div>
                    <button className="mt-2 w-full px-5 py-2.5 rounded-lg text-[13.5px] font-bold bg-[#171717] text-white hover:bg-black shadow-sm transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Professional Brutalist ID Card */}
            <div>
              <div ref={idCardRef} className="w-[340px] h-[500px] bg-white mx-auto p-6 flex flex-col shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.05)] relative group overflow-hidden">
                
                {/* Subtle texture overlay for vintage feel */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                {/* Header Section */}
                <div className="mb-4 relative z-10">
                  <div className="text-[10px] font-mono tracking-widest text-[#1a1a1a] uppercase font-bold mb-1">SUBJECT :</div>
                  <div className="w-full h-[1px] bg-[#1a1a1a] mb-2"></div>
                  <h2 className="text-[46px] font-black text-[#1a1a1a] leading-[0.85] tracking-tighter">
                    {MY_PROFILE.name.split(' ')[0]}<br/>
                    {MY_PROFILE.name.split(' ')[1] || ''}
                  </h2>
                  <div className="w-full h-[1px] bg-[#1a1a1a] mt-4"></div>
                </div>

                {/* Body Section */}
                <div className="flex-1 flex gap-5 w-full relative z-10 pt-1 pb-2">
                  {/* Photo container with halftone/grayscale effect */}
                  <div className="flex-1 bg-[#d4d4cb] flex items-center justify-center overflow-hidden mix-blend-multiply grayscale contrast-125 border border-[#1a1a1a]/10 relative">
                     <span className="text-[#a8a89e] font-black text-[80px] opacity-40 tracking-tighter">
                       {MY_PROFILE.name.split(' ').map(n=>n[0]).join('')}
                     </span>
                     {/* Scanline effect */}
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                  </div>

                  {/* Vertical Barcode */}
                  <div className="w-8 flex flex-col justify-between py-0.5 opacity-90 mix-blend-multiply">
                    {[2,4,1,3,1,2,5,1,1,3,2,1,4,1,2,3,1,5,1,1,2,3,1,4,1,2,1,3,2,1,4,1,2,1,1,3,2,4,1,2,1].map((h, i) => (
                      <div key={i} className="w-full bg-[#1a1a1a]" style={{ height: `${h * 1.5}px`, marginBottom: `${(h % 2 === 0 ? 1 : 2)}px` }}></div>
                    ))}
                  </div>
                </div>

                {/* ID Section */}
                <div className="mt-1 mb-6 relative z-10">
                  <div className="text-[12px] font-mono font-bold tracking-widest text-[#1a1a1a] uppercase">
                    ID: {MY_PROFILE.id.replace('EMP-', '000')}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-[#1a1a1a] pt-3 flex justify-between items-end relative z-10">
                  <div className="text-[18px] font-black text-[#1a1a1a] leading-[1] tracking-tighter">
                    {role === 'admin' ? (
                      <>Admin<br/>Dept.</>
                    ) : (
                      <>{MY_PROFILE.department}<br/>Dept.</>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" className="h-[14px] w-auto object-contain brightness-0" alt="Logo" />
                    <div className="flex gap-[2px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-[#1a1a1a]"></div>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#1a1a1a]"></div>
                      <div className="w-[5px] h-[5px] rounded-full bg-[#1a1a1a]"></div>
                    </div>
                  </div>
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
    </>
  );
}
