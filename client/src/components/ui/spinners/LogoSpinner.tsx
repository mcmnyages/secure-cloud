interface LogoSpinnerProps {
  src: string;
  size?: number;
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  src,
  size = 64,
}) => {
  return (
    <div
      className="flex items-center justify-center animate-spin"
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src={src}
        alt="Loading"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
        }}
      />
    </div>
  );
};