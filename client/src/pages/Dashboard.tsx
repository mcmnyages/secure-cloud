import UploadModal from '../components/UploadModal'
import { useDashboard } from '../hooks/files/useDashboard'
import {
  DashboardHeader,
  StorageCard,
  FilesTable,
} from '../components/dashboard'

const Dashboard = () => {
  const {
    files,
    storage,
    isModalOpen,
    setIsModalOpen,
    refresh,
    deleteFile,
    downloadFile,
    isLoading,
  } = useDashboard()

  const isEmpty = !isLoading && files.length === 0
  const storagePercentage =
    storage.limit > 0 ? (storage.used / storage.limit) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 text-[rgb(var(--text))]">

      {/* Header */}
      <DashboardHeader onUpload={() => setIsModalOpen(true)} />

      {/* Summary Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StorageCard {...storage} />

        <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow p-6">
          <h3 className="text-sm text-[rgb(var(--text)/0.6)] mb-1">
            Total files
          </h3>
          <p className="text-2xl font-bold">
            {files.length}
          </p>
        </div>

        <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow p-6">
          <h3 className="text-sm text-[rgb(var(--text)/0.6)] mb-1">
            Last upload
          </h3>
          <p className="text-sm text-[rgb(var(--text)/0.8)]">
            {files[0]?.createdAt
              ? new Date(files[0].createdAt).toLocaleDateString()
              : '—'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Files */}
        <div className="lg:col-span-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow">

          <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--border))]">
            <h2 className="font-semibold text-lg">
              Your files
            </h2>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[rgb(var(--primary))] text-white px-4 py-2 rounded-lg hover:bg-[rgb(var(--primary)/0.85)] transition-all active:scale-95"
            >
              Upload file
            </button>
          </div>

          {isLoading && (
            <div className="p-6 text-[rgb(var(--text)/0.6)]">
              Loading files…
            </div>
          )}

          {isEmpty && (
            <div className="p-12 text-center text-[rgb(var(--text)/0.6)]">
              <p className="mb-4">No files yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[rgb(var(--primary))] font-medium hover:underline"
              >
                Upload your first file
              </button>
            </div>
          )}

          {!isLoading && !isEmpty && (
            <FilesTable
              files={files}
              onDelete={deleteFile}
              onDownload={downloadFile}
              onUpload={() => setIsModalOpen(true)}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">

          <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow p-6">
            <h3 className="font-medium mb-2">
              Quick actions
            </h3>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] py-2 rounded-lg hover:bg-[rgb(var(--primary)/0.2)] transition"
            >
              Upload new file
            </button>
          </div>

          {storagePercentage > 80 && (
            <div className="bg-[rgb(var(--primary)/0.08)] border border-[rgb(var(--primary)/0.3)] rounded-xl p-4 text-sm text-[rgb(var(--primary))]">
              You’re running out of storage. Consider deleting unused files.
            </div>
          )}

        </aside>
      </section>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={refresh}
      />
    </div>
  )
}

export default Dashboard
