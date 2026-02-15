import { useState } from 'react'
import { useResetPassword } from '../hooks/email/useResetPassword'
import { getQueryParam } from '../utils/getQueryParam'
import { Link } from 'react-router-dom'
import AppHeader from '../components/navigation/AppHeader'

export default function ResetPassword() {
  const token = getQueryParam('token')
  const [password, setPassword] = useState('')
  const [responseMessage, setResponseMessage] = useState<{ message: string; success: boolean } | null>(null)

  const { mutate, isPending } = useResetPassword()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) {
      setResponseMessage({ message: 'Invalid reset link', success: false })
      return
    }

    mutate(
      { token, newPassword: password.trim() },
      {
        onSuccess: (res) => {
          setResponseMessage({
            message: res?.message || 'Password updated successfully',
            success: true,
          })
        },
        onError: () => {
          setResponseMessage({
            message: 'Something went wrong. It is not you 😅',
            success: false,
          })
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader collapsed={false} onToggleDesktop={() => {}} onOpenMobile={() => {}} />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl p-8">

          {/* Header */}
          <h1 className="text-2xl font-semibold text-center">
            Reset your password
          </h1>
          <p className="text-sm text-center mt-2 text-[rgb(var(--text)/0.6)]">
            Choose a new secure password
          </p>

          {/* Feedback Message */}
          {responseMessage && (
            <div
              className={`mt-6 rounded-lg p-4 text-center font-medium border ${
                responseMessage.success
                  ? 'bg-[rgb(var(--primary)/0.08)] text-[rgb(var(--primary))] border-[rgb(var(--primary)/0.2)]'
                  : 'bg-[rgb(var(--destructive)/0.08)] text-[rgb(var(--destructive))] border-[rgb(var(--destructive)/0.2)]'
              }`}
            >
              {responseMessage.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-1"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Resetting…' : 'Reset password'}
            </button>
          </form>

          {/* Login Link */}
          {responseMessage?.success && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-[rgb(var(--primary))] hover:underline"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
