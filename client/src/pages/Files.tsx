import UploadModal from '../components/UploadModal'
import { useDashboard } from '../hooks/files/useDashboard'
import { FilesTable } from '../components/dashboard'

const Files = () => {
  const {
    files,
    isModalOpen,
    setIsModalOpen,
    refresh,
    deleteFile,
    downloadFile,
  } = useDashboard()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Files</h1>
      </div>

      {/* Files table */}
      <FilesTable
        files={files.map(file => ({
          ...file,
          mimeType: file.mimeType ?? '', // Provide a default or map as needed
        }))}
        onDelete={deleteFile}
        onDownload={downloadFile}
        onUpload={() => setIsModalOpen(true)}
      />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={refresh}
      />
    </div>
  )
}

export default Files
