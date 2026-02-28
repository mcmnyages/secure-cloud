// components/ui/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  className = "",
}) => {
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 32,
  };

  const strokeWidthMap = {
    small: 2,
    medium: 2.5,
    large: 3,
  };

  const dimension = sizeMap[size];
  const strokeWidth = strokeWidthMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 50 50"
        className="animate-premium-spin"
      >
        {/* Soft base ring */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="rgb(var(--border) / 0.25)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Premium animated arc */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="url(#premiumGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="90 150"
          strokeDashoffset="0"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id="premiumGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(var(--primary))" />
            <stop
              offset="100%"
              stopColor="rgb(var(--primary) / 0.4)"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};