import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MailCheck, Loader2, AlertCircle } from "lucide-react"
import { useResendVerification } from "../hooks/email/useResendVerification"
import { useVerifyEmail } from "../hooks/email/useVerifyEmail"
import AppHeader from "../components/navigation/AppHeader"

const RESEND_DELAY = 60

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email
  const userId = location.state?.userId
  const token = new URLSearchParams(location.search).get("token") || ""

  const { mutate, isPending, isSuccess } = useResendVerification()
  const { data, isLoading, isError } = useVerifyEmail(token)

  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY)
  const [canResend, setCanResend] = useState(false)

  // Countdown
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
    if (!email || !userId || !canResend) return

    mutate({ email, userId })
    setSecondsLeft(RESEND_DELAY)
    setCanResend(false)
  }

  // Redirect on success
  useEffect(() => {
    if (data?.verified) {
      const timeout = setTimeout(() => navigate("/login"), 3000)
      return () => clearTimeout(timeout)
    }
  }, [data, navigate])

  // Invalid state (refresh / direct access)
  if (!email && !token) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] flex items-center justify-center p-6">
        <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-xl rounded-2xl p-8 max-w-sm text-center">
          <AlertCircle
            className="mx-auto text-[rgb(var(--destructive))] mb-4"
            size={36}
          />
          <h2 className="text-lg font-semibold mb-2">
            Invalid verification link
          </h2>
          <p className="text-[rgb(var(--text)/0.6)] mb-6">
            Please sign up again or request a new verification email.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-[rgb(var(--primary))] text-white py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Go to signup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <AppHeader collapsed={false} onToggleDesktop={() => {}} onOpenMobile={() => {}} />

      <div className="flex items-center justify-center p-4 py-20">
        <div className="max-w-md w-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl p-8 text-center">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] p-4 rounded-full">
              {isLoading ? (
                <Loader2 className="animate-spin" size={36} />
              ) : (
                <MailCheck size={36} />
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {data?.verified ? "Email verified 🎉" : "Verify your email"}
          </h1>

          <p className="text-[rgb(var(--text)/0.6)] mb-4">
            {data?.verified ? (
              "Your account is now active. Redirecting to login…"
            ) : (
              <>
                We sent a verification link to <br />
                <span className="font-medium text-[rgb(var(--text))]">
                  {email}
                </span>
              </>
            )}
          </p>

          {isError && (
            <div
              className="bg-[rgb(var(--destructive)/0.08)] text-[rgb(var(--destructive))] text-sm rounded-lg p-3 mb-4 border border-[rgb(var(--destructive)/0.2)]"
              role="alert"
            >
              Verification failed. The link may be expired or invalid.
            </div>
          )}

          {!data?.verified && (
            <>
              <button
                onClick={handleResend}
                disabled={!canResend || isPending}
                className={`w-full py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2
                  ${
                    canResend
                      ? "bg-[rgb(var(--primary))] hover:opacity-90"
                      : "bg-[rgb(var(--border))] cursor-not-allowed text-[rgb(var(--text)/0.6)]"
                  }`}
              >
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {canResend
                  ? "Resend verification email"
                  : `Resend in ${secondsLeft}s`}
              </button>

              {isSuccess && (
                <p className="text-[rgb(var(--primary))] text-sm mt-3">
                  Verification email sent successfully ✔
                </p>
              )}

              <p className="text-xs text-[rgb(var(--text)/0.4)] mt-6">
                Didn’t get it? Check your spam folder.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
