import React from "react";

interface ProgressRingProps {
  progress: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  stroke = 8,
  showLabel = true,
  className = "",
}) => {
  // Clamp progress between 0–100
  const safeProgress = Math.min(100, Math.max(0, progress));

  const radius = size / 2;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset =
    circumference - (safeProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="progressbar"
      aria-valuenow={safeProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        height={size}
        width={size}
        className="rotate-[-90deg]"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(var(--primary))" />
            <stop
              offset="100%"
              stopColor="rgb(var(--primary) / 0.5)"
            />
          </linearGradient>
        </defs>

        {/* Soft Background Ring */}
        <circle
          stroke="rgb(var(--border) / 0.25)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress Ring */}
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
          style={{
            filter:
              safeProgress === 100
                ? "drop-shadow(0 0 6px rgb(var(--primary) / 0.6))"
                : "none",
          }}
        />
      </svg>

      {/* Center Label */}
      {showLabel && (
        <span
          className="absolute text-sm font-semibold"
          style={{ color: "rgb(var(--text))" }}
        >
          {safeProgress}%
        </span>
      )}
    </div>
  );
};