import React, { useState, useEffect } from "react";
import { Download, Trash2, X, Check, type LucideIcon } from "lucide-react";

interface BulkBarProps {
  selectedCount: number;
  onDownload: () => void;
  onDelete: () => void;
  onClear: () => void;
}

const BulkBar: React.FC<BulkBarProps> = ({ 
  selectedCount, 
  onDownload, 
  onDelete, 
  onClear 
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Reset confirmation if count changes or bar closes
  useEffect(() => {
    setIsConfirmingDelete(false);
  }, [selectedCount]);

  if (selectedCount === 0) return null;

  return (
    <div 
      role="toolbar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-1 p-1.5 rounded-2xl
        bg-[rgb(var(--card))] border border-[rgba(var(--border-rgb),0.6)]
        shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
        animate-in fade-in zoom-in duration-200 slide-in-from-bottom-4
        max-w-[95vw] sm:max-w-none"
    >
      {/* Selection Badge - Compact on Mobile */}
      <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5">
        <span className="flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full 
          bg-[rgb(var(--primary))] text-[10px] font-bold text-white shadow-sm">
          {selectedCount}
        </span>
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-[rgba(var(--text),0.8)]">
          Selected
        </span>
      </div>

      <div className="mx-1 h-6 w-px bg-[rgba(var(--border-rgb),0.3)]" />

      {/* Action: Download */}
      <ActionButton
        onClick={onDownload}
        icon={Download}
        label="Download"
        variant="primary"
      />

      {/* Action: Delete with 2-step confirmation */}
      <button
        onClick={() => {
          if (isConfirmingDelete) {
            onDelete();
            setIsConfirmingDelete(false);
          } else {
            setIsConfirmingDelete(true);
          }
        }}
        onMouseLeave={() => setIsConfirmingDelete(false)}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold 
          transition-all duration-200 active:scale-95
          ${isConfirmingDelete 
            ? "bg-[rgb(var(--danger))] text-white shadow-lg shadow-[rgba(var(--danger),0.3)]" 
            : "text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.08)]"
          }`}
      >
        {isConfirmingDelete ? <Check size={15} strokeWidth={3} /> : <Trash2 size={15} strokeWidth={2.5} />}
        <span className={isConfirmingDelete ? "inline" : "hidden md:inline"}>
          {isConfirmingDelete ? "Confirm?" : "Delete"}
        </span>
      </button>

      <div className="mx-1 h-6 w-px bg-[rgba(var(--border-rgb),0.3)]" />

      {/* Clear/Dismiss */}
      <button
        onClick={onClear}
        aria-label="Clear selection"
        className="group flex items-center justify-center w-9 h-9 rounded-xl
          text-[rgba(var(--text),0.4)] hover:text-[rgba(var(--text),0.8)]
          hover:bg-[rgba(var(--border-rgb),0.2)] transition-all active:scale-90"
      >
        <X size={18} className="group-hover:rotate-90 transition-transform duration-200" color="red"/>
      </button>
    </div>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  variant: 'primary' | 'danger';
}> = ({ onClick, icon: Icon, label, variant }) => {
  const styles = {
    primary: "text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.08)]",
    danger: "text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.08)]",
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold 
        transition-all active:scale-95 ${styles[variant]}`}
    >
      <Icon size={15} strokeWidth={2.5} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

export default BulkBar;