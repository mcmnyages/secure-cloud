// client/src/components/dashboard/Files.tsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom' // Import navigate
import UploadModal from '@/components/ui/modals/UploadModal'
import { useFiles } from '@/hooks/files/queries/useFiles'
import { useFileActions } from '@/hooks/files/mutations/useFileActions'
import { formatFileSize, formatDate } from '@/utils/helpers/files/fileUtils'
import { LogoSpinner } from '@/components/ui/spinners'

const Files = () => {
  const navigate = useNavigate();
  const { files, isLoading, isModalOpen, setIsModalOpen } = useFiles()

  const {
    deleteFile,
    bulkDeleteFiles,
    downloadFile,
    renameFile,
    uploadNewVersion
  } = useFileActions()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [uploadingVersionFor, setUploadingVersionFor] = useState<string | null>(null)
  
  const versionInputRef = useRef<HTMLInputElement>(null)

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Don't navigate when checking the box
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleRename = (id: string) => {
    if (!newName.trim()) return
    renameFile({ id, name: newName })
    setRenamingId(null)
  }

  const handleVersionUploadClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    setUploadingVersionFor(id)
    versionInputRef.current?.click()
  }

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadingVersionFor || !e.target.files?.[0]) return
    uploadNewVersion({ id: uploadingVersionFor, file: e.target.files[0] })
    setUploadingVersionFor(null)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen mt-16 bg-[rgb(var(--background))] text-[rgb(var(--text))] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">File Management</h1>

        <div className="flex items-center gap-4 mb-8">
          <button
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            onClick={() => setIsModalOpen(true)}
          >
            Upload New
          </button>

          {selectedIds.length > 0 && (
            <button
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
              onClick={() => {
                bulkDeleteFiles(selectedIds)
                setSelectedIds([])
              }}
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20 font-medium opacity-70 animate-pulse text-lg">
            <LogoSpinner size={120}  src='/favicon.ico' spinLogo={true}/>
          </div>
        )}

        <div className="grid gap-4">
          {!isLoading && files.map(file => {
            const isSelected = selectedIds.includes(file.id)
            const version = file.currentVersion

            return (
              <div
                key={file.id}
                // NAVIGATE TO NEW PAGE ON CLICK
                onClick={() => navigate(`/files/${file.id}/versions`)}
                className={`group p-5 border rounded-xl transition-all duration-200 cursor-pointer
                  ${isSelected ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500' : 'border-[rgb(var(--text)/0.1)] bg-[rgb(var(--text)/0.03)] hover:bg-[rgb(var(--text)/0.05)]'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[rgb(var(--text)/0.2)] text-blue-600 focus:ring-blue-500 bg-transparent cursor-pointer"
                    checked={isSelected}
                    onClick={(e) => toggleSelect(e, file.id)}
                    onChange={() => {}} // Handled by onClick
                  />

                  <div className="flex-1">
                    {renamingId === file.id ? (
                      <input
                        className="w-full max-w-md bg-[rgb(var(--background))] border-2 border-blue-500 px-3 py-1.5 rounded-lg outline-none text-lg font-semibold"
                        value={newName}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onChange={e => setNewName(e.target.value)}
                        onBlur={() => handleRename(file.id)}
                        onKeyDown={e => e.key === 'Enter' && handleRename(file.id)}
                      />
                    ) : (
                      <span
                        className="text-lg font-semibold hover:text-blue-500 transition-colors block truncate"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(file.id)
                          setNewName(version.name)
                        }}
                      >
                        {version.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[rgb(var(--text)/0.6)] ml-9">
                   <span>Size: {formatFileSize(version.size)}</span>
                   <span>Version: v{version.versionNumber}</span>
                   <span>Added: {formatDate(file.createdAt)}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 ml-9">
                  <button
                    className="px-4 py-1.5 rounded-md bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 font-medium transition-colors"
                    onClick={(e) => { e.stopPropagation(); downloadFile(file.id, version.name); }}
                  >
                    Download
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-md bg-[rgb(var(--text)/0.05)] text-[rgb(var(--text)/0.8)] hover:bg-[rgb(var(--text)/0.1)] font-medium transition-colors"
                    onClick={(e) => handleVersionUploadClick(e, file.id)}
                  >
                    New Version
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors"
                    onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <input type="file" hidden ref={versionInputRef} onChange={handleVersionChange} />
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Files