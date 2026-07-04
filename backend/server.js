const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// AUTH
app.post('/api/auth/signup', (req, res) => {
    const { first, last, email, password, role } = req.body;
    if (!first || !last || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
    
    // Auto-generate Login ID
    const first2First = first.substring(0, 2).toUpperCase().padEnd(2, 'X');
    const first2Last = last.substring(0, 2).toUpperCase().padEnd(2, 'X');
    const currentYear = new Date().getFullYear();
    const companyInitials = "OI";
    
    db.get('SELECT COUNT(*) as count FROM employees WHERE id LIKE ?', [`%${currentYear}%`], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const count = row.count || 0;
        const serialNumber = (count + 1).toString().padStart(4, '0');
        const generatedId = `${companyInitials}${first2First}${first2Last}${currentYear}${serialNumber}`;
        const name = `${first} ${last}`;
        const joinDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        db.run('INSERT INTO employees (id, name, email, password, role, status, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [generatedId, name, email, password, role || 'employee', 'active', joinDate], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: generatedId });
        });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { loginIdOrEmail, password } = req.body;
    db.get('SELECT * FROM employees WHERE (email = ? OR id = ?) AND password = ?', [loginIdOrEmail, loginIdOrEmail, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ success: true, user: { id: row.id, name: row.name, email: row.email, role: row.role, avatar: row.avatar } });
    });
});

// EMPLOYEES
app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM employees', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/employees', (req, res) => {
    const { id, name, email, password, role, department, position, status, avatar, joinDate, salary, phone } = req.body;
    const stmt = db.prepare('INSERT INTO employees (id, name, email, password, role, department, position, status, avatar, joinDate, salary, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run([id, name, email, password, role, department, position, status, avatar, joinDate, salary, phone], function(err) {
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
