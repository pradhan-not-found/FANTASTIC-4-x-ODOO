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
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/leaves"     element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
        <Route path="/payroll"    element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
        <Route path="/employees"  element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/notices"    element={<ProtectedRoute><NoticeBoard /></ProtectedRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
