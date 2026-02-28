import { useEffect } from "react";
import { Spinner } from "./Spinner";

interface OverlayLoaderProps {
  label?: string;
  description?: string;
}

export const OverlayLoader: React.FC<OverlayLoaderProps> = ({
  label = "Loading...",
  description,
}) => {
  // Prevent background scrolling while loader is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55))",
        backdropFilter: "blur(6px)",
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 animate-scaleIn transition-all"
        style={{
          backgroundColor: "rgb(var(--card))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <Spinner size="lg" />

        <div className="text-center space-y-1">
          <p
            className="text-base sm:text-lg font-semibold tracking-tight"
            style={{ color: "rgb(var(--text))" }}
          >
            {label}
          </p>

          {description && (
            <p
              className="text-sm opacity-70"
              style={{ color: "rgb(var(--text))" }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};