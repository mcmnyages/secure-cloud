import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLogin } from "../hooks/auth/useLogin";
import { toast } from "sonner";
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import AppHeader from "../components/ui/navigation/AppHeader";

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
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      login(data.token, data.user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    if (savedPassword) {
      setFormData((prev) => ({ ...prev, password: savedPassword }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
      localStorage.setItem("rememberedPassword", formData.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--bg))] to-[rgb(var(--card))] text-[rgb(var(--text))]">

      <AppHeader collapsed={false} onToggleDesktop={() => {}} onOpenMobile={() => {}} />

      <div className="flex items-center justify-center px-4 py-28">

        <div className="w-full max-w-md p-8 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl">

          {/* Header */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold mb-2">
              Welcome Back
            </h1>

            <p className="text-sm text-[rgb(var(--text)/0.6)]">
              Login to continue to your dashboard
            </p>

          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}

            <div>

              <label className="text-sm text-[rgb(var(--text)/0.7)] mb-1 block">
                Email
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-3 top-3.5 text-[rgb(var(--text)/0.4)]" />

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={isPending}
                  className={`w-full pl-10 p-3 rounded-lg border bg-[rgb(var(--bg))] 
                  focus:ring-2 focus:ring-[rgb(var(--primary))] outline-none transition
                  ${errors.email ? "border-red-500" : "border-[rgb(var(--border))]"}`}
                />

              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}

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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isPending}
                  className={`w-full pl-10 pr-10 p-3 rounded-lg border bg-[rgb(var(--bg))] 
                  focus:ring-2 focus:ring-[rgb(var(--primary))] outline-none transition
                  ${errors.password ? "border-red-500" : "border-[rgb(var(--border))]"}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[rgb(var(--text)/0.4)] hover:text-[rgb(var(--text)/0.7)]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}

            </div>

            {/* Options */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-[rgb(var(--text)/0.7)]">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                Remember me

              </label>

              <Link
                to="/forgot-password"
                className="text-[rgb(var(--primary))] hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Button */}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 rounded-lg font-semibold text-white transition
              ${isPending
                ? "bg-[rgb(var(--primary)/0.6)]"
                : "bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary)/0.85)] active:scale-[0.98]"
              }`}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Divider */}

          <div className="flex items-center gap-3 my-6 text-sm text-[rgb(var(--text)/0.5)]">

            <div className="flex-1 h-px bg-[rgb(var(--border))]" />

            or continue with

            <div className="flex-1 h-px bg-[rgb(var(--border))]" />

          </div>

          {/* Google */}

          <button
            className="w-full flex items-center justify-center gap-3 border border-[rgb(var(--border))] p-3 rounded-lg hover:bg-[rgb(var(--bg))] transition"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          {/* Register */}

          <p className="text-center text-sm mt-6 text-[rgb(var(--text)/0.6)]">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-[rgb(var(--primary))] font-medium hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;