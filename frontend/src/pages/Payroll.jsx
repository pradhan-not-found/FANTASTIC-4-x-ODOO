import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { PAYROLL, MY_PAYROLL } from '../data/mockData';

const role = localStorage.getItem('hrms_role') || 'admin';

export default function Payroll() {
  const data = role === 'admin' ? PAYROLL : null;

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Topbar title="Payroll" subtitle={role === 'admin' ? 'Manage salary structures for all employees' : 'Your salary details — read only'} />
        <div className="page-wrapper animate-fade">

          {role === 'employee' ? (
            // Employee payroll view
            <>
              <div className="card mb-6" style={{ background: 'linear-gradient(135deg, var(--clr-primary-bg), #F8F5FF)', border: '1px solid var(--clr-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--clr-text-3)', marginBottom: '6px' }}>Net Salary — {MY_PAYROLL.month}</div>
                    <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--clr-primary)', letterSpacing: '-1px' }}>
                      ₹{MY_PAYROLL.net.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--clr-text-3)', marginTop: '4px' }}>Credited to your account</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <span className="badge badge-success">✓ Paid</span>
                    <button className="btn btn-secondary btn-sm">⬇ Download Payslip</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><div className="card-title">Salary Breakdown</div><div className="card-subtitle">{MY_PAYROLL.month}</div></div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Earnings</div>
                  {[['Basic Salary', MY_PAYROLL.basic], ['HRA', MY_PAYROLL.hra], ['Dearness Allowance', MY_PAYROLL.da]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--clr-border)' }}>
                      <span style={{ color: 'var(--clr-text-2)', fontSize: '14px' }}>{label}</span>
                      <span style={{ fontWeight: '600', color: 'var(--clr-success)', fontSize: '14px' }}>+ ₹{val.toLocaleString('en-IN')}</span>
                    </div>
                  ))}

                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--clr-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 8px' }}>Deductions</div>
                  {[['Provident Fund (PF)', MY_PAYROLL.pf], ['Tax Deduction (TDS)', MY_PAYROLL.tax]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--clr-border)' }}>
                      <span style={{ color: 'var(--clr-text-2)', fontSize: '14px' }}>{label}</span>
                      <span style={{ fontWeight: '600', color: 'var(--clr-danger)', fontSize: '14px' }}>− ₹{val.toLocaleString('en-IN')}</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', marginTop: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--clr-text)' }}>Net Salary</span>
                    <span style={{ fontWeight: '900', fontSize: '22px', color: 'var(--clr-primary)' }}>₹{MY_PAYROLL.net.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Admin payroll view
            <>
              <div className="stat-grid mb-6">
                <div className="stat-card" style={{ '--card-accent': 'var(--clr-primary)' }}>
                  <div className="stat-icon" style={{ background: 'var(--clr-primary-glow)', fontSize: '20px' }}>💰</div>
                  <div className="stat-value">₹4.75L</div>
                  <div className="stat-label">Total Monthly Payroll</div>
                </div>
                <div className="stat-card" style={{ '--card-accent': 'var(--clr-success)' }}>
                  <div className="stat-icon" style={{ background: 'var(--clr-success-bg)', fontSize: '20px' }}>✅</div>
                  <div className="stat-value">{PAYROLL.filter(p => p.status === 'paid').length}</div>
                  <div className="stat-label">Salaries Processed</div>
                </div>
                <div className="stat-card" style={{ '--card-accent': 'var(--clr-warning)' }}>
                  <div className="stat-icon" style={{ background: 'var(--clr-warning-bg)', fontSize: '20px' }}>⏳</div>
                  <div className="stat-value">{PAYROLL.filter(p => p.status === 'pending').length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card" style={{ '--card-accent': 'var(--clr-info)' }}>
                  <div className="stat-icon" style={{ background: 'var(--clr-info-bg)', fontSize: '20px' }}>👥</div>
                  <div className="stat-value">{PAYROLL.length}</div>
                  <div className="stat-label">Total Employees</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Payroll Register</div>
                    <div className="card-subtitle">June 2026</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm">⬇ Export</button>
                    <button className="btn btn-primary btn-sm">Run Payroll</button>
                  </div>
                </div>
                <div className="table-wrapper" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Basic</th>
                        <th>HRA</th>
                        <th>DA</th>
                        <th>PF</th>
                        <th>Tax</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYROLL.map(p => (
                        <tr key={p.empId}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--clr-primary)', flexShrink: 0 }}>
                                {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <span style={{ fontWeight: '500', color: 'var(--clr-text)' }}>{p.name}</span>
                            </div>
                          </td>
                          <td>₹{p.basic.toLocaleString('en-IN')}</td>
                          <td>₹{p.hra.toLocaleString('en-IN')}</td>
                          <td>₹{p.da.toLocaleString('en-IN')}</td>
                          <td style={{ color: 'var(--clr-danger)' }}>₹{p.pf.toLocaleString('en-IN')}</td>
                          <td style={{ color: 'var(--clr-danger)' }}>₹{p.tax.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: '700', color: 'var(--clr-primary)' }}>₹{p.net.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                              {p.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-ghost btn-sm">✏️ Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

