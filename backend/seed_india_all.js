const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const firstNames = [
    'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Anaya', 'Aaradhya', 'Ojas',
    'Ishaan', 'Aryan', 'Reyansh', 'Dhruv', 'Ayaan', 'Aaditya', 'Arjun', 'Atharv', 'Sai', 'Krishna',
    'Aadhya', 'Kavya', 'Avni', 'Myra', 'Prisha', 'Riya', 'Sara', 'Kyra', 'Kiara', 'Anya',
    'Siddharth', 'Rohan', 'Karan', 'Vikram', 'Aditya', 'Sneha', 'Pooja', 'Neha', 'Priya', 'Swati',
    'Rajesh', 'Suresh', 'Amit', 'Sunil', 'Manish'
];

const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Rao', 'Nair', 'Iyer',
    'Jain', 'Bose', 'Chakraborty', 'Das', 'Roy', 'Saha', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Sen',
    'Mishra', 'Pandey', 'Tiwari', 'Yadav', 'Chauhan', 'Thakur', 'Garg', 'Agarwal', 'Bansal', 'Goyal',
    'Bhatia', 'Kaur', 'Sethi', 'Malhotra', 'Kapur', 'Mehra', 'Chopra', 'Joshi', 'Kulkarni', 'Deshmukh',
    'Rana', 'Nath', 'Ahluwalia', 'Shetty', 'Pillai'
];

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];
const positions = {
    'Engineering': ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'QA Engineer', 'DevOps'],
    'Marketing': ['Marketing Executive', 'SEO Specialist', 'Content Writer', 'Marketing Manager'],
    'Sales': ['Sales Representative', 'Account Executive', 'Sales Manager'],
    'HR': ['HR Generalist', 'Recruiter', 'HR Manager'],
    'Finance': ['Accountant', 'Financial Analyst', 'Finance Manager'],
    'Operations': ['Operations Executive', 'Operations Manager'],
    'Design': ['UI/UX Designer', 'Product Designer', 'Graphic Designer']
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[getRandomInt(0, arr.length - 1)];
}

const EMPLOYEES = [];
const ATTENDANCE = [];
const LEAVES = [];
const PAYROLL = [];
const NOTICES = [];

// Base date for generating recent records
const baseDate = new Date('2026-05-15');

