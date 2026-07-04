const express = require('express');
const cors = require('cors');
const db = require('./database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads/avatars');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

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
            if (err) {
                if (err.message.includes('UNIQUE constraint failed: employees.email')) {
                    return res.status(400).json({ error: 'An account with this email already exists.' });
                }
                return res.status(500).json({ error: err.message });
            }
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

app.put('/api/employees/:id', (req, res) => {
    const { name, department, position, phone, about, loveAboutJob, interests, skills, certifications, dob, residingAddress, nationality, personalEmail, gender, maritalStatus, bankAccountNo, bankName, ifsc, pan, uan } = req.body;
    db.run(
        'UPDATE employees SET name = ?, department = ?, position = ?, phone = ?, about = ?, loveAboutJob = ?, interests = ?, skills = ?, certifications = ?, dob = ?, residingAddress = ?, nationality = ?, personalEmail = ?, gender = ?, maritalStatus = ?, bankAccountNo = ?, bankName = ?, ifsc = ?, pan = ?, uan = ? WHERE id = ?',
        [name, department, position, phone, about, loveAboutJob, interests, skills, certifications, dob, residingAddress, nationality, personalEmail, gender, maritalStatus, bankAccountNo, bankName, ifsc, pan, uan, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Employee not found' });
            res.json({ success: true, message: 'Profile updated' });
        }
    );
});

app.post('/api/employees/:id/avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create the public URL path
    const avatarUrl = `http://localhost:3000/uploads/avatars/${req.file.filename}`;
    
    db.run('UPDATE employees SET avatar = ? WHERE id = ?', [avatarUrl, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, avatar: avatarUrl });
    });
});


// ATTENDANCE
app.get('/api/attendance', (req, res) => {
    const { date, empId } = req.query;
    let sql = 'SELECT * FROM attendance';
    const params = [];
    if (date && empId) {
        sql += ' WHERE date = ? AND empId = ?';
        params.push(date, empId);
    } else if (date) {
        sql += ' WHERE date = ?';
        params.push(date);
    } else if (empId) {
        sql += ' WHERE empId = ?';
        params.push(empId);
    }
    sql += ' ORDER BY date DESC, checkIn DESC';
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/attendance/today', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; 
    db.all('SELECT * FROM attendance WHERE date = ?', [today], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/attendance/:empId', (req, res) => {
    db.all('SELECT * FROM attendance WHERE empId = ? ORDER BY date DESC', [req.params.empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/attendance/checkin', (req, res) => {
    const { empId } = req.body;
    if (!empId) return res.status(400).json({ error: 'empId is required' });
    const date = new Date().toISOString().split('T')[0];
    const checkIn = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    // Prevent double check-in on same day
    db.get('SELECT id FROM attendance WHERE empId = ? AND date = ?', [empId, date], (err, existing) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existing) return res.status(400).json({ error: 'Already checked in today' });
        db.run(
            'INSERT INTO attendance (empId, date, checkIn, status) VALUES (?, ?, ?, ?)',
            [empId, date, checkIn, 'present'],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: 'Checked in', id: this.lastID });
            }
        );
    });
});

app.put('/api/attendance/checkout/:id', (req, res) => {
    const checkOut = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    // Compute hours worked
    db.get('SELECT checkIn FROM attendance WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        let hours = null;
        if (row && row.checkIn) {
            const [inH, inM] = row.checkIn.split(':').map(Number);
            const [outH, outM] = checkOut.split(':').map(Number);
            const diffMins = (outH * 60 + outM) - (inH * 60 + inM);
            if (diffMins > 0) {
                const h = Math.floor(diffMins / 60);
                const m = diffMins % 60;
                hours = `${h}h ${m}m`;
            }
        }
        db.run(
            'UPDATE attendance SET checkOut = ?, hours = ? WHERE id = ?',
            [checkOut, hours, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: 'Checked out', checkOut, hours });
            }
        );
    });
});

// LEAVES
app.get('/api/leaves', (req, res) => {
    db.all('SELECT * FROM leaves ORDER BY appliedOn DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/leaves/:empId', (req, res) => {
    db.all('SELECT * FROM leaves WHERE empId = ? ORDER BY appliedOn DESC', [req.params.empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/leaves', (req, res) => {
    const { empId, type, fromDate, toDate, days, reason } = req.body;
    if (!empId || !type || !fromDate || !toDate || !days) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = `LV-${Date.now()}`;
    const status = 'Pending';
    const appliedOn = new Date().toISOString().split('T')[0];
    db.run(
        'INSERT INTO leaves (id, empId, type, fromDate, toDate, days, status, reason, appliedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, empId, type, fromDate, toDate, days, status, reason || '', appliedOn],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Leave applied successfully', id });
        }
    );
});

app.put('/api/leaves/:id', (req, res) => {
    const { status } = req.body;
    db.run(
        'UPDATE leaves SET status = ? WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Leave status updated' });
        }
    );
});

