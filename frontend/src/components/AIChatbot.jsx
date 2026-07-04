import { useState, useEffect, useRef } from 'react';
import { Bot, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const FAQS = [
  { q: "How do I request time off?", a: "Go to the Time Off tab, click 'Request Leave', select your dates and leave type, and submit. Your manager will be notified." },
  { q: "When is payroll generated?", a: "Payroll is typically processed on the last working day of the month. You can view your payslip from the Payroll tab." },
  { q: "How to edit my profile?", a: "Click on your avatar in the sidebar or go to 'My Profile'. Then click the 'Edit Profile' button on the top right." },
  { q: "Missed a check-in?", a: "Please contact your HR administrator to manually adjust your attendance logs for the missed day." }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi there! I'm your HR Assistant. How can I help you today?" }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAsk = (faq) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: faq.q },
      { type: 'bot', text: faq.a }
    ]);
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="w-5 h-5 rounded-full border-[2.5px] border-green-500 bg-white shadow-sm cursor-pointer hover:shadow-md transition-all group relative shrink-0"
      >
        <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-[var(--app-ink)] text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
          HR Assistant
        </span>
      </div>

      {isOpen && (
        <div className="fixed bottom-6 left-[80px] w-[340px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.16)] border border-[rgba(0,0,0,0.08)] z-[200] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[480px]">
          <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[14px] leading-tight tracking-tight">HR Assistant</h3>
                <p className="text-[11px] text-green-100 font-medium">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#f8f9fa]">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex w-full", m.type === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "px-4 py-2.5 rounded-[18px] text-[13px] max-w-[85%] leading-relaxed shadow-sm",
                  m.type === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-sm" 
                    : "bg-white text-[var(--app-ink)] border border-[rgba(0,0,0,0.06)] rounded-tl-sm"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-[rgba(0,0,0,0.06)] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2 px-1">Suggested Questions</div>
            <div className="flex flex-col gap-1">
              {FAQS.map((faq, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAsk(faq)}
                  className="text-left w-full px-3 py-2.5 text-[12.5px] font-medium text-[var(--app-ink)] hover:bg-[var(--app-soft)] rounded-lg transition-colors border border-transparent hover:border-[rgba(0,0,0,0.04)] flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{faq.q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--app-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
