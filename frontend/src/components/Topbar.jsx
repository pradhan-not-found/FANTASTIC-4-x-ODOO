import { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';

export default function Topbar({ title, subtitle, children }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 h-[64px] bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] backdrop-blur-md bg-white/80 shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[16px] font-bold text-[var(--app-ink)] tracking-tight">{title}</div>
          {subtitle && <div className="text-[12px] text-[var(--app-muted)] mt-[1px]">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-4">
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
