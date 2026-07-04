const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const EMPLOYEES = [
  { id: 'EMP-001', name: 'Souradeep Pradhan', email: 'souradeep@f4.co', department: 'Engineering', position: 'Team Lead',    status: 'active',   avatar: 'SP', joinDate: '2024-01-15', salary: 85000, phone: '+91 98765 43210' },
  { id: 'EMP-002', name: 'Riya Sharma',       email: 'riya@f4.co',       department: 'HR',          position: 'HR Manager',   status: 'active',   avatar: 'RS', joinDate: '2023-08-10', salary: 78000, phone: '+91 91234 56789' },
  { id: 'EMP-003', name: 'Arjun Mehta',        email: 'arjun@f4.co',      department: 'Design',      position: 'UI Designer',  status: 'active',   avatar: 'AM', joinDate: '2024-03-20', salary: 65000, phone: '+91 87654 32109' },
  { id: 'EMP-004', name: 'Priya Nair',         email: 'priya@f4.co',      department: 'Marketing',   position: 'Analyst',      status: 'on-leave', avatar: 'PN', joinDate: '2023-11-05', salary: 60000, phone: '+91 76543 21098' },
  { id: 'EMP-005', name: 'Karan Gupta',        email: 'karan@f4.co',      department: 'Engineering', position: 'Developer',    status: 'active',   avatar: 'KG', joinDate: '2024-06-01', salary: 70000, phone: '+91 65432 10987' },
  { id: 'EMP-006', name: 'Neha Joshi',         email: 'neha@f4.co',       department: 'Finance',     position: 'Accountant',   status: 'active',   avatar: 'NJ', joinDate: '2023-05-22', salary: 62000, phone: '+91 54321 09876' }
];

const ATTENDANCE = [
  { empId: 'EMP-001', date: new Date().toISOString().split('T')[0], day: 'Today', checkIn: '09:02', checkOut: '18:15', status: 'present',  hours: '9h 13m' },
  { empId: 'EMP-002', date: new Date().toISOString().split('T')[0], day: 'Today', checkIn: '09:15', checkOut: '17:45', status: 'present',  hours: '8h 30m' },
  { empId: 'EMP-003', date: new Date().toISOString().split('T')[0], day: 'Today', checkIn: '10:00', checkOut: '14:30', status: 'half-day', hours: '4h 30m' },
  { empId: 'EMP-004', date: new Date().toISOString().split('T')[0], day: 'Today', checkIn: '--',    checkOut: '--',    status: 'on-leave', hours: '--'     },
  { empId: 'EMP-005', date: new Date().toISOString().split('T')[0], day: 'Today', checkIn: '09:30', checkOut: '18:30', status: 'present',  hours: '9h 00m' },
  { empId: 'EMP-006', date: new Date().toISOString().split('T')[0], day: 'Today', checkIn: '--',    checkOut: '--',    status: 'absent',   hours: '--'     }
];

const LEAVES = [
  { id: 'LR-001', empId: 'EMP-004', type: 'Sick',   fromDate: '2026-07-03', toDate: '2026-07-05', days: 3, status: 'pending',  reason: 'Fever and cold',      appliedOn: '2026-07-02' },
  { id: 'LR-002', empId: 'EMP-003', type: 'Paid',   fromDate: '2026-07-10', toDate: '2026-07-12', days: 3, status: 'approved', reason: 'Family function',     appliedOn: '2026-07-01' },
  { id: 'LR-003', empId: 'EMP-005', type: 'Unpaid', fromDate: '2026-07-15', toDate: '2026-07-16', days: 2, status: 'pending',  reason: 'Personal work',       appliedOn: '2026-07-03' },
  { id: 'LR-004', empId: 'EMP-001', type: 'Paid',   fromDate: '2026-06-20', toDate: '2026-06-22', days: 3, status: 'approved', reason: 'Vacation',            appliedOn: '2026-06-15' },
  { id: 'LR-005', empId: 'EMP-006', type: 'Sick',   fromDate: '2026-07-04', toDate: '2026-07-04', days: 1, status: 'rejected', reason: 'Migraine',            appliedOn: '2026-07-03' },
];

const PAYROLL = [
  { empId: 'EMP-001', basic: 85000, hra: 25500, da: 8500,  pf: 10200, tax: 8500,  net: 90300, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-002', basic: 78000, hra: 23400, da: 7800,  pf: 9360,  tax: 7800,  net: 82040, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-003', basic: 65000, hra: 19500, da: 6500,  pf: 7800,  tax: 6500,  net: 76700, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-004', basic: 60000, hra: 18000, da: 6000,  pf: 7200,  tax: 6000,  net: 70800, month: 'June 2026', status: 'pending' },
  { empId: 'EMP-005', basic: 70000, hra: 21000, da: 7000,  pf: 8400,  tax: 7000,  net: 82600, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-006', basic: 62000, hra: 18600, da: 6200,  pf: 7440,  tax: 6200,  net: 73160, month: 'June 2026', status: 'paid'    },
];

db.serialize(() => {
    // Initialize Tables
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        department TEXT,
        position TEXT,
        status TEXT,
        avatar TEXT,
        joinDate TEXT,
        salary REAL,
        phone TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empId TEXT,
        date TEXT,
        day TEXT,
        checkIn TEXT,
        checkOut TEXT,
        status TEXT,
        hours TEXT,
        FOREIGN KEY(empId) REFERENCES employees(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS leaves (
        id TEXT PRIMARY KEY,
        empId TEXT,
        type TEXT,
        fromDate TEXT,
        toDate TEXT,
        days INTEGER,
        status TEXT,
        reason TEXT,
        appliedOn TEXT,
        FOREIGN KEY(empId) REFERENCES employees(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS payroll (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empId TEXT,
        basic REAL,
        hra REAL,
        da REAL,
        pf REAL,
        tax REAL,
        net REAL,
        month TEXT,
        status TEXT,
        FOREIGN KEY(empId) REFERENCES employees(id)
    )`);
    // Insert Employees
    const stmtEmp = db.prepare('INSERT OR REPLACE INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let emp of EMPLOYEES) {
        stmtEmp.run(emp.id, emp.name, emp.email, emp.department, emp.position, emp.status, emp.avatar, emp.joinDate, emp.salary, emp.phone);
    }
    stmtEmp.finalize();

    // Insert Attendance
    const stmtAtt = db.prepare('INSERT INTO attendance (empId, date, day, checkIn, checkOut, status, hours) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (let att of ATTENDANCE) {
        stmtAtt.run(att.empId, att.date, att.day, att.checkIn, att.checkOut, att.status, att.hours);
    }
    stmtAtt.finalize();

    // Insert Leaves
    const stmtLeave = db.prepare('INSERT OR REPLACE INTO leaves VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let l of LEAVES) {
        stmtLeave.run(l.id, l.empId, l.type, l.fromDate, l.toDate, l.days, l.status, l.reason, l.appliedOn);
    }
    stmtLeave.finalize();

    // Insert Payroll
    const stmtPay = db.prepare('INSERT INTO payroll (empId, basic, hra, da, pf, tax, net, month, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let p of PAYROLL) {
        stmtPay.run(p.empId, p.basic, p.hra, p.da, p.pf, p.tax, p.net, p.month, p.status);
    }
    stmtPay.finalize();

    console.log("Database seeded successfully.");
});
