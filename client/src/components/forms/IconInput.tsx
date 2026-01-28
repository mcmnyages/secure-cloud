// components/forms/IconInput.tsx
import React, { forwardRef } from 'react';
// import { LucideIcon } from 'lucide-react'; // You can use any icon library

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ label, icon, error, helperText, className = '', ...props }, ref) => {
    const inputId = props.id || props.name || `input-${label}`;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 
              border rounded-lg focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 transition-all duration-200 outline-none
              ${error 
                ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                : 'border-gray-300'
              }
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>
        
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

IconInput.displayName = 'IconInput';