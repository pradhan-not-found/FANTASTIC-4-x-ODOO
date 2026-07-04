import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { Bell, AlertCircle, Calendar, Info, Plus, ChevronRight, MessageSquareWarning, X, Trash2, Send } from 'lucide-react';
import { cn } from '../lib/utils';

const TYPE_CONFIG = {
  urgent: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "Urgent" },
  event:  { icon: Calendar,    color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", label: "Event" },
  info:   { icon: Info,        color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", label: "Information" }
};

export default function NoticeBoard() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'info' });

  const fetchNotices = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/notices');
      if (res.ok) setNotices(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('http://localhost:3000/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, author: user.name || 'HR' })
      });
      if (res.ok) {
        setForm({ title: '', content: '', type: 'info' });
        setShowForm(false);
        fetchNotices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await fetch(`http://localhost:3000/api/notices/${id}`, { method: 'DELETE' });
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotices = notices.filter(n => filter === 'all' || n.type === filter);

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
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-[13.5px] transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Post Notice
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => {
                  const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG.info;
                  const Icon = config.icon;
                  
                  return (
                    <div 
                      key={notice.id}
                      className={cn(
                        "liquid-card-shell rounded-[18px] p-6 transition-all duration-300 border border-[rgba(0,0,0,0.06)] group hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden bg-white"
                      )}
                    >
                      <div className="flex items-start gap-5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner", config.bg, config.color, config.border)}>
                          <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className="text-[17px] font-bold tracking-tight pr-4 text-[var(--app-ink)]">
                              {notice.title}
                            </h3>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={cn("px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-widest border", config.bg, config.color, config.border)}>
                                {config.label}
                              </span>
                              <span className="text-[12px] font-medium text-[var(--app-muted)]">
                                {notice.createdAt || notice.date}
                              </span>
                              {role === 'admin' && (
                                <button
                                  onClick={() => handleDelete(notice.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--app-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-[14px] text-[var(--app-muted)] leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                            {notice.content}
                          </p>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(0,0,0,0.04)]">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">
                                {(notice.author || 'H')[0]}
                              </div>
                              <span className="text-[12.5px] font-semibold text-[var(--app-muted)]">
                                Posted by {notice.author || 'HR'}
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
          )}
        </div>

      {/* Post Notice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[560px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(0,0,0,0.06)]">
              <div>
                <h2 className="text-[20px] font-bold text-[var(--app-ink)] tracking-tight">Post Notice</h2>
                <p className="text-[13px] text-[var(--app-muted)] mt-0.5">Broadcast an announcement to all employees.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)] text-[var(--app-muted)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePost} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Notice title..."
                  required
                  className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Type</label>
                <div className="flex gap-3">
                  {['info', 'event', 'urgent'].map(t => {
                    const Icon = t === 'urgent' ? AlertCircle : t === 'event' ? Calendar : Info;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-[13px] font-bold capitalize border transition-all flex items-center justify-center gap-2",
                          form.type === t
                            ? t === 'urgent' ? 'bg-red-50 border-red-300 text-red-700' : t === 'event' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-[var(--app-soft)] border-[rgba(0,0,0,0.1)] text-[var(--app-muted)] hover:bg-[rgba(0,0,0,0.02)]'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your notice here..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-[rgba(0,0,0,0.12)] rounded-xl text-[13.5px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-[var(--app-ink)] bg-white border border-[rgba(0,0,0,0.12)] hover:bg-[var(--app-soft)] transition-colors shadow-sm">
                  Cancel
                </button>
                <button type="submit" disabled={posting} className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm min-w-[120px] flex justify-center items-center gap-2">
                  {posting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>
                      <Send className="w-4 h-4" /> Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
