import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck, ArrowLeft, LogIn } from "lucide-react";
import { useResendVerification } from "../hooks/email/useSendVerification";

const RESEND_DELAY = 60; // seconds

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const userId = location.state?.userId;

  const { mutate, isPending } = useResendVerification();

  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  // Redirect if accessed directly
  useEffect(() => {
    if (!email || !userId) {
      navigate("/login", { replace: true });
    }
  }, [email, userId, navigate]);

  // Countdown timer
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
    if (!userId || !email) return;

    mutate({ userId, email });
    setSecondsLeft(RESEND_DELAY);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <MailCheck size={36} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify your email
        </h1>

        <p className="text-gray-600 mb-4">
          We sent a verification link to
        </p>

        <p className="font-medium text-gray-800 bg-gray-100 rounded-lg py-2 px-4 inline-block mb-6">
          {email}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Click the link in the email to activate your account.
        </p>

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

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          <LogIn size={18} />
          Go to login
        </button>

        <p className="text-xs text-gray-400 mt-6">
          For security reasons, you can only resend once per minute.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
