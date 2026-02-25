export const ProcessingDots = () => {
  const dotStyle = {
    backgroundColor: "rgb(var(--primary))",
  };

  return (
    <div className="flex gap-2">
      <span
        className="h-3 w-3 rounded-full animate-bounce"
        style={dotStyle}
      />
      <span
        className="h-3 w-3 rounded-full animate-bounce [animation-delay:0.15s]"
        style={dotStyle}
      />
      <span
        className="h-3 w-3 rounded-full animate-bounce [animation-delay:0.3s]"
        style={dotStyle}
      />
    </div>
  );
};