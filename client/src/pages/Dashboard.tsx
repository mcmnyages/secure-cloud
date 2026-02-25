import { useMemo, useState, useRef, useEffect } from 'react'
import { useDashboard } from '@/hooks/files/useDashboard'
import UploadModal from '@/components/ui/modals/UploadModal'
import { DashboardHeader, StorageCard } from '@/components/ui/dashboard'
import DashboardToolbar from '@/components/ui/dashboard/DashboardToolbar'
import QuickStat from '@/components/ui/dashboard/QuickStat'
import FileListItem from '@/components/ui/dashboard/FileListItem'
import FileGridItem from '@/components/ui/dashboard/FileGridItem'
import { File, Search } from 'lucide-react'
import { formatFileSize } from '@/utils/helpers/files/fileUtils'
import DashboardSidebar from '@/components/ui/dashboard/DashboardSidebar'
import FloatingUploadButton from '@/components/ui/buttons/FloatingUploadButton'
import MobileUpgradeBanner from '@/components/ui/dashboard/MobileUpgradeBanner'
import { OverlayLoader } from '@/components/ui/spinners'

const Dashboard = () => {
  const { 
    files, 
    storage, 
    isModalOpen, 
    setIsModalOpen, 
    deleteFile, 
    downloadFile, 
    isLoading 
  } = useDashboard()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [search, setSearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filterRef = useRef<HTMLDivElement>(null!)

  // Handle clicking outside of filters to close them
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredFiles = useMemo(() => {
    return files
      .filter(file => 
        file.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === 'all' || file.mimeType.includes(typeFilter))
      )
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        if (sortBy === 'size') return b.size - a.size
        return a.name.localeCompare(b.name)
      })
  }, [files, search, typeFilter, sortBy])

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <DashboardHeader />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storage && <StorageCard {...storage} />}
          <QuickStat label="Total Files" value={files.length} icon={<File size={20} />} />
          <QuickStat label="Search Matches" value={filteredFiles.length} icon={<Search size={20} />} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <DashboardToolbar
              search={search}
              setSearch={setSearch}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              filterRef={filterRef}
              sortBy={sortBy}
              setSortBy={setSortBy}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter} 
              // FIX: Connect the modal trigger here
              openUploadModal={() => setIsModalOpen(true)} 
            />

            {isLoading ? (
              <OverlayLoader label='Loading Dashboard Elements...' />
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-20 bg-[rgb(var(--card))] rounded-3xl border border-dashed border-[rgb(var(--border))]">
                <Search size={40} className="mx-auto mb-4 opacity-20" />
                <p className="text-[rgb(var(--text)/0.6)] font-medium">No files match your current filters.</p>
              </div>
            ) : (
              <div className="transition-all duration-300">
                {viewMode === 'list' ? (
                  <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-[rgb(var(--border))]">
                      {filteredFiles.map(file => (
                        <FileListItem
                          key={file.id}
                          file={file}
                          formatSize={formatFileSize}
                          onDownload={downloadFile}
                          onDelete={deleteFile}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredFiles.map(file => (
                      <FileGridItem
                        key={file.id}
                        file={file}
                        onDownload={downloadFile}
                        onDelete={deleteFile}
                        formatSize={formatFileSize}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <DashboardSidebar />
          </aside>
        </div>
      </div>

      {/* NOTE: Since DashboardToolbar now has a built-in FAB logic 
         from our previous step, you might not need FloatingUploadButton anymore.
         If you want to keep the standalone one, ensure it also uses setIsModalOpen(true).
      */}

      {/* <MobileUpgradeBanner /> */}

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default Dashboard