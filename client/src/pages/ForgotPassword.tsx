import { useState } from 'react';
import { useRequestPasswordReset } from '../hooks/email/useRequestPasswordReset';
import type { PasswordResetResponse } from '../types/emailTypes';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUserPlus } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState<PasswordResetResponse | null>(null);
  const { mutate, isPending } = useRequestPasswordReset();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(email.trim(), {
      onSuccess: (res) => setResponse(res),
      onError: () =>
        setResponse({
          message: 'Something went wrong. It is not you.',
          sent: false,
        }),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Back */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft />
          Back to login
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FiMail size={22} />
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-slate-800">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            No worries. We’ll email you a reset link.
          </p>
        </div>

        {/* Feedback */}
        {response && (
          <div
            className={`mt-6 flex items-start gap-3 rounded-lg p-4 text-sm ${
              response.sent
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            <span className="mt-0.5">
              {response.sent ? '✅' : '⚠️'}
            </span>
            <p className="leading-relaxed">{response.message}</p>
          </div>
        )}

        {/* Signup CTA */}
        {response && !response.sent && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
            <FiUserPlus className="text-blue-600" />
            <span>New here?</span>
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Create an account
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-medium
              hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
