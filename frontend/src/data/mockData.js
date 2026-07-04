export let CURRENT_USER = {
  id: 'EMP-001',
  name: 'Souradeep Pradhan',
  email: 'souradeep@fantastic4.co',
  role: 'admin',
  department: 'Engineering',
  position: 'Team Lead',
  phone: '+91 98765 43210',
  joinDate: '2024-01-15',
  avatar: 'SP',
  salary: 85000,
  manager: 'Riya Sharma',
};

export let EMPLOYEES = [];
export let ATTENDANCE_TODAY = [];
export let MY_ATTENDANCE = [];
export let LEAVE_REQUESTS = [];
export let MY_LEAVES = [];
export let PAYROLL = [];
export let MY_PROFILE = {};
export let MY_PAYROLL = {};

export let CALENDAR_STATUS = {
  1: 'present', 2: 'present', 3: 'half', 4: 'on-leave', 7: 'present',
  8: 'present', 9: 'present', 10: 'present', 11: 'present', 14: 'present',
  15: 'present', 16: 'present', 17: 'absent', 18: 'present', 21: 'present',
  22: 'present', 23: 'present', 24: 'on-leave', 25: 'on-leave',
  28: 'present', 29: 'present', 30: 'present',
};

export let DEPT_STATS = [
  { dept: 'Engineering', count: 2, present: 2 },
  { dept: 'HR',          count: 1, present: 1 },
  { dept: 'Design',      count: 1, present: 1 },
  { dept: 'Marketing',   count: 1, present: 0 },
  { dept: 'Finance',     count: 1, present: 0 },
];

export async function initData() {
  try {
    const [empRes, attRes, leaveRes, payRes] = await Promise.all([
      fetch('http://localhost:3000/api/employees'),
      fetch('http://localhost:3000/api/attendance'),
      fetch('http://localhost:3000/api/leaves'),
      fetch('http://localhost:3000/api/payroll')
    ]);

    EMPLOYEES = await empRes.json();
    ATTENDANCE_TODAY = await attRes.json();
    LEAVE_REQUESTS = await leaveRes.json();
    PAYROLL = await payRes.json();

    const userString = localStorage.getItem('hrms_user');
    const loggedInUser = userString ? JSON.parse(userString) : null;
    const loggedInId = loggedInUser ? loggedInUser.id : 'EMP-001';

    MY_ATTENDANCE = ATTENDANCE_TODAY.filter(a => a.empId === loggedInId);
    MY_LEAVES = LEAVE_REQUESTS.filter(l => l.empId === loggedInId);
    
    const myEmp = EMPLOYEES.find(e => e.id === loggedInId) || {};
    MY_PROFILE = { 
      ...CURRENT_USER, 
      ...myEmp, 
      location: 'Mumbai, India',
      company: 'Fantastic 4',
      about: 'I am a passionate software engineer focused on building scalable web applications. With over 4 years of experience, I love tackling complex problems and collaborating with cross-functional teams to deliver high-quality products.',
      loveAboutJob: 'The culture of continuous learning and the freedom to experiment with new technologies.',
      interests: 'Photography, Open-Source Contributing, Trekking.',
      skills: ['React', 'Node.js', 'Tailwind CSS', 'System Design', 'PostgreSQL'],
      certifications: ['AWS Certified Developer - Associate', 'Meta Front-End Developer Professional Certificate'],
      dob: '1998-05-15',
      residingAddress: '101, Sea View Apartments, Bandra West, Mumbai - 400050',
      nationality: 'Indian',
      personalEmail: 'souradeep.personal@gmail.com',
      gender: 'Male',
      maritalStatus: 'Single',
      bankDetails: { accountNo: '321456987012', bankName: 'HDFC Bank', ifsc: 'HDFC0001234', pan: 'ABCDE1234F', uan: '100123456789'} 
    };
    
    const myPay = PAYROLL.find(p => p.empId === loggedInId) || {};
    MY_PAYROLL = { ...myPay, earnings: { basic: 40000, hra: 16000, special: 34300, total: 90300 }, deductions: { pf: 1800, pt: 200, tds: 0, total: 2000 } };
  } catch (error) {
    console.error("Failed to fetch data from backend", error);
  }
}
