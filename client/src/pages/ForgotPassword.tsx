import { useState } from 'react'
import { useRequestPasswordReset } from '../hooks/email/useRequestPasswordReset'
import type { PasswordResetResponse } from '../types/emailTypes'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiUserPlus } from 'react-icons/fi'
import AppHeader from '../components/navigation/AppHeader'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [response, setResponse] = useState<PasswordResetResponse | null>(null)
  const { mutate, isPending } = useRequestPasswordReset()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(email.trim(), {
      onSuccess: (res) => setResponse(res),
      onError: () =>
        setResponse({
          message: 'Something went wrong. It is not you.',
          sent: false,
        }),
    })
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader collapsed={false} onToggleDesktop={() => {}} onOpenMobile={() => {}} />

      <div className="flex items-center justify-center px-4 py-60">
        <div className="w-full max-w-md bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl p-8">

          {/* Back Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-[rgb(var(--primary))] hover:opacity-80 mb-6 transition"
          >
            <FiArrowLeft />
            Back to login
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full 
              bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]">
              <FiMail size={22} />
            </div>

            <h1 className="mt-4 text-2xl font-semibold">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-[rgb(var(--text)/0.6)]">
              No worries. We’ll email you a reset link.
            </p>
          </div>

          {/* Feedback Message */}
          {response && (
            <div
              className={`mt-6 flex items-start gap-3 rounded-lg p-4 text-sm border ${
                response.sent
                  ? 'bg-[rgb(var(--primary)/0.08)] text-[rgb(var(--primary))] border-[rgb(var(--primary)/0.2)]'
                  : 'bg-[rgb(var(--destructive)/0.08)] text-[rgb(var(--destructive))] border-[rgb(var(--destructive)/0.2)]'
              }`}
              role="alert"
              aria-live="polite"
            >
              <span className="mt-0.5">
                {response.sent ? '✅' : '⚠️'}
              </span>
              <p className="leading-relaxed">{response.message}</p>
            </div>
          )}

          {/* Signup CTA */}
          {response && !response.sent && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[rgb(var(--text)/0.7)]">
              <FiUserPlus className="text-[rgb(var(--primary))]" />
              <span>New here?</span>
              <Link
                to="/register"
                className="font-medium text-[rgb(var(--primary))] hover:underline"
              >
                Create an account
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[rgb(var(--border))] 
                  bg-[rgb(var(--bg))] px-4 py-2.5
                  focus:outline-none focus:ring-2 
                  focus:ring-[rgb(var(--primary))] 
                  focus:border-[rgb(var(--primary))]
                  transition"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg 
                bg-[rgb(var(--primary))] 
                text-white 
                py-2.5 font-medium
                hover:opacity-90
                transition
                disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
