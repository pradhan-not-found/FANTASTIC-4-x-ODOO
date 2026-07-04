import { useState } from 'react';
import Topbar from '../components/Topbar';
import { Bell, AlertCircle, Calendar, Info, Plus, ChevronRight, MessageSquareWarning } from 'lucide-react';
import { cn } from '../lib/utils';

const INITIAL_NOTICES = [
  {
    id: 1,
    title: "Q3 Company Townhall Meeting",
    content: "Please join us for the Q3 townhall meeting where we will discuss our latest achievements and upcoming goals for Q4. Management will also be taking Q&A from all departments. Attendance is highly encouraged for all staff members.",
    date: "2024-03-15",
    author: "Jane Doe (HR Head)",
    type: "event",
    read: false
  },
  {
    id: 2,
    title: "Scheduled Server Maintenance",
    content: "Our primary database servers will be down for scheduled maintenance this weekend from Saturday 2:00 AM to 6:00 AM. Access to the HR portal and internal tools will be temporarily unavailable during this window.",
    date: "2024-03-10",
    author: "IT Support",
    type: "urgent",
    read: true
  },
  {
    id: 3,
    title: "New Office Pantry Upgrades",
    content: "We've completely revamped the office pantry! You can now find a variety of healthy snacks, fresh fruits, and a brand new state-of-the-art espresso machine in the 4th-floor break room. Enjoy!",
    date: "2024-03-05",
    author: "Facilities Team",
    type: "info",
    read: true
  },
  {
    id: 4,
    title: "Updated Health Insurance Policy",
    content: "We have successfully renegotiated our corporate health insurance policy to include better dental and vision coverage. Please review the updated policy documents available in the HR portal.",
    date: "2024-02-28",
    author: "HR Department",
    type: "info",
    read: true
  }
];

const TYPE_CONFIG = {
  urgent: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "Urgent" },
  event:  { icon: Calendar,    color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", label: "Event" },
  info:   { icon: Info,        color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", label: "Information" }
};

export default function NoticeBoard() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [filter, setFilter] = useState('all');

  const filteredNotices = notices.filter(n => filter === 'all' || n.type === filter);

  const markAsRead = (id) => {
    setNotices(notices.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <>
      <Topbar title="Notice Board" subtitle="Stay updated with the latest company announcements" />
      
      <div className="flex-1 overflow-y-auto p-8 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 no-scrollbar">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex gap-2 bg-[var(--app-soft)] p-1.5 rounded-[14px] border border-[rgba(0,0,0,0.04)] shadow-sm">
              {['all', 'urgent', 'event', 'info'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all capitalize",
                    filter === f 
                      ? "bg-white text-[var(--app-ink)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]" 
                      : "text-[var(--app-muted)] hover:text-[var(--app-ink)] hover:bg-white/50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {role === 'admin' && (
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-[13.5px] transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Post Notice
              </button>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const config = TYPE_CONFIG[notice.type];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={notice.id}
                    onClick={() => markAsRead(notice.id)}
                    className={cn(
                      "liquid-card-shell rounded-[18px] p-6 transition-all duration-300 border border-[rgba(0,0,0,0.06)] cursor-pointer group hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden",
                      !notice.read ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-blue-500/20" : "bg-white/60 hover:bg-white"
                    )}
                  >
                    {!notice.read && (
                      <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                    )}
                    
                    <div className="flex items-start gap-5">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner", config.bg, config.color, config.border)}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className={cn("text-[17px] font-bold tracking-tight pr-4", !notice.read ? "text-[var(--app-ink)]" : "text-[var(--app-muted)]")}>
                            {notice.title}
                          </h3>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={cn("px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-widest border", config.bg, config.color, config.border)}>
                              {config.label}
                            </span>
                            <span className="text-[12px] font-medium text-[var(--app-muted)]">
                              {notice.date}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-[14px] text-[var(--app-muted)] leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                          {notice.content}
                        </p>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(0,0,0,0.04)]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">
                              {notice.author.split(' ')[0][0]}
                            </div>
                            <span className="text-[12.5px] font-semibold text-[var(--app-muted)]">
                              Posted by {notice.author}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[13px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            Read full notice <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-4">
                  <MessageSquareWarning className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[17px] font-bold text-[var(--app-ink)] mb-2">No notices found</h3>
                <p className="text-[14px] text-[var(--app-muted)] max-w-[300px]">There are currently no notices available in this category.</p>
              </div>
            )}
          </div>

        </div>
    </>
  );
}
