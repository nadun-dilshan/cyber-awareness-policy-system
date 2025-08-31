import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Onboarding from './components/auth/Onboarding';
import AdminDashboard from './components/dashboard/AdminDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import PolicyList from './components/policies/PolicyList';
import PolicyUpload from './components/policies/PolicyUpload';
import PolicyAcknowledge from './components/policies/PolicyAcknowledge';
import TrainingList from './components/training/TrainingList';
import TrainingCreate from './components/training/TrainingCreate';
import TrainingView from './components/training/TrainingView';
import QuizTake from './components/training/QuizTake';
import ComplianceReport from './components/compliance/ComplianceReport';
import IncidentList from './components/incidents/IncidentList';
import IncidentReport from './components/incidents/IncidentReport';
import IncidentManage from './components/incidents/IncidentManage';
import NotificationList from './components/notifications/NotificationList';
import AuditLogs from './components/audit/AuditLogs';
import UserList from './components/users/UserList';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ROUTES } from './utils/constants';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} />;
  if (adminOnly && !isAdmin()) return <Navigate to={ROUTES.DASHBOARD} />;
  return children;
};

const App = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" className="min-h-screen" />;

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && <Header />}
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 bg-gray-100 p-6">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path={ROUTES.ONBOARDING}
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  {isAdmin() ? <AdminDashboard /> : <EmployeeDashboard />}
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.POLICIES}
              element={
                <ProtectedRoute>
                  <PolicyList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies/upload"
              element={
                <ProtectedRoute adminOnly>
                  <PolicyUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies/acknowledge/:policyId"
              element={
                <ProtectedRoute>
                  <PolicyAcknowledge />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TRAININGS}
              element={
                <ProtectedRoute>
                  <TrainingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainings/create"
              element={
                <ProtectedRoute adminOnly>
                  <TrainingCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainings/:trainingId"
              element={
                <ProtectedRoute>
                  <TrainingView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainings/quiz/:trainingId"
              element={
                <ProtectedRoute>
                  <QuizTake />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.INCIDENTS}
              element={
                <ProtectedRoute>
                  {isAdmin() ? <IncidentManage /> : <IncidentList />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/report"
              element={
                <ProtectedRoute>
                  <IncidentReport />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.NOTIFICATIONS}
              element={
                <ProtectedRoute>
                  <NotificationList />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.COMPLIANCE}
              element={
                <ProtectedRoute adminOnly>
                  <ComplianceReport />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.AUDIT}
              element={
                <ProtectedRoute adminOnly>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute adminOnly>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;