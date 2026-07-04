// ============================================================
// Mock Data — HRMS FANTASTIC 4 × ODOO
// Replace with real Odoo API calls
// ============================================================

export const CURRENT_USER = {
  id: 'EMP-001',
  name: 'Souradeep Pradhan',
  email: 'souradeep@fantastic4.co',
  role: 'admin', // 'admin' | 'employee'
  department: 'Engineering',
  position: 'Team Lead',
  phone: '+91 98765 43210',
  joinDate: '2024-01-15',
  avatar: 'SP',
  salary: 85000,
  manager: 'Riya Sharma',
};

export const EMPLOYEES = [
  { id: 'EMP-001', name: 'Souradeep Pradhan', email: 'souradeep@f4.co', department: 'Engineering', position: 'Team Lead',    status: 'active',   avatar: 'SP', joinDate: '2024-01-15', salary: 85000, phone: '+91 98765 43210' },
  { id: 'EMP-002', name: 'Riya Sharma',       email: 'riya@f4.co',       department: 'HR',          position: 'HR Manager',   status: 'active',   avatar: 'RS', joinDate: '2023-08-10', salary: 78000, phone: '+91 91234 56789' },
  { id: 'EMP-003', name: 'Arjun Mehta',        email: 'arjun@f4.co',      department: 'Design',      position: 'UI Designer',  status: 'active',   avatar: 'AM', joinDate: '2024-03-20', salary: 65000, phone: '+91 87654 32109' },
  { id: 'EMP-004', name: 'Priya Nair',         email: 'priya@f4.co',      department: 'Marketing',   position: 'Analyst',      status: 'on-leave', avatar: 'PN', joinDate: '2023-11-05', salary: 60000, phone: '+91 76543 21098' },
  { id: 'EMP-005', name: 'Karan Gupta',        email: 'karan@f4.co',      department: 'Engineering', position: 'Developer',    status: 'active',   avatar: 'KG', joinDate: '2024-06-01', salary: 70000, phone: '+91 65432 10987' },
  { id: 'EMP-006', name: 'Neha Joshi',         email: 'neha@f4.co',       department: 'Finance',     position: 'Accountant',   status: 'active',   avatar: 'NJ', joinDate: '2023-05-22', salary: 62000, phone: '+91 54321 09876' },
];

export const ATTENDANCE_TODAY = [
  { empId: 'EMP-001', name: 'Souradeep Pradhan', checkIn: '09:02', checkOut: '18:15', status: 'present',  hours: '9h 13m' },
  { empId: 'EMP-002', name: 'Riya Sharma',       checkIn: '09:15', checkOut: '17:45', status: 'present',  hours: '8h 30m' },
  { empId: 'EMP-003', name: 'Arjun Mehta',       checkIn: '10:00', checkOut: '14:30', status: 'half-day', hours: '4h 30m' },
  { empId: 'EMP-004', name: 'Priya Nair',        checkIn: '--',    checkOut: '--',    status: 'on-leave', hours: '--'     },
  { empId: 'EMP-005', name: 'Karan Gupta',       checkIn: '09:30', checkOut: '18:30', status: 'present',  hours: '9h 00m' },
  { empId: 'EMP-006', name: 'Neha Joshi',        checkIn: '--',    checkOut: '--',    status: 'absent',   hours: '--'     },
];

export const MY_ATTENDANCE = [
  { date: '2026-06-30', day: 'Mon', checkIn: '09:02', checkOut: '18:10', status: 'present',  hours: '9h 08m' },
  { date: '2026-07-01', day: 'Tue', checkIn: '08:58', checkOut: '18:30', status: 'present',  hours: '9h 32m' },
  { date: '2026-07-02', day: 'Wed', checkIn: '09:15', checkOut: '14:00', status: 'half-day', hours: '4h 45m' },
  { date: '2026-07-03', day: 'Thu', checkIn: '--',    checkOut: '--',    status: 'on-leave', hours: '--'     },
  { date: '2026-07-04', day: 'Fri', checkIn: '09:05', checkOut: '--',    status: 'present',  hours: 'Active' },
];

