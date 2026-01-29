import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useResendVerification } from "../hooks/email/useResendVerification";
import { useVerifyEmail } from "../hooks/email/useVerifyEmail";

const RESEND_DELAY = 60;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const userId = location.state?.userId;
  const token = new URLSearchParams(location.search).get("token") || "";

  const { mutate, isPending } = useResendVerification();
  const { data, isLoading, isError } = useVerifyEmail(token);

  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
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
    if (!email || !userId) return;

    mutate({ email, userId });
    setSecondsLeft(RESEND_DELAY);
    setCanResend(false);
  };

  // Redirect after successful verification
  useEffect(() => {
    if (data?.verified) {
      const timeout = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timeout);
    }
  }, [data, navigate]);

  // UI States
  if (isLoading) {
    return <p className="text-center mt-20">Verifying your email...</p>;
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-red-600">
        Verification failed. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <MailCheck size={36} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {data?.verified ? "Email Verified!" : "Verify Your Email"}
        </h1>

        <p className="text-gray-600 mb-4">
          {data?.verified
            ? "Your account is now active. Redirecting to login..."
            : `We sent a verification link to ${email}`}
        </p>

        {!data?.verified && (
          <>
            <button
              onClick={handleResend}
              disabled={!canResend || isPending}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                canResend
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {canResend
                ? isPending
                  ? "Sending..."
                  : "Resend verification email"
                : `Resend in ${secondsLeft}s`}
            </button>

            <p className="text-xs text-gray-400 mt-6">
              For security reasons, you can only resend once per minute.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
