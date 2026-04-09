import { Search, X, Sliders, List, LayoutGrid, Plus, Filter, ChevronDown, Command } from 'lucide-react'
import ViewButton from './ViewButton'
import FilterSection from './FilterSection'
import Dropdown from './dropdowns/FilterOptionsDropdown'
import { AnimatePresence } from 'framer-motion'

interface DashboardToolbarProps {
  search: string
  setSearch: (val: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (val: 'grid' | 'list') => void
  showFilter: boolean
  setShowFilter: (val: boolean) => void
  filterRef: React.RefObject<HTMLDivElement | null>
  sortBy: string
  setSortBy: (val: string) => void
  typeFilter: string
  setTypeFilter: (val: string) => void
  openUploadModal: () => void
}

const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  search, setSearch, viewMode, setViewMode,
  showFilter, setShowFilter, filterRef,
  sortBy, setSortBy, typeFilter, setTypeFilter,
  openUploadModal
}) => {

  const sortOptions = [
    { value: "newest", label: "Recently Added" },
    { value: "name", label: "File Name (A-Z)" },
    { value: "size", label: "File Size" },
  ]

  const categories = [
    { id: 'all', color: 'rgb(var(--text)/0.5)' },
    { id: 'image', color: '#f59e0b' },
    { id: 'video', color: '#3b82f6' },
    { id: 'pdf', color: '#ef4444' }
  ]

  const isFiltering = typeFilter !== 'all' || sortBy !== 'newest';

  const FilterContent = () => (
    <div className="space-y-6">
      <FilterSection label="Sort By">
        <Dropdown
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
        />
      </FilterSection>

      <FilterSection label="Asset Category">
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setTypeFilter(cat.id)}
              className={`relative px-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border overflow-hidden
                ${typeFilter === cat.id
                  ? 'bg-[rgb(var(--primary))] text-white border-transparent shadow-lg'
                  : 'bg-[rgb(var(--background))] border-[rgb(var(--border)/0.6)] text-[rgb(var(--text)/0.6)] hover:border-[rgb(var(--primary)/0.4)]'}`}
            >
              <span className="relative z-10">{cat.id}</span>
              {typeFilter !== cat.id && (
                 <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
              )}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className="relative z-30 space-y-4">
      <div className="flex items-center gap-3 bg-[rgb(var(--card))] border border-[rgb(var(--border)/0.7)] p-2 md:p-3 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">

        {/* 1. Creative Search Bar */}
        <div className="relative flex-1 group min-w-0">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search className={`transition-colors duration-300 ${search ? 'text-[rgb(var(--primary))]' : 'text-[rgb(var(--text)/0.3)]'}`} size={18} />
          </div>
          
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-[rgb(var(--background)/0.5)] border border-transparent rounded-[1.25rem] focus:bg-[rgb(var(--card))] focus:border-[rgb(var(--primary)/0.3)] focus:ring-4 focus:ring-[rgb(var(--primary)/0.08)] outline-none transition-all text-sm font-semibold placeholder:text-[rgb(var(--text)/0.3)]"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {search ? (
              <button onClick={() => setSearch('')} className="p-1.5 hover:bg-[rgb(var(--text)/0.05)] rounded-lg text-[rgb(var(--text)/0.4)] transition-colors">
                <X size={14} />
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-1 px-1.5 py-1 rounded bg-[rgb(var(--text)/0.03)] border border-[rgb(var(--border)/0.5)] text-[10px] font-bold text-[rgb(var(--text)/0.3)]">
                <Command size={10} />
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex bg-[rgb(var(--background)/0.5)] border border-[rgb(var(--border)/0.5)] rounded-2xl p-1 gap-1">
            <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={<List size={18} />} />
            <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={<LayoutGrid size={18} />} />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`relative flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-tighter transition-all
                ${showFilter 
                    ? 'bg-[rgb(var(--primary))] text-white border-transparent shadow-xl' 
                    : 'bg-[rgb(var(--card))] border-[rgb(var(--border))] text-[rgb(var(--text)/0.7)] hover:border-[rgb(var(--primary)/0.4)]'}`}
            >
              <Sliders size={16} strokeWidth={2.5} />
              <span>Filter</span>
              {isFiltering && !showFilter && (
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(var(--primary))] border-2 border-[rgb(var(--card))] rounded-full animate-pulse" />
              )}
              <ChevronDown size={14} className={`transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showFilter && (
                <div className="absolute right-0 mt-4 w-80 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 p-6 animate-in fade-in zoom-in-95 origin-top-right backdrop-blur-2xl">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[rgb(var(--text)/0.4)]">Filter Engine</h3>
                      {(typeFilter !== 'all' || sortBy !== 'newest') && (
                        <button 
                          onClick={() => {setTypeFilter('all'); setSortBy('newest')}}
                          className="text-[10px] font-bold text-[rgb(var(--primary))] hover:underline"
                        >
                          Reset All
                        </button>
                      )}
                   </div>
                  <FilterContent />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Primary Upload */}
        <button
          onClick={openUploadModal}
          className="hidden md:flex items-center gap-2 px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-[1.25rem] hover:shadow-[0_8px_25px_rgb(var(--primary)/0.3)] active:scale-95 transition-all font-black text-xs uppercase tracking-widest"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Upload</span>
        </button>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilter(true)}
          className={`lg:hidden p-3 rounded-xl border transition-all ${isFiltering ? 'bg-[rgb(var(--primary)/0.1)] border-[rgb(var(--primary)/0.3)] text-[rgb(var(--primary))]' : 'bg-[rgb(var(--background))] border-[rgb(var(--border))]'}`}
        >
          <Filter size={20} />
        </button>
      </div>

      {/* --- Mobile UI Remains similar but with refined rounding --- */}
      {/* FAB for Mobile */}
       <button
        onClick={openUploadModal}
        className="fixed bottom-8 right-8 z-40 md:hidden w-16 h-16 bg-[rgb(var(--primary))] text-white rounded-2xl shadow-[0_15px_30px_rgb(var(--primary)/0.4)] flex items-center justify-center active:scale-90 transition-all border-4 border-[rgb(var(--card))]"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* Mobile Bottom Sheet */}
      {showFilter && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowFilter(false)} />
          <div className="relative w-full bg-[rgb(var(--card))] rounded-t-[3rem] border-t border-[rgb(var(--border))] p-8 pb-12 animate-in slide-in-from-bottom duration-500 ease-out">
            <div className="w-16 h-1.5 bg-[rgb(var(--text)/0.05)] rounded-full mx-auto mb-8" />
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Refine Assets</h2>
                <button onClick={() => setShowFilter(false)} className="p-2 bg-[rgb(var(--text)/0.03)] rounded-full text-[rgb(var(--text)/0.4)]">
                  <X size={24} />
                </button>
              </div>
              <FilterContent />
              <button
                onClick={() => setShowFilter(false)}
                className="w-full py-5 bg-[rgb(var(--primary))] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[rgb(var(--primary)/0.2)] active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardToolbar