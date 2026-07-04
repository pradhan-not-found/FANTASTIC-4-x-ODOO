import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { CURRENT_USER } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';

const INFO_FIELDS = [
  { label: 'Employee ID', value: 'EMP-001', editable: false },
  { label: 'Full Name',   value: CURRENT_USER.name, editable: role === 'admin' },
  { label: 'Email',       value: CURRENT_USER.email, editable: false },
  { label: 'Phone',       value: CURRENT_USER.phone, editable: true },
  { label: 'Department',  value: CURRENT_USER.department, editable: role === 'admin' },
  { label: 'Position',    value: CURRENT_USER.position, editable: role === 'admin' },
  { label: 'Join Date',   value: CURRENT_USER.joinDate, editable: false },
  { label: 'Manager',     value: CURRENT_USER.manager, editable: false },
];

const DOCS = [
  { name: 'Offer Letter.pdf',       date: '2024-01-10', size: '245 KB' },
  { name: 'NDA Agreement.pdf',      date: '2024-01-14', size: '128 KB' },
  { name: 'ID Proof.pdf',           date: '2024-01-15', size: '512 KB' },
  { name: 'Payslip June 2026.pdf',  date: '2026-07-01', size: '89 KB'  },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { key: 'personal',  label: '👤 Personal' },
    { key: 'job',       label: '💼 Job Details' },
    { key: 'salary',    label: '💰 Salary' },
    { key: 'documents', label: '📄 Documents' },
  ];

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Topbar title="My Profile" subtitle="Personal & job information" />
        <div className="page-wrapper animate-fade">

          {/* Profile hero */}
          <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--clr-primary-bg) 0%, #FFFFFF 100%)', border: '1px solid var(--clr-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div className="profile-avatar-lg">SP</div>
                {editing && (
                  <button style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', background: 'var(--clr-primary)', border: '2px solid var(--clr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer', color: 'white' }}>
                    📷
                  </button>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--clr-text)', marginBottom: '4px' }}>{CURRENT_USER.name}</h2>
                <p style={{ color: 'var(--clr-text-2)', fontSize: '15px', marginBottom: '8px' }}>{CURRENT_USER.position} · {CURRENT_USER.department}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-success">● Active</span>
                  <span className="badge badge-primary">{role === 'admin' ? '🛡️ Admin' : '👤 Employee'}</span>
                  <span className="badge badge-neutral">EMP-001</span>
                </div>
              </div>
              <div>
                {editing
                  ? <button className="btn btn-primary" onClick={() => setEditing(false)}>💾 Save Changes</button>
                  : <button className="btn btn-secondary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                }
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--clr-surface)', padding: '4px', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ padding: '8px 16px', borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: 'none', background: activeTab === t.key ? 'var(--clr-primary)' : 'transparent', color: activeTab === t.key ? 'white' : 'var(--clr-text-3)', transition: 'all 0.2s' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'personal' && (
            <div className="card animate-fade">
              <div className="card-header">
                <div className="card-title">Personal Information</div>
                {editing && <span className="badge badge-warning">Editing</span>}
              </div>
              <div className="grid-2">
                {INFO_FIELDS.map(f => (
                  <div key={f.label} className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">{f.label}</label>
                    {editing && f.editable
                      ? <input className="form-input" defaultValue={f.value} />
                      : <div style={{ padding: '10px 16px', background: 'var(--clr-surface-2)', borderRadius: 'var(--r-md)', fontSize: '14px', color: f.editable ? 'var(--clr-text)' : 'var(--clr-text-2)', border: '1px solid var(--clr-border)' }}>{f.value}</div>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'job' && (
            <div className="card animate-fade">
              <div className="card-header"><div className="card-title">Job Details</div></div>
              <div className="grid-2">
                {[
                  { label: 'Department', value: 'Engineering' },
                  { label: 'Position / Title', value: 'Team Lead' },
                  { label: 'Employment Type', value: 'Full-time' },
                  { label: 'Work Location', value: 'Hybrid (Kolkata)' },
                  { label: 'Reporting Manager', value: 'Riya Sharma' },
                  { label: 'Join Date', value: 'January 15, 2024' },
                  { label: 'Probation Ends', value: 'April 15, 2024' },
                  { label: 'Notice Period', value: '2 Months' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--clr-text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</div>
                    <div style={{ fontSize: '14px', color: 'var(--clr-text)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="card animate-fade">
              <div className="card-header">
                <div className="card-title">Salary Structure</div>
                <div className="card-subtitle">June 2026 — Read only</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Basic Salary', amount: '₹85,000', type: 'earning' },
                  { label: 'House Rent Allowance (HRA)', amount: '₹25,500', type: 'earning' },
                  { label: 'Dearness Allowance (DA)', amount: '₹8,500', type: 'earning' },
                  { label: 'Provident Fund (PF)', amount: '−₹10,200', type: 'deduction' },
                  { label: 'Tax Deduction (TDS)', amount: '−₹8,500', type: 'deduction' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--clr-border)' }}>
                    <div style={{ fontSize: '14px', color: 'var(--clr-text-2)' }}>{row.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: row.type === 'deduction' ? 'var(--clr-danger)' : 'var(--clr-success)' }}>{row.amount}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--clr-text)' }}>Net Salary</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--clr-primary)' }}>₹90,300</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="card animate-fade">
              <div className="card-header"><div className="card-title">Documents</div></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DOCS.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: 'var(--clr-surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)' }}>
                    <div style={{ fontSize: '28px' }}>📄</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--clr-text)' }}>{d.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--clr-text-3)' }}>{d.date} · {d.size}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm">⬇ Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

