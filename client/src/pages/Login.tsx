import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLogin } from '../hooks/auth/useLogin'
import { toast } from 'sonner'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import AppHeader from '../components/ui/navigation/AppHeader'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })

  // On mount, check localStorage for saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
    if (savedPassword) {
      setFormData((prev) => ({ ...prev, password: savedPassword }));
    }
  }, []);

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)


  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      if (rememberMe) {
        localStorage.setItem("token", data.token)
      } else {
        sessionStorage.setItem("token", data.token)
      }
      login(data.token, data.user)
      navigate('/dashboard')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    // Save or remove credentials based on rememberMe
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
      localStorage.setItem('rememberedPassword', formData.password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    mutate(formData)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`Logging in with ${provider}...`)
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader collapsed={false} onToggleDesktop={() => { }} onOpenMobile={() => { }} />

      <div className="flex items-center justify-center px-4 py-30">
        <div className="w-full max-w-md p-8 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl">

          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[rgb(var(--text))] mb-2">
              Welcome Back
            </h1>
            <p className="text-[rgb(var(--text)/0.6)]">
              Sign in to your account
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete='on' className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text)/0.8)] mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                autoComplete='email'
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                placeholder="you@example.com"
                className={`w-full p-3 rounded-lg border bg-[rgb(var(--bg))] text-[rgb(var(--text))] 
                focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] 
                ${errors.email
                    ? 'border-red-500'
                    : 'border-[rgb(var(--border))]'
                  }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text)/0.8)] mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete='current-password'
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isPending}
                  placeholder="••••••••"
                  className={`w-full p-3 pr-10 rounded-lg border bg-[rgb(var(--bg))] text-[rgb(var(--text))]
                  focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]
                  ${errors.password
                      ? 'border-red-500'
                      : 'border-[rgb(var(--border))]'
                    }`}
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[rgb(var(--text)/0.5)]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}

            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-sm text-[rgb(var(--text)/0.7)]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[rgb(var(--primary))] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all
                ${isPending
                  ? 'bg-[rgb(var(--primary)/0.6)] cursor-not-allowed'
                  : 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary)/0.85)] active:scale-95'
                }`}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center text-sm text-[rgb(var(--text)/0.5)]">
            or continue with
          </div>

          {/* Social Login */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="p-3 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] hover:bg-[rgb(var(--card))] transition"
            >
              <FaGoogle className="text-red-500" />
            </button>
          </div>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-[rgb(var(--text)/0.6)]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[rgb(var(--primary))] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
