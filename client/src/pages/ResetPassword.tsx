import { useState } from 'react';
import { useResetPassword } from '../hooks/email/useResetPassword';
import { getQueryParam } from '../utils/getQueryParam';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const token = getQueryParam('token');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState<{ message: string; success: boolean } | null>(null);

  const { mutate, isPending } = useResetPassword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setResponseMessage({ message: 'Invalid reset link', success: false });
      return;
    }

    mutate(
      { token, newPassword: password.trim() },
      {
        onSuccess: (res) => {
          // res can be { success: true, message: string }
          setResponseMessage({
            message: res?.message || 'Password updated successfully',
            success: true,
          });
        },
        onError: () => {
          setResponseMessage({
            message: 'Something went wrong. It is not you 😅',
            success: false,
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-800 text-center">
          Reset your password
        </h1>
        <p className="text-slate-500 text-sm text-center mt-2">
          Choose a new secure password
        </p>

        {responseMessage && (
          <div
            className={`mt-6 rounded-lg p-4 text-center font-medium ${
              responseMessage.success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {responseMessage.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {isPending ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        {responseMessage?.success && (
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 underline font-medium">
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