export const LEAVE_REQUESTS = [
  { id: 'LR-001', empId: 'EMP-004', empName: 'Priya Nair',    type: 'Sick',   from: '2026-07-03', to: '2026-07-05', days: 3, status: 'pending',  reason: 'Fever and cold',      appliedOn: '2026-07-02' },
  { id: 'LR-002', empId: 'EMP-003', empName: 'Arjun Mehta',   type: 'Paid',   from: '2026-07-10', to: '2026-07-12', days: 3, status: 'approved', reason: 'Family function',     appliedOn: '2026-07-01' },
  { id: 'LR-003', empId: 'EMP-005', empName: 'Karan Gupta',   type: 'Unpaid', from: '2026-07-15', to: '2026-07-16', days: 2, status: 'pending',  reason: 'Personal work',       appliedOn: '2026-07-03' },
  { id: 'LR-004', empId: 'EMP-001', empName: 'Souradeep P.',  type: 'Paid',   from: '2026-06-20', to: '2026-06-22', days: 3, status: 'approved', reason: 'Vacation',            appliedOn: '2026-06-15' },
  { id: 'LR-005', empId: 'EMP-006', empName: 'Neha Joshi',    type: 'Sick',   from: '2026-07-04', to: '2026-07-04', days: 1, status: 'rejected', reason: 'Migraine',            appliedOn: '2026-07-03' },
];

export const MY_LEAVES = LEAVE_REQUESTS.filter(l => l.empId === 'EMP-001');

export const PAYROLL = [
  { empId: 'EMP-001', name: 'Souradeep Pradhan', basic: 85000, hra: 25500, da: 8500,  pf: 10200, tax: 8500,  net: 90300, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-002', name: 'Riya Sharma',       basic: 78000, hra: 23400, da: 7800,  pf: 9360,  tax: 7800,  net: 82040, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-003', name: 'Arjun Mehta',       basic: 65000, hra: 19500, da: 6500,  pf: 7800,  tax: 6500,  net: 76700, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-004', name: 'Priya Nair',        basic: 60000, hra: 18000, da: 6000,  pf: 7200,  tax: 6000,  net: 70800, month: 'June 2026', status: 'pending' },
  { empId: 'EMP-005', name: 'Karan Gupta',       basic: 70000, hra: 21000, da: 7000,  pf: 8400,  tax: 7000,  net: 82600, month: 'June 2026', status: 'paid'    },
  { empId: 'EMP-006', name: 'Neha Joshi',        basic: 62000, hra: 18600, da: 6200,  pf: 7440,  tax: 6200,  net: 73160, month: 'June 2026', status: 'paid'    },
];

export const MY_PROFILE = {
  ...CURRENT_USER,
  location: 'Mumbai, India',
  manager: 'Riya Sharma',
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
  bankDetails: {
    accountNo: '321456987012',
    bankName: 'HDFC Bank',
    ifsc: 'HDFC0001234',
    pan: 'ABCDE1234F',
    uan: '100123456789'
  }
};

export const MY_PAYROLL = {
  ...PAYROLL.find(p => p.empId === 'EMP-001'),
  earnings: {
    basic: 40000,
    hra: 16000,
    special: 34300,
    total: 90300
  },
  deductions: {
    pf: 1800,
    pt: 200,
    tds: 0,
    total: 2000
  }
};
export const CALENDAR_STATUS = {
  1: 'present', 2: 'present', 3: 'half', 4: 'on-leave', 7: 'present',
  8: 'present', 9: 'present', 10: 'present', 11: 'present', 14: 'present',
  15: 'present', 16: 'present', 17: 'absent', 18: 'present', 21: 'present',
  22: 'present', 23: 'present', 24: 'on-leave', 25: 'on-leave',
  28: 'present', 29: 'present', 30: 'present',
};

export const DEPT_STATS = [
  { dept: 'Engineering', count: 2, present: 2 },
  { dept: 'HR',          count: 1, present: 1 },
  { dept: 'Design',      count: 1, present: 1 },
  { dept: 'Marketing',   count: 1, present: 0 },
  { dept: 'Finance',     count: 1, present: 0 },
];
