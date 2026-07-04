import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn     from './pages/SignIn';
import SignUp     from './pages/SignUp';
import Dashboard  from './pages/Dashboard';
import Profile    from './pages/Profile';
import Attendance from './pages/Attendance';
import Leaves     from './pages/Leaves';
import Payroll    from './pages/Payroll';
import Employees  from './pages/Employees';
import NoticeBoard from './pages/NoticeBoard';
import Layout     from './components/Layout';

function ProtectedRoute({ children }) {
  const role = localStorage.getItem('hrms_role');
  return role ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard"  element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
        <Route path="/leaves"     element={<ProtectedRoute><Layout><Leaves /></Layout></ProtectedRoute>} />
        <Route path="/payroll"    element={<ProtectedRoute><Layout><Payroll /></Layout></ProtectedRoute>} />
        <Route path="/employees"  element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
        <Route path="/notices"    element={<ProtectedRoute><Layout><NoticeBoard /></Layout></ProtectedRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
