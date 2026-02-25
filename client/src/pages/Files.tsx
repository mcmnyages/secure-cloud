import UploadModal from '../components/UploadModal'
import { useDashboard } from '../hooks/files/useDashboard'
import { FilesTable } from '../components/dashboard'
import { LoadingSpinner } from '../components/ui/spinners/LoadingSpinner'

const Files = () => {
  const {
    files,
    isModalOpen,
    setIsModalOpen,
    deleteFile,
    downloadFile,
    isLoading,
    bulkDeleteFiles
  } = useDashboard()

  return (
    <div className="space-y-6 mt-18">

      {/* Page header */}
      {/*  You can replace this with a more complex header if needed */}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="large" />
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
          onBulkDelete={(ids) => bulkDeleteFiles.mutate(ids)}
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