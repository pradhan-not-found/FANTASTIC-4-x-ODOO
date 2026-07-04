import { useState, useEffect } from 'react';
import { Bell, Settings, LogIn, LogOut } from 'lucide-react';
import { MY_PROFILE } from '../data/mockData';

export default function Topbar({ title, subtitle, children }) {
  const [now, setNow] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [attendanceId, setAttendanceId] = useState(null);
  const [hasCheckedOutToday, setHasCheckedOutToday] = useState(false);
  const [showCheckOutMessage, setShowCheckOutMessage] = useState(false);
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  useEffect(() => {
    if (user.id) {
       fetch(`http://localhost:3000/api/attendance/${user.id}`)
         .then(res => res.json())
         .then(data => {
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = data.find(d => d.date === today && !d.checkOut);
            const completedRecord = data.find(d => d.date === today && d.checkOut);
            
            if (completedRecord) {
               setHasCheckedOutToday(true);
            } else if (todayRecord) {
               setIsCheckedIn(true);
               const [hours, minutes] = todayRecord.checkIn.split(':');
               const d = new Date();
               d.setHours(parseInt(hours, 10));
               d.setMinutes(parseInt(minutes, 10));
               d.setSeconds(0);
               setCheckInTime(d);
               setAttendanceId(todayRecord.id);
            }
         })
         .catch(err => console.error("Error fetching attendance:", err));
    }
  }, [user.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);
      if (isCheckedIn && checkInTime) {
        const diff = currentTime - checkInTime;
        const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        setElapsed(`${hrs}:${mins}:${secs}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn, checkInTime]);

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleCheckInOut = async () => {
    if (isCheckedIn) {
      if (attendanceId) {
        try {
          await fetch(`http://localhost:3000/api/attendance/checkout/${attendanceId}`, {
            method: 'PUT'
          });
        } catch (error) {
          console.error(error);
        }
      }
      setIsCheckedIn(false);
      setCheckInTime(null);
      setElapsed('00:00:00');
      setAttendanceId(null);
      setHasCheckedOutToday(true);
      setShowCheckOutMessage(true);
    } else {
      if (hasCheckedOutToday) {
        setShowCheckOutMessage(true);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/api/attendance/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ empId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            setIsCheckedIn(true);
            setCheckInTime(new Date());
            setAttendanceId(data.id);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {showCheckOutMessage && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          
          <img src="/logo.png" className="h-[48px] w-auto object-contain absolute top-12 left-12 animate-in fade-in slide-in-from-top-4 duration-700" alt="Workplace Logo" />
          
          <div className="max-w-[640px] w-full text-center flex flex-col items-center">
            <div className="w-28 h-28 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.04)] rounded-[32px] flex items-center justify-center mb-8 shadow-inner animate-in zoom-in-75 duration-700">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            
            <h1 className="text-[48px] font-black text-[var(--app-ink)] tracking-tighter leading-none mb-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
              Already Signed Out
            </h1>
            
            <p className="text-[18px] text-[var(--app-muted)] leading-relaxed mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-200 max-w-[500px]">
              You have successfully completed your work hours for today. Please return tomorrow to check in and resume your activities. Have a great evening!
            </p>
            
            <button 
              onClick={() => setShowCheckOutMessage(false)} 
              className="px-10 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-[16px] shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 animate-in slide-in-from-bottom-8 duration-700 delay-300 uppercase tracking-widest"
            >
              Return to Application
            </button>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-50 flex items-center justify-between px-8 h-[64px] bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] backdrop-blur-md bg-white/80 shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[16px] font-bold text-[var(--app-ink)] tracking-tight">{title}</div>
          {subtitle && <div className="text-[12px] text-[var(--app-muted)] mt-[1px]">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Check-In/Out Widget */}
        <div className="flex items-center bg-white p-1 rounded-full border border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] mr-2 transition-all">
          {isCheckedIn ? (
            <div className="flex items-center gap-4 pl-3 pr-1">
               <div className="flex items-center gap-2">
                 <div className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-widest leading-none mb-0.5">Checked In</span>
                   <span className="text-[13px] font-mono font-bold text-[#1a1a1a] leading-none tracking-tight">{elapsed}</span>
                 </div>
               </div>
               <button 
                 onClick={handleCheckInOut}
                 className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full text-[12.5px] font-bold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
               >
                 <LogOut className="w-3.5 h-3.5" /> Check Out
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-3 pr-1">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                 <div className="flex flex-col">
                   <span className="text-[9px] text-[var(--app-muted)] font-bold uppercase tracking-widest leading-none mb-0.5">Status</span>
                   <span className="text-[12.5px] font-bold text-[#1a1a1a] leading-none tracking-tight">Not Checked In</span>
                 </div>
               </div>
               <button 
                 onClick={handleCheckInOut}
                 className="flex items-center gap-1.5 bg-[#1a1a1a] px-4 py-1.5 rounded-full text-[12.5px] font-bold text-white hover:bg-black hover:shadow-md hover:-translate-y-[0.5px] transition-all"
               >
                 <LogIn className="w-3.5 h-3.5" /> Check In
               </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end mr-2">
          <span className="text-[12px] font-semibold text-[var(--app-ink)] tracking-tight">{timeStr}</span>
          <span className="text-[10px] font-medium text-[var(--app-muted)] uppercase tracking-wider">{dateStr}</span>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--app-soft)] text-[var(--app-muted)] hover:text-[var(--app-ink)] transition-colors border border-[rgba(0,0,0,0.06)] shadow-sm" title="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--app-soft)] text-[var(--app-muted)] hover:text-[var(--app-ink)] transition-colors border border-[rgba(0,0,0,0.06)] shadow-sm" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
    </>
  );
}
