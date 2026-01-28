// components/forms/PasswordStrengthIndicator.tsx
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password 
}) => {
  const calculateStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/\d/.test(pass)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-400',
    'bg-green-500',
    'bg-green-600',
  ][strength];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Password strength:</span>
        <span className={`font-medium ${
          strength <= 2 ? 'text-red-600' :
          strength <= 3 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {strengthText}
        </span>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};