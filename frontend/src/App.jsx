import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from './components/shared/Loading';
import ProtectedRoute from './components/layout/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PlansPage = lazy(() => import('./pages/PlansPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const MyPlanPage = lazy(() => import('./pages/MyPlanPage'));
const MyProfilePage = lazy(() => import('./pages/MyProfilePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminStudentsPage = lazy(() => import('./pages/admin/AdminStudentsPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminPlansPage = lazy(() => import('./pages/admin/AdminPlansPage'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/quem-somos" element={<AboutPage />} />
        <Route path="/planos" element={<PlansPage />} />
        <Route path="/agenda" element={<SchedulePage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/resetar-senha/:token" element={<ResetPasswordPage />} />

        {/* Protected - Student */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/meus-agendamentos" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/meu-plano" element={<ProtectedRoute><MyPlanPage /></ProtectedRoute>} />
        <Route path="/meu-perfil" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
        <Route path="/historico" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/alunos" element={<ProtectedRoute adminOnly><AdminStudentsPage /></ProtectedRoute>} />
        <Route path="/admin/agendamentos" element={<ProtectedRoute adminOnly><AdminBookingsPage /></ProtectedRoute>} />
        <Route path="/admin/planos" element={<ProtectedRoute adminOnly><AdminPlansPage /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}
