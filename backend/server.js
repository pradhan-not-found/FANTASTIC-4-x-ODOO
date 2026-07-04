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

app.post('/api/attendance/checkin', (req, res) => {
    const { empId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const checkIn = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    db.run(
        'INSERT INTO attendance (empId, date, checkIn, status) VALUES (?, ?, ?, ?)',
        [empId, date, checkIn, 'present'],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Checked in', id: this.lastID });
        }
    );
});

app.put('/api/attendance/checkout/:id', (req, res) => {
    const checkOut = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    db.run(
        'UPDATE attendance SET checkOut = ? WHERE id = ?',
        [checkOut, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Checked out' });
        }
    );
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

app.post('/api/leaves', (req, res) => {
    const { empId, type, fromDate, toDate, days, reason } = req.body;
    const id = `LV-${Date.now()}`;
    const status = 'Pending';
    const appliedOn = new Date().toISOString().split('T')[0];
    db.run(
        'INSERT INTO leaves (id, empId, type, fromDate, toDate, days, status, reason, appliedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, empId, type, fromDate, toDate, days, status, reason, appliedOn],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Leave applied successfully' });
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
