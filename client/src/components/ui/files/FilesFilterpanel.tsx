import React from "react";
import { RotateCcw } from "lucide-react";
import { inputCls } from "@/utils/helpers/files/fileUtils";

interface FilesFilterPanelProps {
  extension: string;
  onExtensionChange: (v: string) => void;
  onMinSizeChange: (v: number) => void;
  onMaxSizeChange: (v: number) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  sortBy: "newest" | "size" | "name";
  onSortByChange: (v: "newest" | "size" | "name") => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

const FilterField: React.FC<{ label: string; children: React.ReactNode }> = ({
  label, children,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
      {label}
    </label>
    {children}
  </div>
);

const FilesFilterPanel: React.FC<FilesFilterPanelProps> = ({
  extension, onExtensionChange,
  onMinSizeChange, onMaxSizeChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  sortBy, onSortByChange,
  hasActiveFilters, onReset,
}) => (
  <div className="mb-5 p-4 rounded-xl border border-[rgba(var(--border-rgb),0.5)]
    bg-[rgb(var(--card))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-fadeIn">

    <FilterField label="Extension">
      <input
        className={inputCls}
        type="text"
        placeholder="pdf, png…"
        value={extension}
        onChange={(e) => onExtensionChange(e.target.value)}
      />
    </FilterField>

    <FilterField label="Min size">
      <input
        className={inputCls}
        type="number"
        placeholder="bytes"
        onChange={(e) => onMinSizeChange(Number(e.target.value))}
      />
    </FilterField>

    <FilterField label="Max size">
      <input
        className={inputCls}
        type="number"
        placeholder="bytes"
        onChange={(e) => onMaxSizeChange(Number(e.target.value))}
      />
    </FilterField>

    <FilterField label="From">
      <input
        className={inputCls}
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
      />
    </FilterField>

    <FilterField label="To">
      <input
        className={inputCls}
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
      />
    </FilterField>

    <FilterField label="Sort">
      <div className="flex flex-col gap-2">
        <select
          className={inputCls}
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as "newest" | "size" | "name")}
        >
          <option value="newest">Newest</option>
          <option value="size">Largest</option>
          <option value="name">Name A–Z</option>
        </select>
        <button
          disabled={!hasActiveFilters}
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2
            rounded-lg text-xs font-medium
            border border-[rgba(var(--danger),0.35)] text-[rgb(var(--danger))]
            hover:bg-[rgba(var(--danger),0.08)]
            disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>
    </FilterField>
  </div>
);

export default FilesFilterPanel;