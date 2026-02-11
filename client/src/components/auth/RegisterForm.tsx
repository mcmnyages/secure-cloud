import React, { useState } from "react"
import type { RegisterData } from "../../types/authTypes"
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa"

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void
  loading?: boolean
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}...`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <div className="max-w-md w-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[rgb(var(--text))]">
            Create Account
          </h2>
          <p className="text-[rgb(var(--text)/0.6)] mt-2">
            Sign up to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text)/0.8)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border bg-[rgb(var(--bg))] text-[rgb(var(--text))]
              border-[rgb(var(--border))]
              focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text)/0.8)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border bg-[rgb(var(--bg))] text-[rgb(var(--text))]
              border-[rgb(var(--border))]
              focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text)/0.8)] mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 rounded-lg border bg-[rgb(var(--bg))] text-[rgb(var(--text))]
                border-[rgb(var(--border))]
                focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[rgb(var(--text)/0.5)]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-xs text-[rgb(var(--text)/0.5)] mt-1">
              Minimum 8 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all
              ${
                loading
                  ? "bg-[rgb(var(--primary)/0.6)] cursor-not-allowed"
                  : "bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary)/0.85)] active:scale-95"
              }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Social */}
        <div className="mt-6 text-center text-sm text-[rgb(var(--text)/0.5)]">
          or sign up with
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="p-3 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] hover:bg-[rgb(var(--card))] transition"
            aria-label="Sign up with Google"
          >
            <FaGoogle className="text-red-500" />
          </button>
        </div>

        <p className="text-center text-sm text-[rgb(var(--text)/0.6)] mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[rgb(var(--primary))] hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
