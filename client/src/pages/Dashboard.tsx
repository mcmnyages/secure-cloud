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
  } = useDashboard()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <DashboardHeader />

      <div className="grid md:grid-cols-3 gap-6">
        <StorageCard {...storage} />

        <FilesTable
          files={files}
          onDelete={deleteFile}
          onDownload={downloadFile}
          onUpload={() => setIsModalOpen(true)}
        />
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={refresh}
      />
    </div>
  )
}

export default Dashboard
