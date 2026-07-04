export default function Topbar({ title, subtitle, children }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 h-[60px] bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[16px] font-bold text-[var(--app-ink)] tracking-tight">{title}</div>
          {subtitle && <div className="text-[12px] text-[var(--app-muted)] mt-[1px]">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-[var(--app-muted)] mr-2">{dateStr}</span>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--app-soft)] text-[var(--app-muted)] hover:text-[var(--app-ink)] transition-colors border border-[rgba(0,0,0,0.06)]" title="Notifications">
          <span className="text-[14px]">🔔</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--app-soft)] text-[var(--app-muted)] hover:text-[var(--app-ink)] transition-colors border border-[rgba(0,0,0,0.06)]" title="Settings">
          <span className="text-[14px]">⚙️</span>
        </button>
        {children}
      </div>
    </div>
  );
}
