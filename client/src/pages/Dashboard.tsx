import { useRef } from 'react'
import { useFiles } from '@/hooks/files/queries/useFiles'
import { useFileActions } from '@/hooks/files/mutations/useFileActions'

// UI Components
import DashboardToolbar from '@/components/ui/dashboard/DashboardToolbar'
import UpgradeCard from '@/components/ui/dashboard/UpgradeCard'
import DashboardStats from '@/components/ui/dashboard/stats/DashboardStats'
import DashboardMain from '@/components/ui/dashboard/DashboardMain'
import UploadModal from '@/components/ui/modals/UploadModal'

const Dashboard = () => {
  const {
    files,
    allFiles,
    storage,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    viewMode,
    setViewMode,
    showFilter,
    setShowFilter,
    filters
  } = useFiles()

  const { deleteFile, downloadFile } = useFileActions()

  const filterRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* 🔍 Toolbar */}
        <DashboardToolbar
          search={filters.search}
          setSearch={filters.setSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          filterRef={filterRef}
          sortBy={filters.sortBy}
          setSortBy={(val) => filters.setSortBy(val as 'newest' | 'size' | 'name')}
          typeFilter={filters.typeFilter}
          setTypeFilter={(val) => filters.setTypeFilter(val as any)}
          openUploadModal={() => setIsModalOpen(true)}
        />

        {/* 📊 Stats (NOW TOP PRIORITY) */}
        <DashboardStats
          totalFiles={allFiles.length}
          filteredFilesCount={files.length}
          storage={storage}
        />

        {/* 🧱 Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* 📂 Main Content */}
          <div className="min-w-0">
            <DashboardMain
              files={files}
              isLoading={isLoading}
              viewMode={viewMode}
              deleteFile={deleteFile}
              downloadFile={downloadFile}
            />
          </div>

          {/* ⚡ Sidebar */}
          <aside className="space-y-6">
            <UpgradeCard />

            {/* Optional future widgets */}
            {/* <RecentActivity /> */}
            {/* <TipsCard /> */}
          </aside>

        </div>
      </div>

      {/* 📤 Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard