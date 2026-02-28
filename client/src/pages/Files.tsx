// client/src/components/dashboard/Files.tsx
import { useState, useRef } from 'react'
import UploadModal from '@/components/ui/modals/UploadModal'
import { useFiles } from '@/hooks/files/queris/useFiles'
import { useFileActions } from '@/hooks/files/mutations/useFileActions'
import { formatFileSize, formatDate } from '@/utils/helpers/files/fileUtils'

const Files = () => {
  const {
    files,
    isLoading,
    isModalOpen,
    setIsModalOpen
  } = useFiles()

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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleRename = (id: string) => {
    if (!newName.trim()) return
    renameFile({ id, name: newName })
    setRenamingId(null)
  }

  const handleVersionUploadClick = (id: string) => {
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
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all animate-in fade-in slide-in-from-left-2"
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
          <div className="flex justify-center py-20">
            <p className="animate-pulse text-lg opacity-70">Loading your cloud storage...</p>
          </div>
        )}

        {!isLoading && files.length === 0 && (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-[rgb(var(--text)/0.1)] bg-[rgb(var(--text)/0.02)]">
            <p className="text-[rgb(var(--text)/0.5)]">No files found matching your criteria.</p>
          </div>
        )}

        <div className="grid gap-4">
          {!isLoading && files.map(file => {
            const isSelected = selectedIds.includes(file.id)
            const version = file.currentVersion

            return (
              <div 
                key={file.id} 
                className={`group p-5 border rounded-xl transition-all duration-200 
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500' 
                    : 'border-[rgb(var(--text)/0.1)] bg-[rgb(var(--text)/0.03)] hover:bg-[rgb(var(--text)/0.05)]'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-[rgb(var(--text)/0.2)] text-blue-600 focus:ring-blue-500 bg-transparent cursor-pointer"
                    checked={isSelected} 
                    onChange={() => toggleSelect(file.id)} 
                  />

                  <div className="flex-1">
                    {renamingId === file.id ? (
                      <input
                        className="w-full max-w-md bg-[rgb(var(--background))] border-2 border-blue-500 px-3 py-1.5 rounded-lg outline-none text-lg font-semibold"
                        value={newName}
                        autoFocus
                        onChange={e => setNewName(e.target.value)}
                        onBlur={() => handleRename(file.id)}
                        onKeyDown={e => e.key === 'Enter' && handleRename(file.id)}
                      />
                    ) : (
                      <span
                        className="text-lg font-semibold cursor-pointer hover:text-blue-500 transition-colors block truncate"
                        onDoubleClick={() => {
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
                  <div className="flex items-center gap-1">
                    <span className="opacity-50">Size:</span> {formatFileSize(version.size)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-50">Type:</span> {version.mimeType.split('/')[1].toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-50">Version:</span> v{version.versionNumber}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-50">Added:</span> {formatDate(file.createdAt)}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 ml-9">
                  <button 
                    className="px-4 py-1.5 rounded-md bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 font-medium transition-colors" 
                    onClick={() => downloadFile(file.id, version.name)}
                  >
                    Download
                  </button>
                  <button 
                    className="px-4 py-1.5 rounded-md bg-[rgb(var(--text)/0.05)] text-[rgb(var(--text)/0.8)] hover:bg-[rgb(var(--text)/0.1)] font-medium transition-colors" 
                    onClick={() => handleVersionUploadClick(file.id)}
                  >
                    New Version
                  </button>
                  <button 
                    className="px-4 py-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors" 
                    onClick={() => deleteFile(file.id)}
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