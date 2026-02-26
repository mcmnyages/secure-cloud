import { useState, useMemo, useRef } from 'react'
import { useDashboard } from '@/hooks/files/useDashboard'
import DashboardToolbar from '@/components/ui/dashboard/DashboardToolbar'
import DashboardSidebar from '@/components/ui/dashboard/DashboardSidebar'
import DashboardStats from '@/components/ui/dashboard/stats/DashboardStats'
import DashboardMain from '@/components/ui/dashboard/DashboardMain'
import UploadModal from '@/components/ui/modals/UploadModal'

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

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showFilter, setShowFilter] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document' | 'other'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'size' | 'name'>('newest')
  const filterRef = useRef<HTMLDivElement | null>(null)

  const typeMatches = (file: typeof files[number]) => {
    if (typeFilter === 'all') return true
    const mime = file.currentVersion.mimeType
    if (typeFilter === 'document') return mime.startsWith('application/')
    if (typeFilter === 'other') return !['image', 'video', 'audio', 'application'].some(p => mime.startsWith(p))
    return mime.startsWith(typeFilter)
  }

  const filteredFiles = useMemo(() => {
    return files
      .filter(file => file.currentVersion.name.toLowerCase().includes(search.toLowerCase()) && typeMatches(file))
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'size': return b.currentVersion.size - a.currentVersion.size
          case 'name': return a.currentVersion.name.localeCompare(b.currentVersion.name)
        }
      })
  }, [files, search, typeFilter, sortBy])

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <DashboardToolbar
          search={search}
          setSearch={setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          filterRef={filterRef}
          sortBy={sortBy}
          setSortBy={val => setSortBy(val as 'newest' | 'size' | 'name')}
          typeFilter={typeFilter}
          setTypeFilter={val => setTypeFilter(val as 'all' | 'image' | 'video' | 'audio' | 'document' | 'other')}
          openUploadModal={() => setIsModalOpen(true)}
        />

        <DashboardStats
          totalFiles={files.length}
          filteredFilesCount={filteredFiles.length}
          storage={storage}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <DashboardMain
              files={filteredFiles}
              isLoading={isLoading}
              viewMode={viewMode}
              deleteFile={(id: string) => deleteFile.mutate(id)}
              downloadFile={(id: string, name: string) => downloadFile(id, name)}
            />
          </div>
          <aside className="lg:w-80">
            <DashboardSidebar />
          </aside>
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Dashboard