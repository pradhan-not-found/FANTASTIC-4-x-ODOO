import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { LEAVE_REQUESTS, MY_LEAVES, CALENDAR_STATUS } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarPicker({ selected, onChange }) {
  const year = 2026, month = 6;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (d) => selected.includes(d);
  const today = new Date().getDate();

  return (
    <div>
      <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '14px', color: 'var(--clr-text)', marginBottom: '10px' }}>July 2026</div>
      <div className="calendar-grid">
        {DAYS.map(d => <div key={d} className="calendar-day-header">{d[0]}</div>)}
        {cells.map((day, i) => {
          const status = CALENDAR_STATUS[day];
          return (
            <div key={i}
              onClick={() => day && onChange(day)}
              className={`calendar-day${!day ? ' empty' : ''} ${isSelected(day) ? 'selected' : ''} ${day === today ? 'today' : ''} ${day && !isSelected(day) && status ? status : ''}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[['var(--clr-success)','Present'], ['var(--clr-danger)','Absent'], ['var(--clr-warning)','Half'], ['var(--clr-info)','Leave']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--clr-text-3)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />{label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
  const icons = { pending: '⏳', approved: '✅', rejected: '❌' };
  return <span className={`badge ${map[status]}`}>{icons[status]} {status}</span>;
}

export default function Leaves() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [form, setForm] = useState({ type: 'Paid', reason: '' });
  const [leaves, setLeaves] = useState(role === 'admin' ? LEAVE_REQUESTS : MY_LEAVES);
  const [filter, setFilter] = useState('all');

  const toggleDay = (d) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a, b) => a - b));

  const handleSubmit = () => {
    if (selectedDays.length === 0) return;
    const newLeave = {
      id: `LR-00${leaves.length + 10}`,
      empId: 'EMP-001', empName: 'Souradeep P.',
      type: form.type,
      from: `2026-07-${String(Math.min(...selectedDays)).padStart(2, '0')}`,
      to: `2026-07-${String(Math.max(...selectedDays)).padStart(2, '0')}`,
      days: selectedDays.length,
      status: 'pending',
      reason: form.reason,
      appliedOn: '2026-07-04',
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowModal(false);
    setSelectedDays([]);
    setForm({ type: 'Paid', reason: '' });
  };

  const handleApprove = (id) => setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
  const handleReject  = (id) => setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Topbar title={role === 'admin' ? 'Leave Approvals' : 'My Leaves'} subtitle={role === 'admin' ? 'Review and manage all leave requests' : 'Apply and track your time off'} />
        <div className="page-wrapper animate-fade">

          {/* Leave balance (employee) */}
          {role === 'employee' && (
            <div className="stat-grid mb-6">
              {[['Paid Leave', '🏖️', '12', '9 remaining', 'var(--clr-primary)'], ['Sick Leave', '🤒', '6', '4 remaining', 'var(--clr-danger)'], ['Unpaid Leave', '📋', '∞', 'Unlimited', 'var(--clr-warning)']].map(([label, icon, total, sub, color]) => (
                <div key={label} className="stat-card" style={{ '--card-accent': color }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                  <div className="stat-value">{total}</div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-change" style={{ color: 'var(--clr-text-3)' }}>{sub}</div>
                </div>
              ))}
            </div>
          )}

          <div className="page-header">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} style={{ textTransform: 'capitalize' }}>
                  {f}
                </button>
              ))}
            </div>
            {role === 'employee' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Apply for Leave</button>
            )}
          </div>

          {/* Requests list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(l => (
              <div key={l.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--clr-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--clr-primary)', flexShrink: 0 }}>
                      {l.empName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--clr-text)', marginBottom: '2px' }}>{l.empName}</div>
                      <div style={{ fontSize: '13px', color: 'var(--clr-text-3)' }}>Applied: {l.appliedOn} · {l.id}</div>
                    </div>
                  </div>
                  <StatusBadge status={l.status} />
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', margin: '14px 0', padding: '14px', background: 'var(--clr-surface-2)', borderRadius: 'var(--r-md)' }}>
                  <div><div style={{ fontSize: '11px', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Type</div><div style={{ fontWeight: '600', color: 'var(--clr-text)', fontSize: '14px' }}>{l.type} Leave</div></div>
                  <div><div style={{ fontSize: '11px', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>From</div><div style={{ fontWeight: '600', color: 'var(--clr-text)', fontSize: '14px' }}>{l.from}</div></div>
                  <div><div style={{ fontSize: '11px', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>To</div><div style={{ fontWeight: '600', color: 'var(--clr-text)', fontSize: '14px' }}>{l.to}</div></div>
                  <div><div style={{ fontSize: '11px', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Days</div><div style={{ fontWeight: '600', color: 'var(--clr-text)', fontSize: '14px' }}>{l.days}</div></div>
                </div>

                {l.reason && <div style={{ fontSize: '13px', color: 'var(--clr-text-2)', marginBottom: '14px' }}>📝 <em>"{l.reason}"</em></div>}

                {role === 'admin' && l.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleApprove(l.id)}>✓ Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(l.id)}>✕ Reject</button>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">🌴</div><h3>No requests</h3><p>No leave requests for this filter.</p></div>}
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}>
          <div className="card animate-fade" style={{ width: '100%', maxWidth: '520px', margin: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <div className="card-title">🌴 Apply for Leave</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Paid</option><option>Sick</option><option>Unpaid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Date(s) — Click to toggle</label>
              <div style={{ padding: '16px', background: 'var(--clr-surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)' }}>
                <CalendarPicker selected={selectedDays} onChange={toggleDay} />
              </div>
              {selectedDays.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--clr-primary)' }}>
                  ✓ {selectedDays.length} day(s) selected: Jul {selectedDays[0]}–{selectedDays[selectedDays.length - 1]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Remarks</label>
              <textarea className="form-input" rows={3} placeholder="Brief reason for leave..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary btn-lg" style={{ flex: 2 }} onClick={handleSubmit} disabled={selectedDays.length === 0}>
                📨 Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

