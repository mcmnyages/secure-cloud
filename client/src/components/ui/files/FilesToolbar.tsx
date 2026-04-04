import React from "react";
import {
  Search, X, LayoutGrid, List, SlidersHorizontal,
  ImageIcon, Film, FileText, Layers,
} from "lucide-react";
import { IconBtn, TypePill } from "./Index";

interface FilesToolbarProps {
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

const FilesToolbar: React.FC<FilesToolbarProps> = ({
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
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search files..."
        className="w-full pl-9 pr-3 py-2 rounded-md bg-[rgba(var(--bg),0.7)] border border-[rgba(var(--text),0.07)] focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {search && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => onSearchChange("")}
        >
          <X size={14} />
        </button>
      )}
    </div>

    {/* Type Filter */}
    <div className="flex gap-1">
      {TYPE_FILTERS.map(({ key, label, icon: Icon }) => (
        <TypePill
          key={key}
          active={typeFilter === key}
          onClick={() => onTypeFilterChange(key)} label={""} icon={"symbol"}        >
          <Icon size={12} className="mr-1" />
          {label}
        </TypePill>
      ))}
    </div>

    {/* View Mode */}
    <div className="flex gap-1 ml-auto">
      <IconBtn
        active={viewMode === "list"}
        onClick={() => onViewModeChange("list")}
        aria-label="List view" icon={"symbol"} title={""}      >
        <List size={14} />
      </IconBtn>
      <IconBtn
        active={viewMode === "grid"}
        onClick={() => onViewModeChange("grid")}
        aria-label="Grid view" icon={"symbol"} title={""}      >
        <LayoutGrid size={14} />
      </IconBtn>
    </div>

    {/* Filter Toggle */}
    <IconBtn
      active={showFilter}
      onClick={onToggleFilter}
      aria-label="Show filters"
      className="ml-2" icon={"symbol"} title={""}    >
      <SlidersHorizontal size={14} />
    </IconBtn>
  </div>
);

export default FilesToolbar;
