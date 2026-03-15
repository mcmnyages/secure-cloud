import React, { useState } from "react"
import type { RegisterData } from "../../../types/authTypes"
import { FaGoogle, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import { Link } from "react-router-dom"

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-28 bg-gradient-to-br from-[rgb(var(--bg))] to-[rgb(var(--card))] text-[rgb(var(--text))]">

      <div className="w-full max-w-md bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl p-8">

        {/* Header */}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            Create Account
          </h2>

          <p className="text-sm text-[rgb(var(--text)/0.6)] mt-2">
            Sign up to get started
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}

          <div>

            <label className="text-sm text-[rgb(var(--text)/0.7)] mb-1 block">
              Full Name
            </label>

            <div className="relative">

              <FaUser className="absolute left-3 top-3.5 text-[rgb(var(--text)/0.4)]" />

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 p-3 rounded-lg border bg-[rgb(var(--bg))]
                border-[rgb(var(--border))]
                focus:ring-2 focus:ring-[rgb(var(--primary))]
                outline-none transition"
              />

            </div>

          </div>

          {/* Email */}

          <div>

            <label className="text-sm text-[rgb(var(--text)/0.7)] mb-1 block">
              Email Address
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-3 top-3.5 text-[rgb(var(--text)/0.4)]" />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 p-3 rounded-lg border bg-[rgb(var(--bg))]
                border-[rgb(var(--border))]
                focus:ring-2 focus:ring-[rgb(var(--primary))]
                outline-none transition"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="text-sm text-[rgb(var(--text)/0.7)] mb-1 block">
              Password
            </label>

            <div className="relative">

              <FaLock className="absolute left-3 top-3.5 text-[rgb(var(--text)/0.4)]" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 p-3 rounded-lg border bg-[rgb(var(--bg))]
                border-[rgb(var(--border))]
                focus:ring-2 focus:ring-[rgb(var(--primary))]
                outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[rgb(var(--text)/0.4)] hover:text-[rgb(var(--text)/0.7)]"
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
            className={`w-full py-3 rounded-lg font-semibold text-white transition
            ${loading
              ? "bg-[rgb(var(--primary)/0.6)] cursor-not-allowed"
              : "bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary)/0.85)] active:scale-[0.98]"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center gap-3 my-6 text-sm text-[rgb(var(--text)/0.5)]">

          <div className="flex-1 h-px bg-[rgb(var(--border))]" />

          or sign up with

          <div className="flex-1 h-px bg-[rgb(var(--border))]" />

        </div>

        {/* Google */}

        <button
          className="w-full flex items-center justify-center gap-3 border border-[rgb(var(--border))]
          p-3 rounded-lg hover:bg-[rgb(var(--bg))] transition"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        {/* Login */}

        <p className="text-center text-sm mt-6 text-[rgb(var(--text)/0.6)]">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-[rgb(var(--primary))] hover:underline font-medium"
          >
            Log in
          </Link>

        </p>

      </div>

    </div>
  )
}

export default RegisterForm