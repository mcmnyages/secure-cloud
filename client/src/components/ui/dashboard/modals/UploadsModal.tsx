import type { CloudFile } from '@/types/fileTypes'
import FileListItem from '@/components/ui/dashboard/FileListItem'
import { formatFileSize } from '@/utils/helpers/files/fileUtils'
import { filterFilesByTime } from '@/utils/helpers/files/filterFilesByTime'
import { X } from 'lucide-react'
import { useState, useMemo } from 'react'

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
  customTime?: string
  title?: string
  onClose: () => void
  onDownload: (id: string) => void
  onDelete: (id: string) => void
  onTimeFilterChange?: (tf: TimeFilter, date?: Date, time?: string) => void
}

const UploadsModal: React.FC<UploadsModalProps> = ({
  isOpen,
  files,
  timeFilter,
  customDate,
  customTime: customTimeProp,
  title,
  onClose,
  onDownload,
  onDelete,
  onTimeFilterChange
}) => {
  const [customTime, setCustomTime] = useState<string>(customTimeProp || '')

  // ✅ Hooks must ALWAYS run
  const filteredFiles = useMemo(() => {
    return filterFilesByTime(files, timeFilter, customDate, customTime)
  }, [files, timeFilter, customDate, customTime])

  // ✅ Early return AFTER hooks
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-[rgb(var(--card))] rounded-xl shadow-2xl p-6 overflow-hidden">
        <button
          className="absolute top-4 right-4 text-[rgb(var(--text)/0.5)] hover:text-[rgb(var(--text))] transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[rgb(var(--text))]">
          {title || 'Recent Uploads'}
        </h2>

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
              {option === 'custom'
                ? 'Custom'
                : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {timeFilter === 'custom' && (
          <div className="mb-4 flex gap-2 items-center">
            <input
              type="date"
              className="border border-[rgb(var(--border))] rounded-lg p-2 w-full"
              value={customDate ? customDate.toISOString().slice(0, 10) : ''}
              onChange={e => {
                const date = e.target.valueAsDate
                if (date) onTimeFilterChange?.('custom', date, customTime)
              }}
            />
            <input
              type="time"
              className="border border-[rgb(var(--border))] rounded-lg p-2 w-full"
              value={customTime}
              onChange={e => {
                const time = e.target.value
                setCustomTime(time)
                onTimeFilterChange?.('custom', customDate, time)
              }}
            />
            <button
              type="button"
              className="ml-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-sm hover:bg-[rgb(var(--muted)/0.2)] transition-colors"
              onClick={() => {
                setCustomTime('')
                onTimeFilterChange?.('custom', undefined, '')
              }}
            >
              Clear
            </button>
          </div>
        )}

        {filteredFiles.length === 0 ? (
          <p className="text-center text-[rgb(var(--text)/0.6)] py-10">
            {timeFilter === 'custom'
              ? customDate || customTime
                ? 'No files were uploaded for the selected date and time.'
                : 'Please select a date and/or time to view uploads.'
              : 'No files were uploaded during this period.'}
          </p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredFiles.map(file => (
              <FileListItem
                key={file.id}
                file={file.currentVersion}
                formatSize={formatFileSize}
                onDownload={() => onDownload(file.id)}
                onDelete={{ mutate: () => onDelete(file.id) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadsModal