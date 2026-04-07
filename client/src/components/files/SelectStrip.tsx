import React from "react";

interface SelectStripProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
}

const SelectStrip: React.FC<SelectStripProps> = ({ 
  selectedCount, 
  totalCount, 
  allSelected, 
  onToggleAll 
}) => {
  // Calculate percentage for a subtle progress indicator
  const selectionPercentage = (selectedCount / totalCount) * 100;

  return (
    <div className="relative flex items-center justify-between px-1 mb-4 group select-none">
      {/* Background Selection Track (Desktop only subtle hint) */}
      <div className="absolute bottom-[-8px] left-0 w-full h-[2px] bg-[rgba(var(--border-rgb),0.2)] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[rgb(var(--primary))] transition-all duration-500 ease-out opacity-40"
          style={{ width: `${selectionPercentage}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Animated Counter */}
        <div className="flex flex-col">
          <span className="text-[11px] sm:text-xs font-medium text-[rgba(var(--text),0.5)] transition-colors group-hover:text-[rgba(var(--text),0.7)]">
            {selectedCount > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded bg-[rgb(var(--primary))] text-[9px] font-bold text-white shadow-sm shadow-[rgba(var(--primary),0.3)]">
                  {selectedCount}
                </span>
                <span>of {totalCount} items selected</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[rgba(var(--text),0.3)]" />
                {totalCount} {totalCount === 1 ? "file" : "files"} total
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Select Toggle - Improved Tap Target */}
      <button 
        onClick={onToggleAll}
        className={`
          relative overflow-hidden px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider
          transition-all duration-200 active:scale-95
          ${allSelected 
            ? "text-[rgba(var(--text),0.4)] hover:text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.05)]" 
            : "text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.08)]"
          }
        `}
      >
        <span className="relative z-10">
          {allSelected ? "Deselect all" : "Select all"}
        </span>
      </button>
    </div>
  );
};

export default SelectStrip;