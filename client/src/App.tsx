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
import Files from './pages/Files';
import Settings from './pages/Settings';

// A simple wrapper to protect private routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
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
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
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