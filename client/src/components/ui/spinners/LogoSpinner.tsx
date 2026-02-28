interface LogoSpinnerProps {
  src: string;
  size?: number;
  alt?: string;
  spinLogo?: boolean; // new: let the logo spin too
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  src,
  size = 64,
  alt = "Loading",
  spinLogo = false,
}) => {
  const ringSize = size + 16; // outer animated ring slightly bigger

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: ringSize, height: ringSize }}
      role="status"
      aria-label="Loading"
    >
      {/* Animated Gradient Ring */}
      <svg
        width={ringSize}
        height={ringSize}
        viewBox="0 0 100 100"
        className="absolute animate-premium-spin"
      >
        <defs>
          <linearGradient
            id="logoSpinnerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(var(--primary))" />
            <stop offset="100%" stopColor="rgb(var(--primary) / 0.3)" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#logoSpinnerGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="140 200"
        />
      </svg>

      {/* Circular Logo */}
      <div
        className={`flex items-center justify-center rounded-full overflow-hidden shadow-md ${
          spinLogo ? "animate-premium-spin" : ""
        }`}
        style={{
          width: size,
          height: size,
          backgroundColor: "rgb(var(--card))",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};