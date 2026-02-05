import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLogin } from '../hooks/auth/useLogin';
import { toast } from 'sonner';
import { FaGoogle, FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutate(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Logging in with ${provider}...`);
    // Replace with your actual social login logic
  };

  return (
    <div>
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">
        <FaHome size={24} />
      </button>
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
              placeholder="you@example.com"
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-600 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isPending}
                placeholder="••••••••"
                className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-600 text-sm mt-1">
                {errors.password}
              </p>
            )}
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-500">or continue with</span>
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Login with Google"
          >
            <FaGoogle className="text-red-500" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
