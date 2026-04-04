import React from "react";
import {
  Search, X, LayoutGrid, List, SlidersHorizontal,
  ImageIcon, Film, FileText, Layers,
} from "lucide-react";
import { IconBtn, TypePill } from "./Index";

interface FilesToolBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (key: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  showFilter: boolean;
  onToggleFilter: () => void;
}

const TYPE_FILTERS = [
  { key: "all", label: "All", icon: Layers },
  { key: "image", label: "Images", icon: ImageIcon },
  { key: "video", label: "Videos", icon: Film },
  { key: "document", label: "Docs", icon: FileText },
] as const;

const FilesToolBar: React.FC<FilesToolBarProps> = ({
  search, onSearchChange,
  typeFilter, onTypeFilterChange,
  viewMode, onViewModeChange,
  showFilter, onToggleFilter,
}) => (
  <div className="flex flex-wrap items-center gap-2 mb-5">

    {/* Search */}
    <div className="relative flex-1 min-w-[180px] max-w-xs">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(var(--text),0.35)] pointer-events-none"
      />
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search files…"
        className="w-full pl-9 pr-8 py-2 rounded-lg text-sm
          border border-[rgba(var(--border-rgb),0.5)]
          bg-[rgb(var(--card))] text-[rgb(var(--text))]
          outline-none placeholder:text-[rgba(var(--text),0.3)]
          focus:border-[rgba(var(--primary),0.5)]
          focus:ring-2 focus:ring-[rgba(var(--primary),0.08)]
          transition-all duration-150"
      />
      {search && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2
            text-[rgba(var(--text),0.35)] hover:text-[rgba(var(--text),0.7)] transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>

    {/* Type pills */}
    <div className="flex gap-1.5 flex-wrap">
      {TYPE_FILTERS.map(({ key, label, icon }) => (
        <TypePill
          key={key}
          label={label}
          icon={icon}
          active={typeFilter === key}
          onClick={() => onTypeFilterChange(key)}
        />
      ))}
    </div>

    {/* Right side controls */}
    <div className="flex items-center gap-1.5 ml-auto">
      <IconBtn
        icon={SlidersHorizontal}
        title="Filters"
        active={showFilter}
        onClick={onToggleFilter}
      />
      <div className="w-px h-5 bg-[rgba(var(--border-rgb),0.5)]" />
      <IconBtn
        icon={List}
        title="List"
        active={viewMode === "list"}
        onClick={() => onViewModeChange("list")}
      />
      <IconBtn
        icon={LayoutGrid}
        title="Grid"
        active={viewMode === "grid"}
        onClick={() => onViewModeChange("grid")}
      />
    </div>
  </div>
);

export default FilesToolBar;