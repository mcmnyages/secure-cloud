import { useState, useEffect } from 'react'
import { useRequestPasswordReset } from '../hooks/email/useRequestPasswordReset'
import type { PasswordResetResponse } from '../types/emailTypes'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiCheckCircle, FiAlertCircle, FiEdit2, FiClock } from 'react-icons/fi'
import AppHeader from '../components/ui/navigation/AppHeader'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [response, setResponse] = useState<PasswordResetResponse | null>(null)
  const [timer, setTimer] = useState(0)
  const { mutate, isPending } = useRequestPasswordReset()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (timer > 0) return

    mutate(email.trim(), {
      onSuccess: (res) => {
        setResponse(res)
        if (res.sent) setTimer(120)
      },
      onError: () =>
        setResponse({
          message: 'Unable to process request. Please try again.',
          sent: false,
        }),
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] selection:bg-[rgb(var(--primary)/0.3)]">
      <AppHeader collapsed={false} onToggleDesktop={() => { }} onOpenMobile={() => { }} />

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[rgb(var(--primary)/0.03)] rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">

          <Link
            to="/login"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--text)/0.5)] hover:text-[rgb(var(--primary))] mb-8 transition-all"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>

          <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-8 md:p-10">

              <div className="flex flex-col items-center text-center mb-10">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-6 transition-all duration-500 shadow-inner ${response?.sent
                    ? 'bg-[rgb(var(--primary)/0.15)] text-[rgb(var(--primary))] scale-110'
                    : 'bg-[rgb(var(--text)/0.05)] text-[rgb(var(--text)/0.8)] rotate-3'
                  }`}>
                  {response?.sent ? <FiCheckCircle size={32} strokeWidth={2.5} /> : <FiMail size={30} />}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  {response?.sent ? 'Check your inbox' : 'Reset password'}
                </h1>

                {response?.sent ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgb(var(--text)/0.04)] border border-[rgb(var(--border))] max-w-full">
                    <span className="text-sm font-medium text-[rgb(var(--text)/0.7)] truncate">{email}</span>
                    <button onClick={() => setResponse(null)} className="text-[rgb(var(--primary))] hover:opacity-70 transition-opacity">
                      <FiEdit2 size={12} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[rgb(var(--text)/0.5)] leading-relaxed px-4">
                    Enter the email associated with your account and we'll send a recovery link.
                  </p>
                )}
              </div>

              {response?.sent ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 rounded-2xl bg-[rgb(var(--primary)/0.05)] border border-[rgb(var(--primary)/0.1)]">
                    <p className="text-xs md:text-sm text-center text-[rgb(var(--text)/0.7)] leading-relaxed">
                      We sent a secure link to your email. It will expire in 1 hour for security.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleSubmit()}
                      disabled={isPending || timer > 0}
                      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[rgb(var(--border))] text-sm font-bold transition-all
                        enabled:hover:bg-[rgb(var(--text)/0.03)] enabled:active:scale-[0.98]
                        disabled:opacity-50 disabled:grayscale"
                    >
                      {isPending ? (
                        <div className="h-4 w-4 border-2 border-[rgb(var(--text)/0.2)] border-t-[rgb(var(--primary))] rounded-full animate-spin" />
                      ) : timer > 0 ? (
                        <>
                          <FiClock className="text-[rgb(var(--primary))]" size={16} />
                          <span className="tabular-nums">Resend in {formatTime(timer)}</span>
                        </>
                      ) : (
                        'Try sending again'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {response && !response.sent && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgb(var(--destructive)/0.08)] border border-[rgb(var(--destructive)/0.2)] text-[rgb(var(--destructive))] animate-in fade-in zoom-in-95">
                      <FiAlertCircle size={18} className="shrink-0" />
                      <p className="text-sm font-semibold">{response.message}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--text)/0.4)] ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@company.com"
                      className="w-full rounded-xl border border-[rgb(var(--border))] 
                        bg-[rgb(var(--bg))] px-4 py-4 text-sm
                        focus:outline-none focus:ring-2 
                        focus:ring-[rgb(var(--primary)/0.15)] 
                        focus:border-[rgb(var(--primary))]
                        transition-all shadow-sm placeholder:text-[rgb(var(--text)/0.3)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full relative group overflow-hidden rounded-xl bg-[rgb(var(--primary))] text-white py-4 font-bold shadow-lg shadow-[rgb(var(--primary)/0.25)] hover:shadow-[rgb(var(--primary)/0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isPending ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Send Reset Link'
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>

            <div className="px-8 py-6 bg-[rgb(var(--text)/0.03)] border-t border-[rgb(var(--border))]">
              <p className="text-center text-sm text-[rgb(var(--text)/0.5)]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[rgb(var(--primary))] hover:text-[rgb(var(--primary)/0.8)] transition-colors underline-offset-4 hover:underline"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}