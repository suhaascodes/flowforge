import { useMemo, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppSidebar from '../components/dashboard/AppSidebar';
import TopNavbar from '../components/dashboard/TopNavbar';

const routeTitles = {
  '/app': 'Overview',
  '/app/kanban': 'Kanban Board',
  '/app/tasks': 'Task Workspace',
  '/app/analytics': 'Analytics',
  '/app/settings': 'Settings',
};

export default function ProtectedLayout() {
  const location = useLocation();
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => routeTitles[location.pathname] || 'Workspace', [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/80 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="relative flex min-h-screen">
        <AppSidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopNavbar
            pageTitle={pageTitle}
            user={user}
            logout={logout}
            onOpenMobileNav={() => setIsMobileSidebarOpen(true)}
          />
          <main className="min-w-0 flex-1 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
