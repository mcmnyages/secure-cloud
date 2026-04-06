import React from "react";
import { Search, X, SlidersHorizontal, List, LayoutGrid } from "lucide-react";
import TypePill from "./TypePill";
import IconBtn from "./IconBtn";

interface ToolbarProps {
    filters: any;
    typeFilters: any[];
    showFilter: boolean;
    setShowFilter: (v: boolean) => void;
    viewMode: string;
    setViewMode: (v: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ filters, typeFilters, showFilter, setShowFilter, viewMode, setViewMode }) => (
    <div className="flex flex-wrap items-center gap-2 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(var(--text),0.35)] pointer-events-none" />
            <input
                value={filters.search}
                onChange={(e) => filters.setSearch(e.target.value)}
                placeholder="Search files…"
                className="w-full pl-9 pr-8 py-2 rounded-lg text-sm
          border border-[rgba(var(--border-rgb),0.5)]
          bg-[rgb(var(--card))] text-[rgb(var(--text))]
          outline-none placeholder:text-[rgba(var(--text),0.3)]
          focus:border-[rgba(var(--primary),0.5)]
          focus:ring-2 focus:ring-[rgba(var(--primary),0.08)]
          transition-all duration-150"
            />
            {filters.search && (
                <button onClick={() => filters.setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2
            text-[rgba(var(--text),0.35)] hover:text-[rgba(var(--text),0.7)] transition-colors">
                    <X size={13} />
                </button>
            )}
        </div>
        {/* Type pills */}
        <div className="flex gap-1.5 flex-wrap">
            {typeFilters.map(({ key, label, icon }) => (
                <TypePill key={key} label={label} icon={icon}
                    active={filters.typeFilter === key}
                    onClick={() => filters.setTypeFilter(key)} />
            ))}
        </div>
        {/* Right side */}
        <div className="flex items-center gap-1.5 ml-auto">
            <IconBtn icon={SlidersHorizontal} title="Filters"
                active={showFilter} onClick={() => setShowFilter(!showFilter)} />
            <div className="w-px h-5 bg-[rgba(var(--border-rgb),0.5)]" />
            <IconBtn icon={List} title="List"
                active={viewMode === "list"} onClick={() => setViewMode("list")} />
            <IconBtn icon={LayoutGrid} title="Grid"
                active={viewMode === "grid"} onClick={() => setViewMode("grid")} />
        </div>
    </div>
);

export default Toolbar;
