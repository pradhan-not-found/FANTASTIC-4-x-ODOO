import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const role = localStorage.getItem('hrms_role') || 'admin';
  return (
    <div className="flex min-h-screen bg-[var(--app-canvas)] overflow-hidden">
      <Sidebar role={role} />
      <div className="flex-1 ml-[312px] flex flex-col min-h-screen apple-inset transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
