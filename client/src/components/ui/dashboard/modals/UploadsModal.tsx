import type { CloudFile } from '@/types/fileTypes'
import FileListItem from '@/components/ui/dashboard/FileListItem'
import { formatFileSize } from '@/utils/helpers/files/fileUtils'
import { X } from 'lucide-react'

export type TimeFilter =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'custom'

interface UploadsModalProps {
  isOpen: boolean
  files: CloudFile[]
  timeFilter: TimeFilter
  customDate?: Date
  title?: string
  onClose: () => void
  onDownload: (id: string) => void
  onDelete: (id: string) => void
  onTimeFilterChange?: (tf: TimeFilter, date?: Date) => void
}

const UploadsModal: React.FC<UploadsModalProps> = ({
  isOpen,
  files,
  timeFilter,
  customDate,
  title,
  onClose,
  onDownload,
  onDelete,
  onTimeFilterChange
}) => {
  if (!isOpen) return null

  const getStartTime = () => {
    switch (timeFilter) {
      case 'today': {
        const d = new Date(); d.setHours(0, 0, 0, 0); return d
      }
      case 'yesterday': {
        const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(0, 0, 0, 0); return d
      }
      case 'last7days': {
        const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(0, 0, 0, 0); return d
      }
      case 'custom':
        return customDate ? new Date(customDate.setHours(0, 0, 0, 0)) : new Date(0)
    }
  }

  const filteredFiles = files.filter(f => new Date(f.createdAt) >= getStartTime())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative z-10 w-full max-w-3xl bg-[rgb(var(--card))] rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-[rgb(var(--text)/0.5)] hover:text-[rgb(var(--text))] transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-[rgb(var(--text))]">{title || 'Recent Uploads'}</h2>

        {/* Time filter buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['today', 'yesterday', 'last7days', 'custom'].map(option => (
            <button
              key={option}
              onClick={() => onTimeFilterChange?.(option as TimeFilter)}
              className={`px-3 py-1 rounded-xl text-sm font-semibold transition-all border
                ${timeFilter === option
                  ? 'bg-[rgb(var(--primary))] text-white border-[rgb(var(--primary))]'
                  : 'bg-[rgb(var(--background))] border-[rgb(var(--border))] hover:bg-[rgb(var(--muted)/0.2)]'}`}
            >
              {option === 'custom' ? 'Custom' : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Custom date picker */}
        {timeFilter === 'custom' && (
          <div className="mb-4">
            <input
              type="date"
              className="border border-[rgb(var(--border))] rounded-lg p-2 w-full"
              value={customDate ? customDate.toISOString().slice(0, 10) : ''}
              onChange={e => {
                const date = e.target.valueAsDate
                if (date) onTimeFilterChange?.('custom', date)
              }}
            />
          </div>
        )}

        {/* File list */}
        {filteredFiles.length === 0 ? (
          <p className="text-center text-[rgb(var(--text)/0.6)] py-10">
            No files found for this period.
          </p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredFiles.map(file => (
              <FileListItem
                key={file.id}
                file={file.currentVersion}
                formatSize={formatFileSize}
                onDownload={() => onDownload(file.id)}
                onDelete={() => onDelete(file.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadsModal