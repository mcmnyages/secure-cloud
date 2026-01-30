import { useState } from 'react';
import { useRequestPasswordReset } from '../hooks/email/useRequestPasswordReset';
import type { PasswordResetResponse } from '../types/emailTypes';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState<PasswordResetResponse | null>(null);
  const { mutate, isPending } = useRequestPasswordReset();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(email.trim(), {
      onSuccess: (res) => {
        setResponse(res); // ✅ backend message + sent boolean
      },
      onError: () => {
        setResponse({
          message: 'Something went wrong. It is not you 😅',
          sent: false,
        });
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-center">
          Forgot your password?
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2">
          Enter your email and we’ll send you a password reset link
        </p>

        {response && (
          <div
            className={`mt-6 rounded-lg p-4 text-center font-medium ${
              response.sent
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {response.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-medium
              hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Sending…</span>
              </span>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
