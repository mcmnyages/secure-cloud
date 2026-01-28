// components/forms/SubmitButton.tsx
import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading,
  loadingText = 'Processing...',
  fullWidth = true,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        px-6 py-3 bg-blue-600 text-white font-semibold
        rounded-lg transition-all duration-200
        hover:bg-blue-700 active:bg-blue-800
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className}
      `}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};