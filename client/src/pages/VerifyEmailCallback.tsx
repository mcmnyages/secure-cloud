import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck, Loader2, AlertCircle } from "lucide-react";
import { useResendVerification } from "../hooks/email/useResendVerification";
import { useVerifyEmail } from "../hooks/email/useVerifyEmail";

const RESEND_DELAY = 60;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const userId = location.state?.userId;
  const token = new URLSearchParams(location.search).get("token") || "";

  const { mutate, isPending, isSuccess } = useResendVerification();
  const { data, isLoading, isError } = useVerifyEmail(token);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  // Countdown
  useEffect(() => {
    if (canResend) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [canResend]);

  const handleResend = () => {
    if (!email || !userId || !canResend) return;

    mutate({ email, userId });
    setSecondsLeft(RESEND_DELAY);
    setCanResend(false);
  };

  // Redirect on success
  useEffect(() => {
    if (data?.verified) {
      const timeout = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timeout);
    }
  }, [data, navigate]);

  // Missing state (refresh / direct access)
  if (!email && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={36} />
          <h2 className="text-lg font-semibold mb-2">Invalid verification link</h2>
          <p className="text-gray-600 mb-6">
            Please sign up again or request a new verification email.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Go to signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            {isLoading ? (
              <Loader2 className="animate-spin" size={36} />
            ) : (
              <MailCheck size={36} />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {data?.verified ? "Email verified 🎉" : "Verify your email"}
        </h1>

        <p className="text-gray-600 mb-4">
          {data?.verified ? (
            "Your account is now active. Redirecting to login…"
          ) : (
            <>
              We sent a verification link to <br />
              <span className="font-medium text-gray-800">{email}</span>
            </>
          )}
        </p>

        {isError && (
          <div
            className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4"
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
              className={`w-full py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 ${
                canResend
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isPending && <Loader2 size={18} className="animate-spin" />}
              {canResend
                ? "Resend verification email"
                : `Resend in ${secondsLeft}s`}
            </button>

            {isSuccess && (
              <p className="text-green-600 text-sm mt-3">
                Verification email sent successfully ✔
              </p>
            )}

            <p className="text-xs text-gray-400 mt-6">
              Didn’t get it? Check your spam folder.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
