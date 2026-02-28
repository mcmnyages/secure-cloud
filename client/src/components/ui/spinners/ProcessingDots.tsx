interface ProcessingDotsProps {
  size?: number;
  className?: string;
}

export const ProcessingDots: React.FC<ProcessingDotsProps> = ({
  size = 8,
  className = "",
}) => {
  const dotStyle = {
    width: size,
    height: size,
    backgroundColor: "rgb(var(--primary))",
  };

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="status"
      aria-label="Processing"
    >
      <span
        className="rounded-full animate-processing-dot"
        style={{ ...dotStyle, animationDelay: "0s" }}
      />
      <span
        className="rounded-full animate-processing-dot"
        style={{ ...dotStyle, animationDelay: "0.15s" }}
      />
      <span
        className="rounded-full animate-processing-dot"
        style={{ ...dotStyle, animationDelay: "0.3s" }}
      />
    </div>
  );
};