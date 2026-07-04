import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { EMPLOYEES } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';

const STATUS_COLORS = { active: 'badge-success', 'on-leave': 'badge-info', inactive: 'badge-danger' };

export default function Employees() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const departments = ['All', ...new Set(EMPLOYEES.map(e => e.department))];
  const filtered = EMPLOYEES.filter(e =>
    (dept === 'All' || e.department === dept) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.id.includes(search))
  );

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Topbar title="Employees" subtitle="All team members" />
        <div className="page-wrapper animate-fade">

          <div className="page-header">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input className="form-input" style={{ width: '260px' }} placeholder="🔍  Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="form-select" style={{ width: '160px' }} value={dept} onChange={e => setDept(e.target.value)}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button className="btn btn-primary">+ Add Employee</button>
          </div>

          <div className="stat-grid mb-6">
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-primary)' }}><div className="stat-icon" style={{ background: 'var(--clr-primary-glow)', fontSize: '20px' }}>👥</div><div className="stat-value">{EMPLOYEES.length}</div><div className="stat-label">Total Employees</div></div>
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-success)' }}><div className="stat-icon" style={{ background: 'var(--clr-success-bg)', fontSize: '20px' }}>✅</div><div className="stat-value">{EMPLOYEES.filter(e => e.status === 'active').length}</div><div className="stat-label">Active</div></div>
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-info)' }}><div className="stat-icon" style={{ background: 'var(--clr-info-bg)', fontSize: '20px' }}>🌴</div><div className="stat-value">{EMPLOYEES.filter(e => e.status === 'on-leave').length}</div><div className="stat-label">On Leave</div></div>
            <div className="stat-card" style={{ '--card-accent': 'var(--clr-warning)' }}><div className="stat-icon" style={{ background: 'var(--clr-warning-bg)', fontSize: '20px' }}>🏢</div><div className="stat-value">{departments.length - 1}</div><div className="stat-label">Departments</div></div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Employee Directory</div>
                <div className="card-subtitle">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
              </div>
              <button className="btn btn-secondary btn-sm">⬇ Export CSV</button>
            </div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead><tr><th>Employee</th><th>ID</th><th>Department</th><th>Position</th><th>Join Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-odoo))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', color: 'white', flexShrink: 0 }}>
                            {e.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--clr-text)', fontSize: '14px' }}>{e.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--clr-text-3)' }}>{e.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--clr-text-3)', fontSize: '12px' }}>{e.id}</td>
                      <td>{e.department}</td>
                      <td>{e.position}</td>
                      <td style={{ color: 'var(--clr-text-3)', fontSize: '13px' }}>{e.joinDate}</td>
                      <td><span className={`badge ${STATUS_COLORS[e.status]}`}>{e.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-ghost btn-sm">👁 View</button>
                          <button className="btn btn-ghost btn-sm">✏️ Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">🔍</div><h3>No results</h3><p>Try a different search or filter.</p></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

