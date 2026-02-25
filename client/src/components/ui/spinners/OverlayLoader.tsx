import { Spinner } from "./Spinner";

interface OverlayLoaderProps {
  label?: string;
}

export const OverlayLoader: React.FC<OverlayLoaderProps> = ({
  label = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4"
        style={{
          backgroundColor: "rgb(var(--card))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <Spinner size="lg" />

        <p
          style={{
            color: "rgb(var(--text))",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};