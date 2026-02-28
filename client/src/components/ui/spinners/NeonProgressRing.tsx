import React from "react";

interface ProgressRingProps {
  progress: number;
  size?: number;
}

export const NeonProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 140,
}) => {
  const stroke = 10;
  const radius = size / 2;
  const normalized = radius - stroke;
  const circumference = 2 * Math.PI * normalized;
  const safeProgress = Math.min(100, Math.max(0, progress));
  const offset =
    circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={size}
        width={size}
        className="rotate-[-90deg]"
      >
        <defs>
          <linearGradient id="neonGradient">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="50%" stopColor="#00D9F5" />
            <stop offset="100%" stopColor="#7A5FFF" />
          </linearGradient>
        </defs>

        <circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalized}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="url(#neonGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={normalized}
          cx={radius}
          cy={radius}
          className="transition-all duration-700 ease-out"
          style={{
            filter: "drop-shadow(0 0 12px #00D9F5)",
          }}
        />
      </svg>

      <span className="absolute text-lg font-bold text-white">
        {safeProgress}%
      </span>
    </div>
  );
};