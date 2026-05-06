import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHomePage from './pages/DashboardHomePage';
import ModulePlaceholderPage from './pages/ModulePlaceholderPage';
import KanbanBoardPage from './pages/KanbanBoardPage';

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
            <Route
              path="/app/tasks"
              element={
                <ModulePlaceholderPage
                  title="Task Workspace"
                  description="Task list, detailed filters, and editor views are reserved for upcoming milestones."
                />
              }
            />
            <Route
              path="/app/analytics"
              element={
                <ModulePlaceholderPage
                  title="Analytics"
                  description="Operational reports and trend dashboards will be available once data pipelines are connected."
                />
              }
            />
            <Route
              path="/app/settings"
              element={
                <ModulePlaceholderPage
                  title="Settings"
                  description="Workspace settings, profile controls, and role management will be added in a future module."
                />
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
