import React from 'react';
import { Search, X, SlidersHorizontal, List, LayoutGrid, Plus, Command } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardToolbarProps {
  search: string; setSearch: (val: string) => void;
  viewMode: 'grid' | 'list'; setViewMode: (val: 'grid' | 'list') => void;
  showFilter: boolean; setShowFilter: (val: boolean) => void;
  filterRef: React.RefObject<HTMLDivElement | null>;
  sortBy: string; setSortBy: (val: string) => void;
  typeFilter: string; setTypeFilter: (val: string) => void;
  openUploadModal: () => void;
}

const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  search, setSearch, viewMode, setViewMode,
  showFilter, setShowFilter, filterRef,
  sortBy, setSortBy, typeFilter, setTypeFilter,
  openUploadModal
}) => {
  const isFiltering = typeFilter !== 'all' || sortBy !== 'newest';

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' },
    { id: 'pdf', label: 'Documents' }
  ];

  return (
    <div className="w-full space-y-4 py-2">
      {/* Main Toolbar */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
        
        {/* 1. Search: Fixed-width for "Pro" feel, avoids stretching */}
        <div className="relative w-full md:w-[280px] group order-2 md:order-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search 
              size={15} 
              className="text-[rgb(var(--text)/0.3)] group-focus-within:text-[rgb(var(--primary))] transition-colors" 
            />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full h-10 pl-10 pr-12 bg-[rgb(var(--background)/0.5)] border border-[rgb(var(--border)/0.6)] rounded-full text-sm outline-none transition-all focus:bg-[rgb(var(--card))] focus:border-[rgb(var(--primary))] focus:ring-4 focus:ring-[rgb(var(--primary)/0.05)] placeholder:text-[rgb(var(--text)/0.3)]"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            {search ? (
              <button 
                onClick={() => setSearch('')} 
                className="p-1 hover:bg-[rgb(var(--text)/0.05)] rounded-full text-[rgb(var(--text)/0.4)]"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded border border-[rgb(var(--border)/0.4)] bg-[rgb(var(--card))] text-[9px] text-[rgb(var(--text)/0.4)] font-medium">
                <Command size={9} /> F
              </kbd>
            )}
          </div>
        </div>

        {/* 2. Actions Group */}
        <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
          
          {/* Segmented View Switcher */}
          <div className="flex items-center bg-[rgb(var(--border)/0.2)] p-1 rounded-full border border-[rgb(var(--border)/0.3)]">
            {(['list', 'grid'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`relative p-1.5 rounded-full transition-all duration-300 ${
                  viewMode === mode 
                    ? 'bg-[rgb(var(--card))] text-[rgb(var(--primary))] shadow-sm' 
                    : 'text-[rgb(var(--text)/0.4)] hover:text-[rgb(var(--text)/0.6)]'
                }`}
              >
                {mode === 'list' ? <List size={16} /> : <LayoutGrid size={16} />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Trigger */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`h-10 px-4 rounded-full flex items-center gap-2 text-[13px] font-semibold transition-all border shadow-sm
                  ${showFilter 
                    ? 'bg-[rgb(var(--text))] text-[rgb(var(--card))] border-transparent' 
                    : 'bg-[rgb(var(--card))] border-[rgb(var(--border))] text-[rgb(var(--text)/0.8)] hover:border-[rgb(var(--primary)/0.4)]'}`}
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:block">Filters</span>
                {isFiltering && (
                  <span className="w-1.5 h-1.5 bg-[rgb(var(--primary))] rounded-full ring-2 ring-[rgb(var(--card))]" />
                )}
              </button>

              <AnimatePresence>
                {showFilter && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl z-50 p-3"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--text)/0.4)]">Refine By</span>
                      {isFiltering && (
                        <button onClick={() => {setTypeFilter('all'); setSortBy('newest')}} className="text-[10px] font-bold text-[rgb(var(--primary))] hover:underline">Reset</button>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setTypeFilter(cat.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors
                            ${typeFilter === cat.id 
                              ? 'bg-[rgb(var(--primary)/0.08)] text-[rgb(var(--primary))]' 
                              : 'text-[rgb(var(--text)/0.6)] hover:bg-[rgb(var(--text)/0.03)]'}`}
                        >
                          {cat.label}
                          {typeFilter === cat.id && <div className="w-1 h-1 rounded-full bg-current" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Action */}
            <button
              onClick={openUploadModal}
              className="h-10 pl-3 pr-4 bg-[rgb(var(--primary))] text-[rgb(var(--card))] rounded-full flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[rgb(var(--primary)/0.2)]"
            >
              <div className="bg-[rgb(var(--card)/0.2)] p-0.5 rounded-md">
                <Plus size={16} strokeWidth={3} />
              </div>
              <span className="text-[13px] font-bold">New Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Filter Tags Area (Only visible when filtering) */}
      <AnimatePresence>
        {isFiltering && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap items-center gap-2 pt-1 overflow-hidden"
          >
            <span className="text-[10px] font-bold text-[rgb(var(--text)/0.3)] uppercase tracking-tight mr-1">Active:</span>
            {typeFilter !== 'all' && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[rgb(var(--card))] border border-[rgb(var(--border)/0.5)] text-[rgb(var(--text)/0.7)] rounded-full text-[11px] font-medium shadow-sm">
                <span className="capitalize">{typeFilter}</span>
                <button onClick={() => setTypeFilter('all')} className="hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardToolbar;