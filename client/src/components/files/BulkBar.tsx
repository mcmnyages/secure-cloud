import React from "react";
import { Download, Trash2, X } from "lucide-react";

interface BulkBarProps {
    selectedCount: number;
    onDownload: () => void;
    onDelete: () => void;
    onClear: () => void;
}

const BulkBar: React.FC<BulkBarProps> = ({ selectedCount, onDownload, onDelete, onClear }) => (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
    flex items-center gap-2 px-3.5 py-2.5 rounded-2xl whitespace-nowrap
    bg-[rgb(var(--card))] border border-[rgba(var(--border-rgb),0.6)]
    shadow-[0_8px_30px_rgba(0,0,0,0.18)] animate-scaleIn">
        <span className="text-xs font-semibold text-[rgb(var(--primary))]
      bg-[rgba(var(--primary),0.1)] px-2.5 py-1 rounded-lg">
            {selectedCount} selected
        </span>
        <div className="w-px h-4 bg-[rgba(var(--border-rgb),0.5)]" />
        <button onClick={onDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        text-xs font-medium text-[rgba(var(--text),0.65)]
        hover:bg-[rgba(var(--border-rgb),0.3)] hover:text-[rgb(var(--text))]
        transition-colors">
            <Download size={13} /> Download
        </button>
        <button onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        text-xs font-medium text-[rgb(var(--danger))]
        hover:bg-[rgba(var(--danger),0.08)] transition-colors">
            <Trash2 size={13} /> Delete
        </button>
        <button onClick={onClear}
            className="flex items-center justify-center w-6 h-6 rounded-lg
        text-[rgba(var(--text),0.35)] hover:text-[rgba(var(--text),0.65)]
        hover:bg-[rgba(var(--border-rgb),0.3)] transition-colors">
            <X size={12} />
        </button>
    </div>
);

export default BulkBar;
