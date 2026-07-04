import { useState, useEffect } from 'react';
import { Bell, Settings, LogIn, LogOut } from 'lucide-react';
import { MY_PROFILE } from '../data/mockData';

export default function Topbar({ title, subtitle, children }) {
  const [now, setNow] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [attendanceId, setAttendanceId] = useState(null);
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  useEffect(() => {
    if (user.id) {
       fetch(`http://localhost:3000/api/attendance/${user.id}`)
         .then(res => res.json())
         .then(data => {
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = data.find(d => d.date === today && !d.checkOut);
            if (todayRecord) {
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
    } else {
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
  );
}
