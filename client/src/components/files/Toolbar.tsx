import React from "react";
import { Search, X, SlidersHorizontal, List, LayoutGrid } from "lucide-react";
import TypePill from "./TypePill";
import IconBtn from "./IconBtn";

interface ToolbarProps {
  filters: any;
  typeFilters: any[];
  showFilter: boolean;
  setShowFilter: (v: boolean) => void;
  viewMode: "list" | "grid";
  setViewMode: (v: "list" | "grid") => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  filters, 
  typeFilters, 
  showFilter, 
  setShowFilter, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Top Row: Search & View Controls */}
      <div className="flex items-center gap-3 w-full">
        {/* Search Input - Expands on Desktop, remains functional on Mobile */}
        <div className="relative flex-1 group">
          <Search 
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(var(--text),0.3)] 
            group-focus-within:text-[rgb(var(--primary))] transition-colors pointer-events-none" 
          />
          <input
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium
              border border-[rgba(var(--border-rgb),0.5)]
              bg-[rgb(var(--card))] text-[rgb(var(--text))]
              outline-none placeholder:text-[rgba(var(--text),0.3)]
              focus:border-[rgba(var(--primary),0.6)]
              focus:ring-4 focus:ring-[rgba(var(--primary),0.06)]
              transition-all duration-200"
          />
          {filters.search && (
            <button 
              onClick={() => filters.setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md
                text-[rgba(var(--text),0.3)] hover:text-[rgb(var(--danger))] 
                hover:bg-[rgba(var(--danger),0.05)] transition-all"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Action Group: View Toggles & Filters */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-[rgba(var(--text),0.03)] border border-[rgba(var(--border-rgb),0.3)]">
          <IconBtn 
            icon={SlidersHorizontal} 
            title="Filters"
            isActive={showFilter} 
            onClick={() => setShowFilter(!showFilter)} 
          />
          <div className="w-px h-4 bg-[rgba(var(--border-rgb),0.4)] mx-0.5" />
          <IconBtn 
            icon={List} 
            title="List View"
            isActive={viewMode === "list"} 
            onClick={() => setViewMode("list")} 
          />
          <IconBtn 
            icon={LayoutGrid} 
            title="Grid View"
            isActive={viewMode === "grid"} 
            onClick={() => setViewMode("grid")} 
          />
        </div>
      </div>

      {/* Bottom Row: Type Pills - Scrollable on Mobile, Wrapped on Desktop */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar sm:flex-wrap">
        {typeFilters.map(({ key, label, icon }) => (
          <TypePill 
            key={key} 
            label={label} 
            icon={icon}
            active={filters.typeFilter === key}
            onClick={() => filters.setTypeFilter(key)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;