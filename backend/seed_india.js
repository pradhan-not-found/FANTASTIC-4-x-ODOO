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

for (let i = 1; i <= 45; i++) {
    const fn = getRandomItem(firstNames);
    const ln = getRandomItem(lastNames);
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@workplace.com`;
    const dept = getRandomItem(departments);
    const pos = getRandomItem(positions[dept]);
    
    // Generate a salary between 30k and 150k per month
    const salary = getRandomInt(30000, 150000);
    
    // Join date between 2020 and 2026
    const year = getRandomInt(2020, 2025);
    const month = String(getRandomInt(1, 12)).padStart(2, '0');
    const day = String(getRandomInt(1, 28)).padStart(2, '0');
    const joinDate = `${year}-${month}-${day}`;
    
    // Random 10-digit phone number starting with 9, 8, or 7
    const phone = `${getRandomItem(['9','8','7'])}${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`;
    
    // EMPID
    const id = `EMP${String(100 + i).padStart(3, '0')}`;

    EMPLOYEES.push({
        id,
        name,
        email,
        password: 'password123',
        role: 'employee',
        department: dept,
        position: pos,
        status: 'Active',
        avatar: '',
        joinDate,
        salary,
        phone
    });
}

db.serialize(() => {
    const stmtEmp = db.prepare('INSERT OR REPLACE INTO employees (id, name, email, password, role, department, position, status, avatar, joinDate, salary, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (let emp of EMPLOYEES) {
        stmtEmp.run(emp.id, emp.name, emp.email, emp.password, emp.role, emp.department, emp.position, emp.status, emp.avatar, emp.joinDate, emp.salary, emp.phone);
    }
    stmtEmp.finalize();

    console.log(`Successfully inserted ${EMPLOYEES.length} Indian employees.`);
});
