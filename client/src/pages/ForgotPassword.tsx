import { useState } from 'react';
import { useRequestPasswordReset } from '../hooks/email/useRequestPasswordReset';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { mutate, isPending, isSuccess } = useRequestPasswordReset();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(email);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-center">
          Forgot your password?
        </h1>
        <p className="text-slate-500 text-sm text-center mt-2">
          We’ll send you a link to reset it
        </p>

        {isSuccess ? (
          <div className="mt-6 text-center text-blue-600 font-medium">
            📩 If an account exists, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
              {isPending ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
