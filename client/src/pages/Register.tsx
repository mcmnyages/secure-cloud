// pages/Register.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/forms/FormInput';
import { SubmitButton } from '../components/forms/SubmitButton';
import { PasswordStrengthIndicator } from '../components/forms/PasswordStrengthIndicator';
import { useRegisterForm } from '../hooks/useRegisterForm';

const Register: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join our community and get started
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
              disabled={isLoading}
              placeholder="John Doe"
              autoComplete="name"
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              disabled={isLoading}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <div className="space-y-2">
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                required
                disabled={isLoading}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              required
              disabled={isLoading}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <div className="pt-4">
              <SubmitButton
                isLoading={isLoading}
                loadingText="Creating Account..."
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Create Account
              </SubmitButton>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Note: No error UI here - errors are shown as toasts */}
      </div>
    </div>
  );
};

export default Register;