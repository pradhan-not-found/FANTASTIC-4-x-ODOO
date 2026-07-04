import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';

function AdminPayroll() {
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [running, setRunning] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2026-04');

  const fetchData = async () => {
    try {
      const [empRes, payrollRes] = await Promise.all([
        fetch('http://localhost:3000/api/employees'),
        fetch('http://localhost:3000/api/payroll')
      ]);
      if (empRes.ok) setEmployees(await empRes.json());
      if (payrollRes.ok) setPayroll(await payrollRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRunPayroll = async () => {
    if (!selectedMonth) return;
    const confirm = window.confirm(`Run payroll for ${selectedMonth}? This will compute salaries based on attendance.`);
    if (!confirm) return;
    setRunning(true);
    try {
      const res = await fetch('http://localhost:3000/api/payroll/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.message}`);
        fetchData();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to run payroll');
    } finally {
      setRunning(false);
    }
  };

  const filteredPayroll = payroll.filter(p => p.month === selectedMonth);
  const totalNet = filteredPayroll.reduce((acc, p) => acc + (p.netSalary || p.net || 0), 0);
  const totalDeductions = filteredPayroll.reduce((acc, p) => acc + (p.deductions || (p.pf || 0) + (p.tax || 0)), 0);
  const totalAllowances = filteredPayroll.reduce((acc, p) => acc + (p.allowances || (p.hra || 0) + (p.da || 0)), 0);

  return (
    <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Payroll Processing</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Manage organization-wide payroll for the current month.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-[13px] bg-white text-[var(--app-ink)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          />
          <button
            onClick={handleRunPayroll}
            disabled={running}
            className={`px-5 py-2.5 rounded-lg text-[13.5px] font-semibold shadow-sm transition-all border flex items-center gap-2 ${running ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'}`}
          >
            {running ? 'Running...' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                Run Payroll
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Net Payroll', val: `₹${(totalNet/100000).toFixed(1)}L`, sub: selectedMonth, color: 'text-blue-600' },
          { label: 'Employees Paid', val: filteredPayroll.length, sub: 'this month', color: 'text-green-600' },
          { label: 'Total Deductions', val: `₹${(totalDeductions/100000).toFixed(1)}L`, sub: 'PF + PT + TDS + LOP', color: 'text-amber-600' },
          { label: 'Total Allowances', val: `₹${(totalAllowances/100000).toFixed(1)}L`, sub: 'HRA + Special', color: 'text-indigo-600' }
        ].map((stat, i) => (
          <div key={i} className="liquid-card-shell rounded-[18px] p-5 card-elevate">
            <div className={`text-[26px] font-bold ${stat.color} leading-none mb-1 tracking-tight`}>{stat.val}</div>
            <div className="text-[12.5px] font-semibold uppercase tracking-widest text-[var(--app-muted)] mb-1">{stat.label}</div>
            <div className="text-[11.5px] font-medium text-[var(--app-muted)]">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="liquid-card-shell rounded-[18px] overflow-hidden card-elevate">
        <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[var(--app-soft)] flex justify-between items-center">
          <div className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">Employee Payroll — {selectedMonth}</div>
          <input type="text" placeholder="Search employee..." className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white w-[200px] outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] text-left">
            <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <tr>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-center">Days Present</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-center">LOP Days</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Basic</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Allowances</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Deductions</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Net Pay</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {filteredPayroll.map(p => {
                const emp = employees.find(e => e.id === p.empId);
                const netPay = p.netSalary || p.net || 0;
                return (
                <tr key={p.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{emp ? emp.name : p.empId}</td>
                  <td className="py-3.5 px-5 text-center font-mono text-green-700 font-bold">{p.presentDays ?? '-'}</td>
                  <td className="py-3.5 px-5 text-center font-mono text-red-500 font-bold">{p.lopDays ?? '-'}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-right">₹{(p.basic||0).toLocaleString()}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-right">₹{(p.allowances || (p.hra || 0) + (p.da || 0)).toLocaleString()}</td>
                  <td className="py-3.5 px-5 font-mono text-red-500 text-right">-₹{(p.deductions || (p.pf || 0) + (p.tax || 0)).toLocaleString()}</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--app-ink)] font-bold text-right">₹{netPay.toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-green-50 text-green-700 border-green-200">
                      {p.status}
                    </span>
                  </td>
                </tr>
              )})}
              {filteredPayroll.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-[13px] text-[var(--app-muted)]">
                    No payroll for {selectedMonth}. Click <strong className="text-blue-600">Run Payroll</strong> to generate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




function EmployeePayroll() {
  const [payroll, setPayroll] = useState(null);
  const user = JSON.parse(localStorage.getItem('hrms_user') || '{}');

  useEffect(() => {
    if (!user.id) return;
    const fetchPayroll = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/payroll/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setPayroll(data[0]); // Get most recent payroll
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayroll();
  }, [user.id]);

  const p = payroll || {
    month: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    netSalary: 0,
    basic: 0,
    hra: 0,
    da: 0,
    pf: 0,
    tax: 0,
    status: 'Pending'
  };

  const hra = p.hra || 0;
  const special = p.da || 0;
  const pf = p.pf || 0;
  const pt = p.tax || 0;
  const tds = 0;
  const allowances = hra + special;
  const deductions = pf + pt + tds;

  return (
    <div className="flex-1 p-8 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {!payroll && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center rounded-3xl m-4">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-xl border border-[rgba(0,0,0,0.06)] flex flex-col items-center">
            <h2 className="text-[20px] font-black text-[var(--app-ink)] tracking-tight mb-2 text-center">No Payroll Data</h2>
            <p className="text-[13.5px] text-[var(--app-muted)] font-medium text-center">
              Your payroll data has not been generated for this month yet.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4 relative z-10">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">My Payroll</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Salary slips and compensation details.</p>
        </div>
        <button disabled={!payroll} className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          ↓ Download Payslip
        </button>
      </div>

      <div className="liquid-card-shell rounded-[18px] p-8 card-elevate mb-8 bg-gradient-to-br from-blue-50/50 to-transparent relative z-10">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Net Salary — {p.month}</div>
            <div className="text-[40px] font-black text-[var(--app-ink)] tracking-tight font-mono mb-2">₹{(p.netSalary || p.net || 0).toLocaleString()}</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              {payroll ? `Credited (Status: ${p.status})` : 'Pending Generation'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-1">Total Days</div>
            <div className="text-[20px] font-bold text-[var(--app-ink)] tracking-tight">30</div>
            <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mt-4 mb-1">LOP Days</div>
            <div className="text-[20px] font-bold text-[var(--app-ink)] tracking-tight">0</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4 text-green-700 flex justify-between">
            Earnings <span>₹{((p.basic || 0) + allowances).toLocaleString()}</span>
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">Basic Salary</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{(p.basic || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">HRA</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{hra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">Special Allowance</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{special.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4 text-red-600 flex justify-between">
            Deductions <span>₹{deductions.toLocaleString()}</span>
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">PF (Employee)</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{pf.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">Professional Tax</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{pt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">TDS</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{tds.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payroll() {
  const role = localStorage.getItem('hrms_role') || 'admin';
  return (
    <>
      <Topbar title="Payroll" subtitle={role === 'admin' ? "Company Payroll" : "My Payslips"} />
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {role === 'admin' ? <AdminPayroll /> : <EmployeePayroll />}
      </div>
    </>
  );
}
