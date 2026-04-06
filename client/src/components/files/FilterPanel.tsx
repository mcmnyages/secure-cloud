import React from "react";
import { RotateCcw } from "lucide-react";

interface FilterPanelProps {
    filters: any;
    inputCls: string;
    hasActiveFilters: boolean;
    setSelectedIds: (ids: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, inputCls, hasActiveFilters, setSelectedIds }) => (
    <div className="mb-5 p-4 rounded-xl border border-[rgba(var(--border-rgb),0.5)]
    bg-[rgb(var(--card))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-fadeIn">
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
                Extension
            </label>
            <input className={inputCls} type="text" placeholder="pdf, png…"
                value={filters.extension}
                onChange={(e) => filters.setExtension(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
                Min size
            </label>
            <input className={inputCls} type="number" placeholder="bytes"
                onChange={(e) => filters.setMinSize(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
                Max size
            </label>
            <input className={inputCls} type="number" placeholder="bytes"
                onChange={(e) => filters.setMaxSize(Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
                From
            </label>
            <input className={inputCls} type="date" value={filters.dateFrom}
                onChange={(e) => filters.setDateFrom(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
                To
            </label>
            <input className={inputCls} type="date" value={filters.dateTo}
                onChange={(e) => filters.setDateTo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
                Sort
            </label>
            <div className="flex flex-col gap-2">
                <select className={inputCls} value={filters.sortBy}
                    onChange={(e) => filters.setSortBy(e.target.value as "newest" | "size" | "name")}>
                    <option value="newest">Newest</option>
                    <option value="size">Largest</option>
                    <option value="name">Name A–Z</option>
                </select>
                <button
                    disabled={!hasActiveFilters}
                    onClick={() => { filters.resetFilters(); setSelectedIds([]); }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2
            rounded-lg text-xs font-medium
            border border-[rgba(var(--danger),0.35)] text-[rgb(var(--danger))]
            hover:bg-[rgba(var(--danger),0.08)]
            disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <RotateCcw size={11} /> Reset
                </button>
            </div>
        </div>
    </div>
);

export default FilterPanel;
