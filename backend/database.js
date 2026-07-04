const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Initialize Tables
        db.serialize(() => {
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
                phone TEXT,
                about TEXT,
                loveAboutJob TEXT,
                interests TEXT,
                skills TEXT,
                certifications TEXT,
                dob TEXT,
                residingAddress TEXT,
                nationality TEXT,
                personalEmail TEXT,
                gender TEXT,
                maritalStatus TEXT,
                bankAccountNo TEXT,
                bankName TEXT,
                ifsc TEXT,
                pan TEXT,
                uan TEXT
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
                attachment TEXT,
                FOREIGN KEY(empId) REFERENCES employees(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS leave_allocations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                empId TEXT,
                type TEXT,
                days REAL,
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
                allowances REAL DEFAULT 0,
                deductions REAL DEFAULT 0,
                netSalary REAL DEFAULT 0,
                presentDays INTEGER DEFAULT 0,
                lopDays INTEGER DEFAULT 0,
                month TEXT,
                status TEXT,
                FOREIGN KEY(empId) REFERENCES employees(id)
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS notices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                type TEXT NOT NULL,
                author TEXT,
                createdAt TEXT
            )`);
        });
    }
});

module.exports = db;
