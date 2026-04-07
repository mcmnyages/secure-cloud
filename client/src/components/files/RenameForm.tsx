import React, { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

interface RenameFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const RenameForm: React.FC<RenameFormProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-select text but EXCLUDE the extension for better UX
  useEffect(() => {
    if (inputRef.current) {
      const lastDotIndex = value.lastIndexOf(".");
      // Only select up to the dot if an extension exists
      const endSelection = lastDotIndex !== -1 ? lastDotIndex : value.length;
      inputRef.current.setSelectionRange(0, endSelection);
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit();
      }}
      className="flex items-center gap-1 sm:gap-2 w-full min-w-0 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            // Optional: Submit on blur or Cancel on blur depending on preference
            // If the user clicks elsewhere, we usually want to cancel to prevent accidents
            if (!e.relatedTarget) onCancel();
          }}
          className="w-full px-3 py-1.5 text-sm font-medium rounded-xl
            border border-[rgba(var(--primary),0.6)]
            bg-[rgb(var(--card))] text-[rgb(var(--text))]
            outline-none ring-4 ring-[rgba(var(--primary),0.08)]
            transition-all placeholder:opacity-50"
          placeholder="Enter name..."
        />
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Submit Button - Themed Success */}
        <button
          type="submit"
          aria-label="Confirm rename"
          className="flex items-center justify-center w-8 h-8 rounded-lg
            bg-[rgba(var(--success,34,197,94),0.1)] border border-[rgba(var(--success,34,197,94),0.2)] 
            text-[rgb(var(--success,34,197,94))]
            hover:bg-[rgb(var(--success,34,197,94))] hover:text-white
            transition-all active:scale-90"
        >
          <Check size={16} strokeWidth={3} />
        </button>

        {/* Cancel Button - Themed Danger */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel rename"
          className="flex items-center justify-center w-8 h-8 rounded-lg
            bg-[rgba(var(--danger),0.08)] border border-[rgba(var(--danger),0.2)]
            text-[rgb(var(--danger))]
            hover:bg-[rgb(var(--danger))] hover:text-white
            transition-all active:scale-90"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>
    </form>
  );
};

export default RenameForm;