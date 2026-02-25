import React from "react";

interface ProgressRingProps {
  progress: number;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
}) => {
  const stroke = 8;
  const radius = size / 2;
  const normalized = radius - stroke * 2;
  const circumference = normalized * 2 * Math.PI;
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <svg height={size} width={size}>
      {/* Background Circle */}
      <circle
        stroke="rgb(var(--border))"
        fill="transparent"
        strokeWidth={stroke}
        r={normalized}
        cx={radius}
        cy={radius}
      />

      {/* Progress Circle */}
      <circle
        stroke="rgb(var(--primary))"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={normalized}
        cx={radius}
        cy={radius}
        className="transition-all duration-300"
      />

      {/* Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        style={{
          fill: "rgb(var(--text))",
          fontWeight: 600,
        }}
      >
        {progress}%
      </text>
    </svg>
  );
};