for (let i = 1; i <= 45; i++) {
    const fn = getRandomItem(firstNames);
    const ln = getRandomItem(lastNames);
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@workplace.com`;
    const dept = getRandomItem(departments);
    const pos = getRandomItem(positions[dept]);
    const salary = getRandomInt(30000, 150000);
    const joinDate = `2024-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`;
    const phone = `${getRandomItem(['9','8','7'])}${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`;
    const id = `EMP${String(200 + i).padStart(3, '0')}`;

    EMPLOYEES.push({
        id, name, email, password: 'password123', role: 'employee', department: dept,
        position: pos, status: 'Active', avatar: '', joinDate, salary, phone,
        about: `Hi, I am ${name}, a ${pos} in the ${dept} department.`,
        skills: JSON.stringify(['Communication', 'Teamwork', getRandomItem(['React', 'Node.js', 'Salesforce', 'Figma', 'Excel'])]),
        dob: `199${getRandomInt(0, 9)}-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`
    });

    // Generate Attendance for past 5 days
    for (let d = 0; d < 5; d++) {
        let attDate = new Date(baseDate);
        attDate.setDate(attDate.getDate() - d);
        if (attDate.getDay() === 0 || attDate.getDay() === 6) continue; // Skip weekends
        
        const dateStr = attDate.toISOString().split('T')[0];
        const dayStr = attDate.toLocaleDateString('en-US', { weekday: 'short' });
        
        const inHr = getRandomInt(8, 10);
        const inMin = getRandomInt(0, 59);
        const outHr = inHr + getRandomInt(7, 9);
        const outMin = getRandomInt(0, 59);
        
        const checkIn = `${String(inHr).padStart(2, '0')}:${String(inMin).padStart(2, '0')}`;
        const checkOut = `${String(outHr).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
        
        let status = 'Present';
        if (inHr > 9 || (inHr === 9 && inMin > 15)) status = 'Late';
        
        const totalHrs = (outHr - inHr) + (outMin - inMin) / 60;
        const hoursStr = totalHrs.toFixed(2) + ' hrs';

        ATTENDANCE.push({
            empId: id, date: dateStr, day: dayStr, checkIn, checkOut, status, hours: hoursStr
        });
    }

    // Generate 1 or 2 Leaves
    const numLeaves = getRandomInt(0, 2);
    for (let l = 0; l < numLeaves; l++) {
        const lDate = new Date(baseDate);
        lDate.setDate(lDate.getDate() + getRandomInt(1, 20));
        const fromDate = lDate.toISOString().split('T')[0];
        lDate.setDate(lDate.getDate() + getRandomInt(0, 3));
        const toDate = lDate.toISOString().split('T')[0];
        
        LEAVES.push({
            id: `L-${id}-${l}`, empId: id, type: getRandomItem(['Paid Time off', 'Sick Leave']),
            fromDate, toDate, days: getRandomInt(1, 4), status: getRandomItem(['Approved', 'Pending', 'Rejected']),
            reason: 'Personal reasons', appliedOn: new Date().toISOString().split('T')[0]
        });
    }

    // Generate Payroll for previous month (April 2026)
    const basic = Math.round(salary * 0.4);
    const hra = Math.round(basic * 0.4);
    const pf = Math.round(basic * 0.12);
    const tax = 200; // PT
    const tds = Math.max(0, Math.round((salary - 250000 / 12) * 0.1));
    const allowances = hra + Math.round(salary * 0.16); // HRA + other approx allowances
    const deductions = pf + tax + tds;
    const netSalary = basic + allowances - deductions;

    PAYROLL.push({
        empId: id, basic, hra, da: 0, pf, tax: tax + tds, net: netSalary, month: '2026-04', status: 'Paid'
    });
}

// Generate some notices
NOTICES.push({
    title: 'Upcoming Public Holiday', content: 'The office will remain closed on Monday due to a national holiday.', type: 'General', author: 'HR Team', createdAt: new Date().toISOString()
});
NOTICES.push({
    title: 'Q2 All-Hands Meeting', content: 'Join us for the quarterly update this Friday at 4 PM in the main hall.', type: 'Important', author: 'CEO', createdAt: new Date().toISOString()
});
NOTICES.push({
    title: 'New Cafeteria Menu', content: 'We have updated the cafeteria menu with healthier options starting next week!', type: 'General', author: 'Admin', createdAt: new Date().toISOString()
});

db.serialize(() => {
    const stmtEmp = db.prepare('INSERT OR REPLACE INTO employees (id, name, email, password, role, department, position, status, avatar, joinDate, salary, phone, about, skills, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let emp of EMPLOYEES) {
        stmtEmp.run(emp.id, emp.name, emp.email, emp.password, emp.role, emp.department, emp.position, emp.status, emp.avatar, emp.joinDate, emp.salary, emp.phone, emp.about, emp.skills, emp.dob);
    }
    stmtEmp.finalize();

    const stmtAtt = db.prepare('INSERT INTO attendance (empId, date, day, checkIn, checkOut, status, hours) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (let att of ATTENDANCE) {
        stmtAtt.run(att.empId, att.date, att.day, att.checkIn, att.checkOut, att.status, att.hours);
    }
    stmtAtt.finalize();

    const stmtLeave = db.prepare('INSERT OR REPLACE INTO leaves (id, empId, type, fromDate, toDate, days, status, reason, appliedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let l of LEAVES) {
        stmtLeave.run(l.id, l.empId, l.type, l.fromDate, l.toDate, l.days, l.status, l.reason, l.appliedOn);
    }
    stmtLeave.finalize();

    const stmtPay = db.prepare('INSERT INTO payroll (empId, basic, hra, da, pf, tax, net, month, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let p of PAYROLL) {
        stmtPay.run(p.empId, p.basic, p.hra, p.da, p.pf, p.tax, p.net, p.month, p.status);
    }
    stmtPay.finalize();

    const stmtNotice = db.prepare('INSERT INTO notices (title, content, type, author, createdAt) VALUES (?, ?, ?, ?, ?)');
    for (let n of NOTICES) {
        stmtNotice.run(n.title, n.content, n.type, n.author, n.createdAt);
    }
    stmtNotice.finalize();

    console.log(`Successfully inserted data for all tables for ${EMPLOYEES.length} employees.`);
});
