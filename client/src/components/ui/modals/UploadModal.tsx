// src/components/ui/modals/UploadModal.tsx
import { useState, useMemo, useRef } from 'react'
import { X, Upload, Loader2, File, Trash2, FileCheck, AlertCircle, Plus } from 'lucide-react'
import { useFileActions } from '@/hooks/files/mutations/useFileActions'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const MAX_SIZE_MB = 100
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const UploadModal = ({ isOpen, onClose }: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Use the refactored hook
  const { uploadFile, isUploading } = useFileActions()

  // --- Logic: Helpers ---
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  // --- Logic: Calculations ---
  const totalSizeBytes = useMemo(() => files.reduce((acc, file) => acc + file.size, 0), [files])
  const isOverLimit = totalSizeBytes > MAX_SIZE_BYTES
  const sizePercentage = Math.min((totalSizeBytes / MAX_SIZE_BYTES) * 100, 100)

  // --- Logic: File Handling ---
  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return
    
    const incomingBatch = Array.from(newFiles)
    
    setFiles((prev) => {
      // Prevent duplicates by checking name and size
      const existingKeys = new Set(prev.map(f => `${f.name}-${f.size}`))
      const uniqueNewFiles = incomingBatch.filter(f => !existingKeys.has(`${f.name}-${f.size}`))
      return [...prev, ...uniqueNewFiles]
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0 || isOverLimit) return
    
    // Call the mutation from our hook
    uploadFile(files, {
      onSuccess: () => {
        setFiles([])
        onClose()
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-center border-b border-[rgb(var(--border))]">
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--text))]">Upload Files</h2>
            <p className="text-xs text-[rgb(var(--text)/0.5)] mt-0.5">Add and manage files before uploading</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-red-500/10 text-[rgb(var(--text)/0.4)] hover:text-red-500 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[rgb(var(--border))]">
          
          {/* Drop/Input Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files); }}
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all group
              ${isDragging 
                ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary)/0.05)] scale-[0.99]' 
                : 'border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.5)] hover:border-[rgb(var(--primary)/0.4)]'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <div className="p-3 rounded-full bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] mb-3 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <p className="text-sm font-medium text-[rgb(var(--text))]">
              Drag & drop or <span className="text-[rgb(var(--primary))] underline underline-offset-4">browse</span>
            </p>
            
            {/* Multi-select hint */}
            <div className="mt-3 px-3 py-1 rounded-md bg-[rgb(var(--text)/0.03)] border border-[rgb(var(--border))] flex items-center gap-2">
              <span className="text-[10px] font-bold text-[rgb(var(--text)/0.4)] uppercase tracking-wider">
                Tip: Hold <span className="text-[rgb(var(--text)/0.7)] bg-[rgb(var(--text)/0.05)] px-1 rounded">Ctrl</span> or <span className="text-[rgb(var(--text)/0.7)] bg-[rgb(var(--text)/0.05)] px-1 rounded">Shift</span> to multi-select
              </span>
            </div>
          </div>

          {/* Storage Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className={isOverLimit ? 'text-red-500 font-bold' : 'text-[rgb(var(--text)/0.6)]'}>
                {isOverLimit ? 'Storage limit exceeded' : 'Current Batch Size'}
              </span>
              <span className={isOverLimit ? 'text-red-500 font-bold' : 'text-[rgb(var(--text)/0.6)]'}>
                {formatSize(totalSizeBytes)} / {MAX_SIZE_MB}MB
              </span>
            </div>
            <div className="h-1.5 w-full bg-[rgb(var(--border))] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${isOverLimit ? 'bg-red-500' : 'bg-[rgb(var(--primary))]'}`}
                style={{ width: `${sizePercentage}%` }}
              />
            </div>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--text)/0.4)]">
                  Upload Queue ({files.length})
                </h3>
                <label className="flex items-center gap-1 text-xs font-bold text-[rgb(var(--primary))] cursor-pointer hover:opacity-80 transition-opacity">
                  <Plus size={14} />
                  Add More
                  <input type="file" multiple className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                </label>
              </div>
              
              <div className="grid gap-2">
                {files.map((file, idx) => (
                  <div 
                    key={`${file.name}-${idx}`} 
                    className="flex items-center gap-3 p-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.3)] group animate-in slide-in-from-bottom-2 duration-200"
                  >
                    <div className="p-2 bg-[rgb(var(--card))] rounded-lg border border-[rgb(var(--border))] text-[rgb(var(--primary)/0.7)]">
                      <File size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[rgb(var(--text))] truncate">{file.name}</p>
                      <p className="text-[10px] text-[rgb(var(--text)/0.4)] font-bold uppercase tracking-tighter">
                        {formatSize(file.size)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFile(idx)}
                      className="p-2 text-[rgb(var(--text)/0.2)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[rgb(var(--bg)/0.8)] border-t border-[rgb(var(--border))] flex items-center gap-4">
          {isOverLimit && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
              <AlertCircle size={16} />
              <span>Limit Exceeded</span>
            </div>
          )}
          
          <div className="flex gap-3 ml-auto w-full sm:w-auto">
            <button
              disabled={isUploading}
              onClick={() => { setFiles([]); onClose(); }}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-[rgb(var(--text)/0.5)] hover:bg-[rgb(var(--border)/0.3)] hover:text-[rgb(var(--text))] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={files.length === 0 || isOverLimit || isUploading}
              onClick={handleUpload}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all min-w-[140px]
                ${files.length === 0 || isOverLimit || isUploading
                  ? 'bg-[rgb(var(--border))] text-[rgb(var(--text)/0.3)] cursor-not-allowed shadow-none'
                  : 'bg-[rgb(var(--primary))] text-white hover:shadow-lg hover:shadow-[rgb(var(--primary)/0.3)] active:scale-95'
                }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FileCheck size={18} />
                  <span>Upload {files.length > 0 ? `(${files.length})` : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadModal