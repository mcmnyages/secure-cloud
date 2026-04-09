import React from 'react';
import { Search, X, Sliders, List, LayoutGrid, Plus, ChevronDown, Command } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Component interfaces remain the same for compatibility
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
    { id: 'all', color: 'rgb(var(--text)/0.5)' },
    { id: 'image', color: '#f59e0b' },
    { id: 'video', color: '#3b82f6' },
    { id: 'pdf', color: '#ef4444' }
  ];

  return (
    <div className="relative z-30 w-full space-y-2">
      <div className="flex items-center gap-2 md:gap-4 bg-[rgb(var(--card))] border border-[rgb(var(--border)/0.5)] p-1.5 md:p-2 rounded-2xl shadow-sm transition-all duration-300">
        
        {/* 1. Integrated Search: Scales with container */}
        <div className="relative flex-1 group flex items-center bg-[rgb(var(--background)/0.4)] rounded-xl border border-transparent focus-within:border-[rgb(var(--primary)/0.3)] focus-within:bg-[rgb(var(--card))] transition-all">
          <Search className="ml-3 text-[rgb(var(--text)/0.3)] group-focus-within:text-[rgb(var(--primary))]" size={16} />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-transparent outline-none text-[13px] font-medium placeholder:text-[rgb(var(--text)/0.3)]"
          />
          <div className="flex items-center gap-2 pr-2">
            {search ? (
              <button onClick={() => setSearch('')} className="p-1 hover:bg-[rgb(var(--text)/0.05)] rounded-md">
                <X size={14} className="text-[rgb(var(--text)/0.4)]" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[rgb(var(--border)/0.5)] bg-[rgb(var(--card))] text-[9px] text-[rgb(var(--text)/0.4)]">
                <Command size={9} /> K
              </kbd>
            )}
          </div>
        </div>

        {/* 2. Visual Controls: High Density */}
        <div className="flex items-center gap-1.5 md:gap-3">
          
          {/* View Mode Toggle (Segmented) */}
          <div className="hidden sm:flex items-center bg-[rgb(var(--background)/0.5)] border border-[rgb(var(--border)/0.4)] p-0.5 rounded-lg">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[rgb(var(--card))] text-[rgb(var(--primary))] shadow-sm' : 'text-[rgb(var(--text)/0.4)] hover:text-[rgb(var(--text)/0.6)]'}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[rgb(var(--card))] text-[rgb(var(--primary))] shadow-sm' : 'text-[rgb(var(--text)/0.4)] hover:text-[rgb(var(--text)/0.6)]'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-[rgb(var(--border)/0.4)] hidden sm:block" />

          {/* Filter Dropdown Toggle */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold transition-all border
                ${showFilter 
                    ? 'bg-[rgb(var(--text))] text-[rgb(var(--card))] border-transparent' 
                    : 'bg-[rgb(var(--card))] border-[rgb(var(--border))] text-[rgb(var(--text)/0.8)] hover:border-[rgb(var(--primary)/0.4)]'}`}
            >
              <Sliders size={14} className={isFiltering ? 'text-[rgb(var(--primary))]' : ''} />
              <span className="hidden md:block">Filters</span>
              {isFiltering && !showFilter && <span className="w-1.5 h-1.5 bg-[rgb(var(--primary))] rounded-full" />}
              <ChevronDown size={12} className={`transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showFilter && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 5 }}
                  className="absolute right-0 mt-2 w-64 md:w-72 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-xl z-50 p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[rgb(var(--border)/0.4)]">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[rgb(var(--text)/0.4)]">Preferences</span>
                    {isFiltering && (
                      <button onClick={() => {setTypeFilter('all'); setSortBy('newest')}} className="text-[10px] font-bold text-[rgb(var(--primary))]">Reset</button>
                    )}
                  </div>
                  
                  {/* Category Pill Selectors (Higher scalability) */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[rgb(var(--text)/0.5)] mb-2 block uppercase">Media Type</label>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setTypeFilter(cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border
                              ${typeFilter === cat.id 
                                ? 'bg-[rgb(var(--primary)/0.1)] border-[rgb(var(--primary)/0.4)] text-[rgb(var(--primary))]' 
                                : 'border-[rgb(var(--border)/0.6)] text-[rgb(var(--text)/0.6)] hover:bg-[rgb(var(--text)/0.03)]'}`}
                          >
                            {cat.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Primary Action: Compact on mobile, Full on desktop */}
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--card))] rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[rgb(var(--primary)/0.15)]"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="text-[12px] font-bold hidden sm:block">Upload</span>
          </button>
        </div>
      </div>

      {/* 4. Active Filter Tags (UX Scalability) */}
      {isFiltering && (
        <div className="flex flex-wrap gap-2 px-1">
          {typeFilter !== 'all' && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] rounded-md text-[10px] font-bold border border-[rgb(var(--primary)/0.2)]">
              <span>Type: {typeFilter}</span>
              <button onClick={() => setTypeFilter('all')}><X size={10} /></button>
            </div>
          )}
          {sortBy !== 'newest' && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[rgb(var(--text)/0.05)] text-[rgb(var(--text)/0.6)] rounded-md text-[10px] font-bold border border-[rgb(var(--border)/0.5)]">
              <span>Sort: {sortBy}</span>
              <button onClick={() => setSortBy('newest')}><X size={10} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardToolbar;