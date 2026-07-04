const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// EMPLOYEES
app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM employees', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/employees', (req, res) => {
    const { id, name, email, department, position, status, avatar, joinDate, salary, phone } = req.body;
    const stmt = db.prepare('INSERT INTO employees (id, name, email, department, position, status, avatar, joinDate, salary, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run([id, name, email, department, position, status, avatar, joinDate, salary, phone], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Employee added successfully', id });
    });
    stmt.finalize();
});

app.get('/api/employees/:id', (req, res) => {
    db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Employee not found' });
        res.json(row);
    });
});

// ATTENDANCE
app.get('/api/attendance', (req, res) => {
    db.all('SELECT * FROM attendance', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/attendance/today', (req, res) => {
    // Assuming today's date is passed as a query param or derived
    const today = new Date().toISOString().split('T')[0]; 
    db.all('SELECT * FROM attendance WHERE date = ?', [today], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/attendance/:empId', (req, res) => {
    db.all('SELECT * FROM attendance WHERE empId = ?', [req.params.empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// LEAVES
app.get('/api/leaves', (req, res) => {
    db.all('SELECT * FROM leaves', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/leaves/:empId', (req, res) => {
    db.all('SELECT * FROM leaves WHERE empId = ?', [req.params.empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// PAYROLL
app.get('/api/payroll', (req, res) => {
    db.all('SELECT * FROM payroll', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/payroll/:empId', (req, res) => {
    db.all('SELECT * FROM payroll WHERE empId = ?', [req.params.empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
