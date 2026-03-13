// src/pages/Dashboard.tsx
import { useRef } from 'react';
import { useFiles } from '@/hooks/files/queries/useFiles';
import { useFileActions } from '@/hooks/files/mutations/useFileActions';

// UI Components
import DashboardToolbar from '@/components/ui/dashboard/DashboardToolbar';
import DashboardSidebar from '@/components/ui/dashboard/DashboardSidebar';
import DashboardStats from '@/components/ui/dashboard/stats/DashboardStats';
import DashboardMain from '@/components/ui/dashboard/DashboardMain';
import UploadModal from '@/components/ui/modals/UploadModal';

const Dashboard = () => {
  // 1. Hook for Data, Loading States, and UI Filters
  const {
    files,           // This is the filtered/sorted array
    allFiles,        // This is the raw array for total count
    storage,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    viewMode,
    setViewMode,
    showFilter,
    setShowFilter,
    filters          // Object containing: search, setSearch, typeFilter, setTypeFilter, sortBy, setSortBy
  } = useFiles();

  // 2. Hook for mutations and side effects
  const { 
    deleteFile, 
    downloadFile 
  } = useFileActions();

  // 3. Local Ref for the filter dropdown positioning/outside-click logic
  const filterRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen mt-4 bg-[rgb(var(--background))] text-[rgb(var(--text))] transition-colors duration-300 relative">
      <div className=" mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Toolbar: Handles searching, sorting, and view toggles */}
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

        {/* Stats: Shows storage bar and file counts */}
        <DashboardStats
          totalFiles={allFiles.length}
          filteredFilesCount={files.length}
          storage={storage}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: The File Grid/List */}
          <div className="flex-1">
            <DashboardMain
              files={files}
              isLoading={isLoading}
              viewMode={viewMode}
              deleteFile={deleteFile}
              downloadFile={downloadFile}
            />
          </div>

          {/* Sidebar: Additional info or navigation */}
          <aside className="lg:w-80">
            <DashboardSidebar />
          </aside>
        </div>
      </div>

      {/* Upload Modal: Controlled by the isModalOpen state from useFiles */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;