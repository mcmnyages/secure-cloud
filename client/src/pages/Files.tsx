// client/src/components/dashboard/Files.tsx
import { useState, useRef } from 'react'
import UploadModal from '@/components/ui/modals/UploadModal'
import { useDashboard } from '@/hooks/files/useDashboard'
import { useFileMutations } from '@/hooks/files/useFileMutations'
import { formatFileSize, formatDate } from '@/utils/helpers/files/fileUtils'

const Files = () => {
  const {
    files,
    isLoading,
    deleteFile,
    bulkDeleteFiles,
    downloadFile,
    isModalOpen,
    setIsModalOpen
  } = useDashboard()

  const { renameFile, uploadNewVersion } = useFileMutations()

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
    e.target.value = ''
  }

  return (
    <div className='mt-20'>
      <h1 className='text-2xl font-bold mb-4'>Files</h1>

      <button className='px-4 py-2 bg-blue-600 text-white rounded' onClick={() => setIsModalOpen(true)}>
        Upload
      </button>

      {selectedIds.length > 0 && (
        <div className='mt-4'>
          <p>{selectedIds.length} selected</p>
          <button
            className='px-4 py-2 bg-red-600 text-white rounded'
            onClick={() => {
              bulkDeleteFiles.mutate(selectedIds)
              setSelectedIds([])
            }}
          >
            Delete Selected
          </button>
        </div>
      )}

      {isLoading && <p className='mt-4'>Loading...</p>}

      {!isLoading && files.length === 0 && <p className='mt-4'>No files uploaded yet.</p>}

      {!isLoading &&
        files.map(file => {
          const isSelected = selectedIds.includes(file.id)
          const version = file.currentVersion

          return (
            <div key={file.id} className='mt-4 p-4 border rounded'>
              <div className='flex items-center space-x-2'>
                <input type='checkbox' checked={isSelected} onChange={() => toggleSelect(file.id)} />

                {renamingId === file.id ? (
                  <input
                    className='border px-2 py-1 rounded'
                    value={newName}
                    autoFocus
                    onChange={e => setNewName(e.target.value)}
                    onBlur={() => handleRename(file.id)}
                    onKeyDown={e => e.key === 'Enter' && handleRename(file.id)}
                  />
                ) : (
                  <span
                    className='font-medium cursor-pointer'
                    onDoubleClick={() => {
                      setRenamingId(file.id)
                      setNewName(version.name)
                    }}
                  >
                    {version.name}
                  </span>
                )}
              </div>

              <div className='mt-2 text-sm text-gray-600'>
                <p>Size: {formatFileSize(version.size)}</p>
                <p>Uploaded: {formatDate(version.createdAt)}</p>
                <p>Version: v{version.versionNumber}</p>
              </div>

              <div className='mt-2 flex space-x-2'>
                <button className='px-3 py-1 bg-green-600 text-white rounded' onClick={() => downloadFile(file.id, version.name)}>
                  Download
                </button>
                <button className='px-3 py-1 bg-blue-600 text-white rounded' onClick={() => handleVersionUploadClick(file.id)}>
                  Upload New Version
                </button>
                <button className='px-3 py-1 bg-red-600 text-white rounded' onClick={() => deleteFile.mutate(file.id)}>
                  Delete
                </button>
              </div>
            </div>
          )
        })}

      <input type='file' hidden ref={versionInputRef} onChange={handleVersionChange} />

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Files