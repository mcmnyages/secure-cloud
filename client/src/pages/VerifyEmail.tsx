import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MailCheck, ArrowLeft, LogIn } from "lucide-react"
import { useResendVerification } from "../hooks/email/useSendVerification"
import AppHeader from "../components/navigation/AppHeader"

const RESEND_DELAY = 60 // seconds

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email
  const userId = location.state?.userId

  const { mutate, isPending } = useResendVerification()

  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY)
  const [canResend, setCanResend] = useState(false)

  // Redirect if accessed directly
  useEffect(() => {
    if (!email || !userId) {
      navigate("/login", { replace: true })
    }
  }, [email, userId, navigate])

  // Countdown timer
  useEffect(() => {
    if (canResend) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [canResend])

  const handleResend = () => {
    if (!userId || !email) return

    mutate({ userId, email })
    setSecondsLeft(RESEND_DELAY)
    setCanResend(false)
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader collapsed={false} onToggleDesktop={() => {}} onOpenMobile={() => {}} />

      <div className="flex items-center justify-center p-4 py-20">
        <div className="relative max-w-md w-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl p-8 text-center">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 text-[rgb(var(--text)/0.5)] hover:text-[rgb(var(--text))] transition"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] p-4 rounded-full">
              <MailCheck size={36} />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            Verify your email
          </h1>

          <p className="text-[rgb(var(--text)/0.6)] mb-4">
            We sent a verification link to
          </p>

          <p className="font-medium bg-[rgb(var(--bg))] border border-[rgb(var(--border))] rounded-lg py-2 px-4 inline-block mb-6">
            {email}
          </p>

          <p className="text-sm text-[rgb(var(--text)/0.5)] mb-6">
            Click the link in the email to activate your account.
          </p>

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={!canResend || isPending}
            className={`w-full py-3 rounded-lg font-medium text-white transition
              ${
                canResend
                  ? "bg-[rgb(var(--primary))] hover:opacity-90"
                  : "bg-[rgb(var(--border))] cursor-not-allowed text-[rgb(var(--text)/0.6)]"
              }
            `}
          >
            {canResend
              ? isPending
                ? "Sending..."
                : "Resend verification email"
              : `Resend in ${secondsLeft}s`}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[rgb(var(--border))]" />
            <span className="px-3 text-xs text-[rgb(var(--text)/0.4)]">OR</span>
            <div className="flex-1 h-px bg-[rgb(var(--border))]" />
          </div>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
              border border-[rgb(var(--border))]
              bg-[rgb(var(--card))]
              hover:bg-[rgb(var(--bg))]
              transition"
          >
            <LogIn size={18} className="text-[rgb(var(--primary))]" />
            Go to login
          </button>

          <p className="text-xs text-[rgb(var(--text)/0.4)] mt-6">
            For security reasons, you can only resend once per minute.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
