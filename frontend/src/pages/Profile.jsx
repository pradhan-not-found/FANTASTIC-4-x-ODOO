import { useRef, useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import * as htmlToImage from 'html-to-image';
import { X, Camera } from 'lucide-react';

export default function Profile() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const idCardRef = useRef(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState('basic');
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({
    name: '', department: '', position: '', phone: '', about: '',
    loveAboutJob: '', interests: '', skills: '', certifications: '',
    dob: '', residingAddress: '', nationality: '', personalEmail: '',
    gender: '', maritalStatus: '', bankAccountNo: '', bankName: '', ifsc: '', pan: '', uan: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  const fetchProfile = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        // Parse JSON strings back to arrays if needed, SQLite stores strings
        if (typeof data.skills === 'string' && data.skills.startsWith('[')) {
          try { data.skills = JSON.parse(data.skills); } catch(e){}
        }
        if (typeof data.certifications === 'string' && data.certifications.startsWith('[')) {
          try { data.certifications = JSON.parse(data.certifications); } catch(e){}
        }
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${profile.id}/avatar`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      
      // Update local storage user avatar
      const userStr = localStorage.getItem('hrms_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        u.avatar = data.avatar;
        localStorage.setItem('hrms_user', JSON.stringify(u));
      }
      
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Error uploading avatar: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!idCardRef.current || !profile) return;
    try {
      const dataUrl = await htmlToImage.toPng(idCardRef.current, {
        pixelRatio: 2,
        backgroundColor: 'white'
      });
      const link = document.createElement('a');
      link.download = `${profile.name.replace(/\s+/g, '_')}_ID_Card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download ID card", err);
      alert("Failed to download ID card: " + err.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      const payload = {
        ...editForm,
        skills: JSON.stringify(editForm.skills.split(',').map(s => s.trim()).filter(Boolean)),
        certifications: JSON.stringify(editForm.certifications.split(',').map(s => s.trim()).filter(Boolean))
      };
      
      const response = await fetch(`http://localhost:3000/api/employees/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const userStr = localStorage.getItem('hrms_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        u.name = editForm.name;
        localStorage.setItem('hrms_user', JSON.stringify(u));
      }
      
      fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error updating profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (!profile) return <div className="p-8">Profile not found.</div>;

  const skillsList = Array.isArray(profile.skills) ? profile.skills : (profile.skills ? JSON.parse(profile.skills || '[]') : []);
  const certsList = Array.isArray(profile.certifications) ? profile.certifications : (profile.certifications ? JSON.parse(profile.certifications || '[]') : []);

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
              <div className="w-[100px] h-[100px] bg-blue-100 border-[4px] border-white rounded-2xl flex items-center justify-center text-blue-700 font-bold text-[36px] shadow-sm overflow-hidden bg-cover bg-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
                ) : (
                  profile.name && profile.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-[24px] font-bold text-[var(--app-ink)] tracking-tight mb-1">{profile.name}</h1>
                <div className="text-[14px] text-[var(--app-muted)] font-medium flex items-center gap-3">
                  <span>{profile.role}</span>
                  <span className="w-1 h-1 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                  <span>{profile.department}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditForm({
                  name: profile.name || '',
                  department: profile.department || '',
                  position: profile.position || '',
                  phone: profile.phone || '',
                  about: profile.about || '',
                  loveAboutJob: profile.loveAboutJob || '',
                  interests: profile.interests || '',
                  skills: skillsList.join(', '),
                  certifications: certsList.join(', '),
                  dob: profile.dob || '',
                  residingAddress: profile.residingAddress || '',
                  nationality: profile.nationality || '',
                  personalEmail: profile.personalEmail || '',
                  gender: profile.gender || '',
                  maritalStatus: profile.maritalStatus || '',
                  bankAccountNo: profile.bankAccountNo || '',
                  bankName: profile.bankName || '',
                  ifsc: profile.ifsc || '',
                  pan: profile.pan || '',
                  uan: profile.uan || ''
                });
                setIsEditing(true);
              }}
              className="px-5 py-2.5 rounded-lg text-[13.5px] font-medium bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all mb-1 z-10">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-[rgba(0,0,0,0.06)] mb-2 overflow-x-auto no-scrollbar liquid-row">
              {['Resume', 'Private Info', 'Security'].map(tab => {
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
                  </div>
                  <p className="text-[14px] text-[var(--app-muted)] leading-relaxed">{profile.about || 'Not provided'}</p>
                </div>
                
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4">What I love about my job</h3>
                  <p className="text-[14px] text-[var(--app-muted)] leading-relaxed">{profile.loveAboutJob || 'Not provided'}</p>
                </div>

                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4">My interests and hobbies</h3>
                  <p className="text-[14px] text-[var(--app-muted)] leading-relaxed">{profile.interests || 'Not provided'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] rounded-lg text-[12.5px] font-medium text-[var(--app-ink)]">{skill}</span>
                      ))}
                      {skillsList.length === 0 && <span className="text-[12px] text-[var(--app-muted)]">No skills added</span>}
                    </div>
                  </div>
                  <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight">Certifications</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {certsList.map(cert => (
                        <div key={cert} className="px-3 py-2 bg-[var(--app-soft)] border border-[rgba(0,0,0,0.06)] rounded-lg text-[12.5px] font-medium text-[var(--app-ink)] leading-tight">{cert}</div>
                      ))}
                      {certsList.length === 0 && <span className="text-[12px] text-[var(--app-muted)]">No certifications added</span>}
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
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.dob || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Nationality</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.nationality || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Gender</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.gender || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Marital Status</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.maritalStatus || '-'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Bank Details */}
                <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
                  <h3 className="text-[15px] font-bold text-[var(--app-ink)] mb-5 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4">Bank Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Account Number</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.bankAccountNo || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">Bank Name</label>
                      <div className="text-[14px] font-medium text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.bankName || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">IFSC Code</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.ifsc || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">PAN Number</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.pan || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[11.5px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5 block">UAN</label>
                      <div className="text-[14px] font-mono text-[var(--app-ink)] bg-[var(--app-soft)] px-3 py-2 rounded-lg">{profile.uan || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="liquid-card-shell rounded-[18px] p-6 card-elevate animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4">Update Password</h3>
                <div className="flex flex-col gap-4 max-w-[400px]">
                  <input type="password" placeholder="Current Password" className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                  <input type="password" placeholder="New Password" className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                  <input type="password" placeholder="Confirm New Password" className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                  <button className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all w-max mt-2">
                    Save Password
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
              <h2 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4 border-b border-[rgba(0,0,0,0.06)] pb-4">Digital ID Card</h2>
              <div ref={idCardRef} className="bg-white rounded-[16px] border border-[rgba(0,0,0,0.12)] shadow-sm overflow-hidden mb-4 relative">
                <div className="h-16 bg-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                </div>
                <div className="px-5 pb-5 flex flex-col items-center text-center -mt-8 relative z-10">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center font-bold text-[20px] text-blue-700 shadow-sm mb-3 overflow-hidden bg-cover bg-center">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
                    ) : (
                      profile.name && profile.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div className="font-bold text-[16px] text-[var(--app-ink)] leading-tight">{profile.name}</div>
                  <div className="text-[12px] font-medium text-[var(--app-muted)] mb-4">{profile.role}</div>
                  
                  <div className="w-full bg-[var(--app-soft)] rounded-lg p-3 grid grid-cols-2 gap-y-3 gap-x-2 text-left">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest font-bold text-[var(--app-muted)]">EMP ID</div>
                      <div className="font-mono text-[11px] font-semibold text-[var(--app-ink)]">{profile.id}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-widest font-bold text-[var(--app-muted)]">Blood</div>
                      <div className="font-semibold text-[11px] text-[var(--app-ink)]">O+</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[9px] uppercase tracking-widest font-bold text-[var(--app-muted)]">Dept</div>
                      <div className="font-semibold text-[11px] text-[var(--app-ink)]">{profile.department}</div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleDownload}
                className="w-full py-2.5 rounded-lg text-[13px] font-bold text-[var(--app-ink)] border border-[rgba(0,0,0,0.12)] hover:bg-[var(--app-soft)] shadow-sm transition-all text-center">
                ↓ Download ID Card
              </button>
            </div>
            
            <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
              <h2 className="text-[15px] font-bold text-[var(--app-ink)] tracking-tight mb-4 border-b border-[rgba(0,0,0,0.06)] pb-4">Contact Info</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Email (Work)</div>
                  <div className="text-[13px] font-medium text-blue-600">{profile.email}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Phone</div>
                  <div className="text-[13px] font-medium text-[var(--app-ink)]">{profile.phone || '-'}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Join Date</div>
                  <div className="text-[13px] font-medium text-[var(--app-ink)]">{profile.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[800px] max-h-[90vh] flex flex-col shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.01)] shrink-0">
              <div>
                <h2 className="text-[20px] font-bold tracking-tight text-[var(--app-ink)]">Edit Profile</h2>
                <p className="text-[13px] text-[var(--app-muted)] mt-0.5">Update your personal and professional details.</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-[var(--app-muted)] hover:text-[var(--app-ink)] bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)] rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-[rgba(0,0,0,0.06)] px-6 shrink-0 bg-white">
              {['Basic', 'About', 'Personal', 'Bank'].map(tab => {
                const tabKey = tab.toLowerCase();
                return (
                  <button 
                    key={tab}
                    type="button"
                    onClick={() => setEditTab(tabKey)}
                    className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-colors ${editTab === tabKey ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-ink)]'}`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[rgba(0,0,0,0.01)] relative">
              <form id="edit-profile-form" onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                
                {editTab === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-[20px] text-blue-700 shadow-sm overflow-hidden relative group bg-cover bg-center">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
                          ) : (
                            profile.name && profile.name.split(' ').map(n => n[0]).join('')
                          )}
                          <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-bold uppercase">Change</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                          </label>
                        </div>
                        <div className="text-[12px] text-[var(--app-muted)] max-w-[250px]">Upload a square image, max 2MB. JPG or PNG.</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Full Name</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" required />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Phone Number</label>
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Department</label>
                      <input type="text" value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Position</label>
                      <input type="text" value={editForm.position} onChange={e => setEditForm({...editForm, position: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>
                )}

                {editTab === 'about' && (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">About Me</label>
                      <textarea value={editForm.about} onChange={e => setEditForm({...editForm, about: e.target.value})} className="w-full px-4 py-3 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm min-h-[100px] resize-none" placeholder="A brief bio..."></textarea>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">What I love about my job</label>
                      <textarea value={editForm.loveAboutJob} onChange={e => setEditForm({...editForm, loveAboutJob: e.target.value})} className="w-full px-4 py-3 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm min-h-[80px] resize-none"></textarea>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Interests & Hobbies</label>
                      <textarea value={editForm.interests} onChange={e => setEditForm({...editForm, interests: e.target.value})} className="w-full px-4 py-3 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm min-h-[80px] resize-none"></textarea>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Skills (comma separated)</label>
                      <input type="text" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" placeholder="e.g. React, Node.js, Design" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Certifications (comma separated)</label>
                      <input type="text" value={editForm.certifications} onChange={e => setEditForm({...editForm, certifications: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>
                )}

                {editTab === 'personal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Date of Birth</label>
                      <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Gender</label>
                      <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm bg-white">
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Nationality</label>
                      <input type="text" value={editForm.nationality} onChange={e => setEditForm({...editForm, nationality: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Marital Status</label>
                      <select value={editForm.maritalStatus} onChange={e => setEditForm({...editForm, maritalStatus: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm bg-white">
                        <option value="">Select...</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Residing Address</label>
                      <textarea value={editForm.residingAddress} onChange={e => setEditForm({...editForm, residingAddress: e.target.value})} className="w-full px-4 py-3 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm min-h-[80px] resize-none"></textarea>
                    </div>
                  </div>
                )}

                {editTab === 'bank' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                    <div className="md:col-span-2">
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-[13px] font-medium flex items-start gap-3">
                        <span className="text-[18px]">ℹ️</span>
                        <p>Your bank details are securely stored. Please ensure these are accurate as they are used for payroll processing.</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Bank Name</label>
                      <input type="text" value={editForm.bankName} onChange={e => setEditForm({...editForm, bankName: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">Account Number</label>
                      <input type="text" value={editForm.bankAccountNo} onChange={e => setEditForm({...editForm, bankAccountNo: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">IFSC Code</label>
                      <input type="text" value={editForm.ifsc} onChange={e => setEditForm({...editForm, ifsc: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm uppercase" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">PAN Number</label>
                      <input type="text" value={editForm.pan} onChange={e => setEditForm({...editForm, pan: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm uppercase" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1.5">UAN Number</label>
                      <input type="text" value={editForm.uan} onChange={e => setEditForm({...editForm, uan: e.target.value})} className="w-full px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-[rgba(0,0,0,0.06)] bg-white flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-[var(--app-ink)] bg-white border border-[rgba(0,0,0,0.12)] hover:bg-[var(--app-soft)] transition-colors shadow-sm">
                Cancel
              </button>
              <button form="edit-profile-form" type="submit" disabled={isSaving} className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm min-w-[120px] flex justify-center">
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
