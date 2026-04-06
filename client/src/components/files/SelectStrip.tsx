import React from "react";

interface SelectStripProps {
    selectedCount: number;
    totalCount: number;
    allSelected: boolean;
    onToggleAll: () => void;
}

const SelectStrip: React.FC<SelectStripProps> = ({ selectedCount, totalCount, allSelected, onToggleAll }) => (
    <div className="flex items-center justify-between px-1 mb-4">
        <span className="text-xs text-[rgba(var(--text),0.45)]">
            {selectedCount > 0
                ? <><span className="font-semibold text-[rgb(var(--primary))]">{selectedCount}</span> of {totalCount} selected</>
                : <>{totalCount} file{totalCount !== 1 ? "s" : ""}</>}
        </span>
        <button onClick={onToggleAll}
            className="text-xs font-medium text-[rgb(var(--primary))] hover:underline underline-offset-2 transition-all">
            {allSelected ? "Deselect all" : "Select all"}
        </button>
    </div>
);

export default SelectStrip;
