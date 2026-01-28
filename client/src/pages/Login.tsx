// pages/Login.tsx
import React, {useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormInput } from '../components/forms/FormInput';
import { SubmitButton } from '../components/forms/SubmitButton';
import { useLoginForm } from '../hooks/useLoginForm';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';


const Login: React.FC = () => {
  const location = useLocation();
  const { 
    formData, 
    errors, 
    isLoading, 
    serverError, 
    handleChange, 
    handleBlur, 
    handleSubmit 
  } = useLoginForm();

  const successMessage = location.state?.message;
    // Add this to check if already logged in
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('You are already logged in. Redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Success Message from Registration */}
          {successMessage && (
            <div 
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
              role="alert"
            >
              {successMessage}
            </div>
          )}

          {/* Server Error */}
          {serverError && (
            <div 
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {serverError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              disabled={isLoading}
              placeholder="you@example.com"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormInput
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                required
                disabled={isLoading}
                placeholder="••••••••" label={''}              />
            </div>

            <div className="pt-2">
              <SubmitButton
                isLoading={isLoading}
                loadingText="Signing in..."
                disabled={isLoading}
              >
                Sign In
              </SubmitButton>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;