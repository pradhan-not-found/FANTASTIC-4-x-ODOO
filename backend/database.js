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
        });
    }
});

module.exports = db;
