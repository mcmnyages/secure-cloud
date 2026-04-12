import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import VerifyEmailCallback from './pages/VerifyEmailCallback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import Files from './pages/files/Files';
import FileVersionPage from './pages/files/FileVersionPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { OverlayLoader, LogoSpinner } from '@/components/ui/spinners';

// A simple wrapper to protect private routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <OverlayLoader />;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <OverlayLoader />;

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};
const HomeRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <OverlayLoader description='loading your pages' />; // or a spinner

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/landing" replace />;
};

function App() {

  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--bg))]">
        <LogoSpinner src="/favicon.ico" spinLogo={true} size={100} />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        richColors={true}
      />

      <Router>
        {/* Apply theme colors via CSS variables */}
        <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify" element={<VerifyEmailCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Authenticated routes */}
            <Route path="/" element={<AuthenticatedLayout />}>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <PrivateRoute>
                    <Files />
                  </PrivateRoute>
                }
              />

              <Route
                path="/files/:fileId/versions"
                element={
                  <PrivateRoute>
                    <FileVersionPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
                />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;