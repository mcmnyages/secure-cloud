import { Search, X, Sliders, List, LayoutGrid, Plus, Filter, ChevronDown } from 'lucide-react'
import ViewButton from './ViewButton'
import FilterSection from './FilterSection'

interface DashboardToolbarProps {
  search: string
  setSearch: (val: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (val: 'grid' | 'list') => void
  showFilter: boolean
  setShowFilter: (val: boolean) => void
  filterRef: React.RefObject<HTMLDivElement>
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

  // Shared Filter UI to avoid repetition
  const FilterContent = () => (
    <>
      <FilterSection label="Sort Order">
        <div className="relative">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 md:p-2.5 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-sm outline-none appearance-none font-medium cursor-pointer"
          >
            <option value="newest">Newest Uploads</option>
            <option value="name">Alphabetical (A-Z)</option>
            <option value="size">File Size (Large)</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>
      </FilterSection>

      <FilterSection label="File Category">
        <div className="grid grid-cols-2 gap-2">
          {['all', 'image', 'video', 'pdf'].map(cat => (
            <button 
              key={cat}
              onClick={() => setTypeFilter(cat)}
              className={`px-3 py-3 md:py-2 rounded-xl text-xs font-bold capitalize transition-all border
                ${typeFilter === cat 
                  ? 'bg-[rgb(var(--primary))] text-white border-[rgb(var(--primary))] shadow-md' 
                  : 'bg-[rgb(var(--background))] border-[rgb(var(--border))] hover:bg-[rgb(var(--muted)/0.3)]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  )

  return (
    <div className="relative z-30">
      <div className="flex items-center gap-2 md:gap-6 bg-[rgb(var(--card))] border border-[rgb(var(--border))] p-2 md:p-4 rounded-2xl shadow-sm">
        
        {/* 1. Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text)/0.3)] group-focus-within:text-[rgb(var(--primary))]" size={20} />
          <input
            type="text"
            placeholder="Search your library..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 md:py-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl focus:ring-4 focus:ring-[rgb(var(--primary)/0.15)] focus:border-[rgb(var(--primary))] outline-none transition-all text-sm md:text-base font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[rgb(var(--text)/0.4)]">
              <X size={16} />
            </button>
          )}
        </div>

        {/* 2. Desktop Controls */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl p-1 shadow-inner">
            <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={<List size={18} />} />
            <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={<LayoutGrid size={18} />} />
          </div>

          <div className="h-8 w-px bg-[rgb(var(--border))]" />

          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition-all
                ${showFilter ? 'bg-[rgb(var(--primary))] text-white shadow-lg' : 'bg-[rgb(var(--background))] border-[rgb(var(--border))]'}`}
            >
              <Sliders size={18} />
              <span>Filter</span>
              <ChevronDown size={14} className={showFilter ? 'rotate-180' : ''} />
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-3 w-80 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl z-50 p-5 space-y-5 animate-in fade-in zoom-in-95 origin-top-right">
                <FilterContent />
              </div>
            )}
          </div>
        </div>

        {/* 3. Upload Button */}
        <button 
          onClick={openUploadModal}
          className="hidden md:flex items-center gap-2 px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg font-bold"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Upload</span>
        </button>

        {/* Mobile Filter Trigger */}
        <button 
          onClick={() => setShowFilter(true)}
          className="lg:hidden p-3 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--text)/0.7)]"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* FAB for Mobile */}
      <button 
        onClick={openUploadModal}
        className="fixed bottom-8 right-8 z-40 md:hidden w-16 h-16 bg-[rgb(var(--primary))] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* Mobile Bottom Sheet */}
      {showFilter && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilter(false)} />
          <div className="relative w-full bg-[rgb(var(--card))] rounded-t-[32px] p-6 pb-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-[rgb(var(--muted)/0.3)] rounded-full mx-auto mb-6" />
            
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold">Filter Assets</h2>
                 <button onClick={() => setShowFilter(false)} className="p-2 bg-[rgb(var(--background))] rounded-full">
                    <X size={20} />
                 </button>
               </div>

               {/* RE-INSERTED INPUTS HERE */}
               <FilterContent />

               <button 
                onClick={() => setShowFilter(false)}
                className="w-full py-4 bg-[rgb(var(--primary))] text-white rounded-2xl font-bold text-lg shadow-lg"
               >
                 Show Results
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardToolbar