import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { MY_PAYROLL, EMPLOYEES } from '../data/mockData';


function AdminPayroll() {
  const totalPayroll = 4325000;
  
  return (
    <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">Payroll Processing</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Manage organization-wide payroll for June 2026.</p>
        </div>
        <button className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all border border-blue-600">
          Run Payroll
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Payroll (Jun)', val: '₹43.2L', sub: 'Processed', color: 'text-blue-600' },
          { label: 'Employees Paid', val: EMPLOYEES.length, sub: '100% completed', color: 'text-green-600' },
          { label: 'Taxes Withheld', val: '₹6.1L', sub: 'TDS + PT', color: 'text-amber-600' },
          { label: 'PF Contributions', val: '₹4.8L', sub: 'Employer match', color: 'text-indigo-600' }
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
          <div className="text-[14px] font-bold text-[var(--app-ink)] tracking-tight">Employee Payroll (June 2026)</div>
          <input type="text" placeholder="Search employee..." className="px-3 py-1.5 border border-[rgba(0,0,0,0.12)] rounded-md text-[12.5px] bg-white w-[200px] outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] text-left">
            <thead className="bg-[rgba(0,0,0,0.02)] border-b border-[rgba(0,0,0,0.06)]">
              <tr>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)]">Employee</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Basic Salary</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Allowances</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Deductions</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-right">Net Pay</th>
                <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-widest text-[var(--app-muted)] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)]">
              {EMPLOYEES.map((e, i) => {
                const basic = 40000 + (i * 10000);
                const allow = basic * 0.4;
                const ded = basic * 0.12 + 200;
                const net = basic + allow - ded;
                return (
                  <tr key={e.id} className="hover:bg-[rgba(0,0,0,0.01)] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[var(--app-ink)]">{e.name}</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-right">₹{basic.toLocaleString()}</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--app-muted)] text-right">₹{allow.toLocaleString()}</td>
                    <td className="py-3.5 px-5 font-mono text-red-500 text-right">-₹{ded.toLocaleString()}</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--app-ink)] font-bold text-right">₹{net.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-green-50 text-green-700 border-green-200">
                        Paid
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeePayroll() {
  return (
    <div className="flex-1 p-8 max-w-[1000px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--app-ink)] mb-1 tracking-tight">My Payroll</h1>
          <p className="text-[13.5px] text-[var(--app-muted)]">Salary slips and compensation details.</p>
        </div>
        <button className="px-5 py-2.5 rounded-lg text-[13.5px] font-semibold bg-white border border-[rgba(0,0,0,0.12)] text-[var(--app-ink)] hover:bg-[var(--app-soft)] shadow-sm transition-all">
          ↓ Download Payslip
        </button>
      </div>

      <div className="liquid-card-shell rounded-[18px] p-8 card-elevate mb-8 bg-gradient-to-br from-blue-50/50 to-transparent">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-widest text-[var(--app-muted)] mb-2">Net Salary — {MY_PAYROLL.month}</div>
            <div className="text-[40px] font-black text-[var(--app-ink)] tracking-tight font-mono mb-2">₹90,300.00</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-green-100 text-green-800 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Credited to HDFC Bank (**** 8432)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4 text-green-700 flex justify-between">
            Earnings <span>₹{MY_PAYROLL.earnings.total.toLocaleString()}</span>
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">Basic Salary</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{MY_PAYROLL.earnings.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">HRA</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{MY_PAYROLL.earnings.hra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">Special Allowance</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{MY_PAYROLL.earnings.special.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="liquid-card-shell rounded-[18px] p-6 card-elevate">
          <h2 className="text-[15px] font-bold text-[var(--app-ink)] mb-4 tracking-tight border-b border-[rgba(0,0,0,0.06)] pb-4 text-red-600 flex justify-between">
            Deductions <span>₹{MY_PAYROLL.deductions.total.toLocaleString()}</span>
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">PF (Employee)</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{MY_PAYROLL.deductions.pf.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">Professional Tax</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{MY_PAYROLL.deductions.pt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[var(--app-muted)] font-medium">TDS</span>
              <span className="font-mono font-medium text-[var(--app-ink)]">₹{MY_PAYROLL.deductions.tds.toLocaleString()}</span>
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
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen apple-inset">
        <Topbar title="Payroll" subtitle={role === 'admin' ? "Company Payroll" : "My Payslips"} />
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {role === 'admin' ? <AdminPayroll /> : <EmployeePayroll />}
        </div>
      </div>
    </div>
  );
}
