import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { MY_ATTENDANCE, ATTENDANCE_TODAY, CALENDAR_STATUS } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';

const STATUS_LABELS = { present: { label: 'Present', cls: 'badge-success' }, absent: { label: 'Absent', cls: 'badge-danger' }, 'half-day': { label: 'Half Day', cls: 'badge-warning' }, 'on-leave': { label: 'On Leave', cls: 'badge-info' } };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function MiniCalendar({ year, month }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '15px', color: 'var(--clr-text)', marginBottom: '12px' }}>
        {MONTHS[month]} {year}
      </div>
      <div className="calendar-grid">
        {DAYS.map(d => <div key={d} className="calendar-day-header">{d[0]}</div>)}
        {cells.map((day, i) => (
          <div key={i} className={`calendar-day${!day ? ' empty' : ''} ${day && CALENDAR_STATUS[day] ? CALENDAR_STATUS[day] : ''}`}>
            {day}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        {[['present','var(--clr-success)','Present'], ['absent','var(--clr-danger)','Absent'], ['half','var(--clr-warning)','Half-Day'], ['on-leave','var(--clr-info)','Leave']].map(([key, color, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--clr-text-3)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Attendance() {
  const [checkedIn, setCheckedIn] = useState(true);
  const [tab, setTab] = useState('weekly');
  const data = role === 'admin' ? ATTENDANCE_TODAY : MY_ATTENDANCE;

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Topbar title="Attendance" subtitle={role === 'admin' ? 'All employee attendance records' : 'My attendance log'} />
        <div className="page-wrapper animate-fade">

          {/* Check-in card (employee only) */}
          {role === 'employee' && (
            <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--clr-surface-2), var(--clr-surface))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-text-3)', marginBottom: '4px' }}>Today — Friday, July 4, 2026</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--clr-text)' }}>
                    {checkedIn ? '09:05 AM' : '-- : --'}
                  </div>
                  <div style={{ fontSize: '13px', color: checkedIn ? 'var(--clr-success)' : 'var(--clr-text-3)', marginTop: '4px' }}>
                    {checkedIn ? '● Working — 5h 22m elapsed' : '○ Not checked in'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className={`btn btn-lg ${checkedIn ? 'btn-danger' : 'btn-success'}`} onClick={() => setCheckedIn(v => !v)}>
                    {checkedIn ? '⏹ Check Out' : '▶ Check In'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View toggle */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--clr-surface)', padding: '4px', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', width: 'fit-content' }}>
            {['weekly', 'daily', 'calendar'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '8px 16px', borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: 'none', background: tab === t ? 'var(--clr-primary)' : 'transparent', color: tab === t ? 'white' : 'var(--clr-text-3)', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                {t === 'weekly' ? '📅 Weekly' : t === 'daily' ? '📋 Daily' : '🗓️ Calendar'}
              </button>
            ))}
          </div>

          {tab === 'calendar' ? (
            <div className="card">
              <MiniCalendar year={2026} month={6} />
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="card-title">{tab === 'weekly' ? 'This Week' : 'Today — All Employees'}</div>
                {role === 'admin' && <button className="btn btn-secondary btn-sm">⬇ Export</button>}
              </div>
              <div className="table-wrapper" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      {role === 'admin' && <th>Employee</th>}
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {role === 'admin' ? ATTENDANCE_TODAY.map(a => (
                      <tr key={a.empId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--clr-primary)', flexShrink: 0 }}>
                              {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: '500', color: 'var(--clr-text)' }}>{a.name}</span>
                          </div>
                        </td>
                        <td>Jul 04, 2026</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.checkIn}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.checkOut}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.hours}</td>
                        <td><span className={`badge ${STATUS_LABELS[a.status]?.cls || 'badge-neutral'}`}>{STATUS_LABELS[a.status]?.label || a.status}</span></td>
                      </tr>
                    )) : MY_ATTENDANCE.map(a => (
                      <tr key={a.date}>
                        <td>{a.date}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.checkIn}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.checkOut}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.hours}</td>
                        <td><span className={`badge ${STATUS_LABELS[a.status]?.cls || 'badge-neutral'}`}>{STATUS_LABELS[a.status]?.label || a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary stats */}
          <div className="stat-grid mt-6">
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-success)' }}>
              <div className="stat-icon" style={{ background: 'var(--clr-success-bg)', fontSize: '20px' }}>✅</div>
              <div className="stat-value">22</div>
              <div className="stat-label">Present Days</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-danger)' }}>
              <div className="stat-icon" style={{ background: 'var(--clr-danger-bg)', fontSize: '20px' }}>❌</div>
              <div className="stat-value">1</div>
              <div className="stat-label">Absent Days</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-warning)' }}>
              <div className="stat-icon" style={{ background: 'var(--clr-warning-bg)', fontSize: '20px' }}>🔶</div>
              <div className="stat-value">1</div>
              <div className="stat-label">Half Days</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-info)' }}>
              <div className="stat-icon" style={{ background: 'var(--clr-info-bg)', fontSize: '20px' }}>🌴</div>
              <div className="stat-value">2</div>
              <div className="stat-label">On Leave</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

