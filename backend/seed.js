const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const EMPLOYEES = [];
const ATTENDANCE = [];
const LEAVES = [];
const PAYROLL = [];

db.serialize(() => {
    // Initialize Tables
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT,
        role TEXT,
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
    const stmtEmp = db.prepare('INSERT OR REPLACE INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let emp of EMPLOYEES) {
        stmtEmp.run(emp.id, emp.name, emp.email, emp.password, emp.role, emp.department, emp.position, emp.status, emp.avatar, emp.joinDate, emp.salary, emp.phone);
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
