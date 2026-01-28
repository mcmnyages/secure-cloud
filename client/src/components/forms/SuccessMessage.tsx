// components/forms/SuccessMessage.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div 
      className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <p className="text-green-700 text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};