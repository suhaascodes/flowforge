import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHomePage from './pages/DashboardHomePage';
import ModulePlaceholderPage from './pages/ModulePlaceholderPage';
import KanbanBoardPage from './pages/KanbanBoardPage';
import TaskWorkspacePage from './pages/TaskWorkspacePage';

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/app" element={<DashboardHomePage />} />
            <Route path="/app/kanban" element={<KanbanBoardPage />} />
            <Route path="/app/tasks" element={<TaskWorkspacePage />} />
            <Route
              path="/app/analytics"
              element={(
                <Suspense
                  fallback={(
                    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-[#0d1628]/90">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-cyan-300/80 border-t-transparent" />
                    </div>
                  )}
                >
                  <AnalyticsPage />
                </Suspense>
              )}
            />
            <Route
              path="/app/settings"
              element={(
                <Suspense
                  fallback={(
                    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-[#0d1628]/90">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-cyan-300/80 border-t-transparent" />
                    </div>
                  )}
                >
                  <SettingsPage />
                </Suspense>
              )}
            />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
