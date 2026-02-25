import { useState, useRef } from 'react'
import UploadModal from '@/components/ui/modals/UploadModal'
import { useDashboard } from '@/hooks/files/useDashboard'
import { useFileMutations } from '@/hooks/files/useFileMutations'
import { formatFileSize, formatDate } from '@/utils/helpers/files/fileUtils'

const Files = () => {
  const {
    files,
    isModalOpen,
    setIsModalOpen,
    deleteFile,
    downloadFile,
    bulkDeleteFiles,
    isLoading,
  } = useDashboard()

  const { renameFile, uploadNewVersion } = useFileMutations()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [uploadingVersionFor, setUploadingVersionFor] = useState<string | null>(null)

  // ✅ Only ONE ref
  const versionInputRef = useRef<HTMLInputElement>(null)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const handleRename = (id: string) => {
    if (!newName.trim()) return
    renameFile.mutate({ id, newName })
    setRenamingId(null)
  }

  const handleVersionUploadClick = (id: string) => {
    setUploadingVersionFor(id)
    versionInputRef.current?.click()
  }

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadingVersionFor) return
    if (!e.target.files?.[0]) return

    uploadNewVersion.mutate({
      id: uploadingVersionFor,
      file: e.target.files[0],
    })

    setUploadingVersionFor(null)
    e.target.value = '' // reset input
  }

  return (
    <div className='mt-20'>

      <h1>Files</h1>

      <button onClick={() => setIsModalOpen(true)}>
        Upload
      </button>

      {selectedIds.length > 0 && (
        <div>
          <p>{selectedIds.length} selected</p>
          <button
            onClick={() => {
              bulkDeleteFiles.mutate(selectedIds)
              setSelectedIds([])
            }}
          >
            Delete Selected
          </button>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {!isLoading && files.length === 0 && (
        <p>No files uploaded yet.</p>
      )}

      {!isLoading && files.map(file => {
        const isSelected = selectedIds.includes(file.id)

        return (
          <div key={file.id}>

            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelect(file.id)}
            />

            {renamingId === file.id ? (
              <input
                value={newName}
                autoFocus
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleRename(file.id)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleRename(file.id)
                }
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setRenamingId(file.id)
                  setNewName(file.name)
                }}
              >
                {file.name}
              </span>
            )}

            <div>
              <p>Size: {formatFileSize(file.size)}</p>
              <p>Uploaded: {formatDate(file.createdAt)}</p>
            </div>

            <button onClick={() => downloadFile(file.id, file.name)}>
              Download
            </button>

            <button onClick={() => handleVersionUploadClick(file.id)}>
              Upload New Version
            </button>

            <button onClick={() => deleteFile.mutate(file.id)}>
              Delete
            </button>

            <hr />

          </div>
        )
      })}

      {/* Single hidden file input */}
      <input
        type="file"
        hidden
        ref={versionInputRef}
        onChange={handleVersionChange}
      />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  )
}

export default Files