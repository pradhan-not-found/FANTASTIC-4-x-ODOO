import { useState, useEffect } from 'react';
import { Bell, Settings, LogIn, LogOut } from 'lucide-react';
import { MY_PROFILE } from '../data/mockData';

export default function Topbar({ title, subtitle, children }) {
  const [now, setNow] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsed, setElapsed] = useState('00:00:00');

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

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckInTime(null);
      setElapsed('00:00:00');
    } else {
      setIsCheckedIn(true);
      setCheckInTime(new Date());
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
        <div className="flex items-center bg-[var(--app-soft)] p-1 rounded-xl border border-[rgba(0,0,0,0.06)] mr-2">
          {isCheckedIn ? (
            <div className="flex items-center gap-3 pl-3 pr-1">
               <div className="flex flex-col">
                 <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider leading-none mb-0.5">Checked In</span>
                 <span className="text-[12.5px] font-mono font-bold text-green-700 leading-none">{elapsed}</span>
               </div>
               <button 
                 onClick={handleCheckInOut}
                 className="flex items-center gap-1.5 bg-white border border-[rgba(0,0,0,0.08)] px-3 py-1.5 rounded-lg text-[12px] font-bold text-[var(--app-ink)] hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm"
               >
                 <LogOut className="w-3.5 h-3.5" /> Check Out
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-3 pr-1">
               <div className="flex flex-col">
                 <span className="text-[10px] text-[var(--app-muted)] font-bold uppercase tracking-wider leading-none mb-0.5">Status</span>
                 <span className="text-[12px] font-bold text-[var(--app-muted)] leading-none">Not Checked In</span>
               </div>
               <button 
                 onClick={handleCheckInOut}
                 className="flex items-center gap-1.5 bg-black px-3 py-1.5 rounded-lg text-[12px] font-bold text-white hover:bg-[var(--app-ink)] transition-colors shadow-sm"
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