// PAYROLL
app.get('/api/payroll', (req, res) => {
    db.all('SELECT * FROM payroll ORDER BY month DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/payroll/:empId', (req, res) => {
    db.all('SELECT * FROM payroll WHERE empId = ? ORDER BY month DESC', [req.params.empId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Run payroll for all employees for a given month
app.post('/api/payroll/run', (req, res) => {
    const { month } = req.body; // e.g. "2026-07"
    if (!month) return res.status(400).json({ error: 'month is required (YYYY-MM)' });

    db.all('SELECT * FROM employees WHERE status = ?', ['active'], (err, employees) => {
        if (err) return res.status(500).json({ error: err.message });
        if (employees.length === 0) return res.status(400).json({ error: 'No active employees found' });

        // Count attendance days for each employee for the month
        const monthStart = `${month}-01`;
        const monthEnd = `${month}-31`;

        let processed = 0;
        let errors = [];

        employees.forEach(emp => {
            db.get(
                'SELECT COUNT(*) as presentDays FROM attendance WHERE empId = ? AND date >= ? AND date <= ? AND status = ?',
                [emp.id, monthStart, monthEnd, 'present'],
                (err, row) => {
                    if (err) { errors.push(emp.id); return; }
                    const presentDays = row ? row.presentDays : 0;
                    const totalWorkingDays = 26; // Standard working days per month

                    const monthlySalary = emp.salary || 30000;
                    const perDaySalary = monthlySalary / totalWorkingDays;
                    const lopDays = Math.max(0, totalWorkingDays - presentDays);
                    const lopDeduction = Math.round(lopDays * perDaySalary);

                    const basic = Math.round(monthlySalary * 0.4);
                    const hra = Math.round(basic * 0.4);
                    const bonus = Math.round(monthlySalary * 0.08);
                    const lta = Math.round(monthlySalary * 0.05);
                    const food = Math.round(monthlySalary * 0.03);
                    const special = bonus + lta + food; // Maps to 'da' column
                    const allowances = hra + special;

                    const pf = Math.round(basic * 0.12);
                    const pt = 200;
                    const tds = Math.max(0, Math.round((monthlySalary - 250000 / 12) * 0.1));
                    const totalDeductions = pf + pt + tds + lopDeduction;
                    const net = Math.max(0, basic + allowances - totalDeductions);

                    // Check if payroll already exists for this emp+month
                    db.get('SELECT id FROM payroll WHERE empId = ? AND month = ?', [emp.id, month], (err2, existing) => {
                        if (existing) {
                            db.run(
                                'UPDATE payroll SET basic=?, hra=?, da=?, pf=?, tax=?, net=?, allowances=?, deductions=?, netSalary=?, presentDays=?, lopDays=?, status=? WHERE empId=? AND month=?',
                                [basic, hra, special, pf, Math.max(0, tds), net, allowances, totalDeductions, net, presentDays, lopDays, 'Processed', emp.id, month],
                                () => { processed++; if (processed === employees.length) res.json({ success: true, message: `Payroll run for ${processed} employees`, month }); }
                            );
                        } else {
                            db.run(
                                'INSERT INTO payroll (empId, basic, hra, da, pf, tax, net, allowances, deductions, netSalary, presentDays, lopDays, month, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                [emp.id, basic, hra, special, pf, Math.max(0, tds), net, allowances, totalDeductions, net, presentDays, lopDays, month, 'Processed'],
                                () => { processed++; if (processed === employees.length) res.json({ success: true, message: `Payroll run for ${processed} employees`, month }); }
                            );
                        }
                    });
                }
            );
        });
    });
});

// NOTICES
app.get('/api/notices', (req, res) => {
    db.all('SELECT * FROM notices ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/notices', (req, res) => {
    const { title, content, type, author } = req.body;
    if (!title || !content || !type) return res.status(400).json({ error: 'Missing required fields' });
    const createdAt = new Date().toISOString().split('T')[0];
    db.run(
        'INSERT INTO notices (title, content, type, author, createdAt) VALUES (?, ?, ?, ?, ?)',
        [title, content, type, author || 'HR', createdAt],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ success: true, id: this.lastID });
        }
    );
});

app.delete('/api/notices/:id', (req, res) => {
    db.run('DELETE FROM notices WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


