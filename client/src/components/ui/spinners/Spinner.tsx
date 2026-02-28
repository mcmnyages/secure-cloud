interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const strokeSizes = {
    sm: "border-2",
    md: "border-3",
    lg: "border-4",
  };

  return (
    <div
      className={`relative ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Soft base ring */}
      <div
        className={`absolute inset-0 rounded-full ${strokeSizes[size]}`}
        style={{
          borderStyle: "solid",
          borderColor: "rgb(var(--border) / 0.25)",
        }}
      />

      {/* Gradient animated arc */}
      <div
        className={`absolute inset-0 rounded-full ${strokeSizes[size]} animate-premium-spin`}
        style={{
          borderStyle: "solid",
          borderColor: "transparent",
          borderTopColor: "rgb(var(--primary))",
          borderRightColor: "rgb(var(--primary) / 0.6)",
        }}
      />
    </div>
  );
};