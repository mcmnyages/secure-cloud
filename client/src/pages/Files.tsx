import UploadModal from '../components/UploadModal'
import { useDashboard } from '../hooks/files/useDashboard'
import { FilesTable } from '../components/dashboard'

const Files = () => {
  const {
    files,
    isModalOpen,
    setIsModalOpen,
    deleteFile,
    downloadFile,
    isLoading,
  } = useDashboard()

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Files</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[rgb(var(--primary))] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Upload
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-[rgb(var(--text)/0.6)]">
          Loading files…
        </div>
      )}

      {/* Files table */}
      {!isLoading && (
        <FilesTable
          files={files.map(file => ({
            ...file,
            mimeType: file.mimeType ?? '',
          }))}
          onDelete={(id) => deleteFile.mutate(id)}
          onDownload={downloadFile}
          onUpload={() => setIsModalOpen(true)}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  )
}

export default Files