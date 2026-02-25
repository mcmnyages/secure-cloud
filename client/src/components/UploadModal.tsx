import { useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { useFileMutations } from '../hooks/files/useFileMutations'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const UploadModal = ({ isOpen, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const { uploadFile } = useFileMutations()

  if (!isOpen) return null

  const handleUpload = () => {
    if (!file) return

    uploadFile.mutate(file, {
      onSuccess: () => {
        setFile(null)
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-[rgb(var(--bg)/0.6)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--text))]">
            Upload File
          </h2>
          <button
            onClick={onClose}
            className="text-[rgb(var(--text)/0.5)] hover:text-[rgb(var(--text))] transition"
          >
            <X />
          </button>
        </div>

        {/* Drop Area */}
        <div
          className="relative border-2 border-dashed border-[rgb(var(--border))]
            rounded-xl p-10 flex flex-col items-center justify-center gap-3
            bg-[rgb(var(--bg))]
            hover:bg-[rgb(var(--bg)/0.7)]
            transition cursor-pointer"
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className="bg-[rgb(var(--primary)/0.1)] p-3 rounded-full text-[rgb(var(--primary))]">
            <Upload size={24} />
          </div>

          <p className="text-sm font-medium text-[rgb(var(--text)/0.8)] text-center">
            {file ? file.name : 'Click to browse or drag and drop'}
          </p>

          <p className="text-xs text-[rgb(var(--text)/0.4)]">
            Max file size: 100MB
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg font-medium
              text-[rgb(var(--text)/0.7)]
              hover:bg-[rgb(var(--bg))]
              transition"
          >
            Cancel
          </button>

          <button
            disabled={!file || uploadFile.isPending}
            onClick={handleUpload}
            className={`flex-1 py-2 rounded-lg font-medium
              flex items-center justify-center gap-2 transition
              ${
                !file || uploadFile.isPending
                  ? 'bg-[rgb(var(--border))] text-[rgb(var(--text)/0.6)] cursor-not-allowed'
                  : 'bg-[rgb(var(--primary))] text-white hover:opacity-90'
              }`}
          >
            {uploadFile.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Upload Now'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal