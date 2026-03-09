import { useState } from 'react'
import { useResetPassword } from '../hooks/email/useResetPassword'
import { getQueryParam } from '../utils/getQueryParam'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import AppHeader from '../components/ui/navigation/AppHeader'

export default function ResetPassword() {
  const token = getQueryParam('token')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const { mutate, isPending } = useResetPassword()

  const isPasswordValid = password.trim().length >= 8

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid or expired reset link.')
      return
    }

    if (!isPasswordValid) {
      toast.warning('Password must be at least 8 characters long.')
      return
    }

    mutate(
      { token, newPassword: password.trim() },
      {
        onSuccess: (res) => {
          toast.success(res?.message ?? 'Password updated successfully 🎉')
          setPassword('')
          setSuccess(true)
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              'Something went wrong. Please try again.'
          )
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader collapsed={false} onToggleDesktop={() => {}} onOpenMobile={() => {}} />

      <div className="flex items-center justify-center px-4 py-70">
        <div className="w-full max-w-md bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              Reset your password
            </h1>
            <p className="text-sm mt-2 text-[rgb(var(--text)/0.6)]">
              Choose a new secure password
            </p>
          </div>

          {/* Form */}
          {!success && (
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
                  autoComplete="new-password"
                  required
                  minLength={8}
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

                <p className="text-xs mt-1 text-[rgb(var(--text)/0.5)]">
                  Must be at least 8 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending || !isPasswordValid}
                className="w-full rounded-lg
                  bg-[rgb(var(--primary))]
                  text-white
                  py-2.5 font-medium
                  hover:opacity-90
                  transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Resetting password...' : 'Reset password'}
              </button>

            </form>
          )}

          {/* Success State */}
          {success && (
            <div className="mt-6 text-center space-y-4">
              <p className="text-[rgb(var(--text)/0.7)]">
                Your password has been successfully updated.
              </p>

              <Link
                to="/login"
                className="font-medium text-[rgb(var(--primary))] hover:underline"
              >
                Continue to login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}