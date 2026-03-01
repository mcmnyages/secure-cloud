import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Filter } from 'lucide-react'
import FileListItem from '@/components/ui/dashboard/FileListItem'
import { formatFileSize } from '@/utils/helpers/files/fileUtils'
import { filterFilesByTime, type TimeFilter } from '@/utils/helpers/files/filterFilesByTime'
import type { CloudFile } from '@/types/fileTypes'
import Dropdown from '@/components/ui/dashboard/dropdowns/FilterOptionsDropdown'

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
  isOpen, files, timeFilter, customDate, customTime = '', title, onClose, onDownload, onDelete, onTimeFilterChange
}) => {
  const [localTime, setLocalTime] = useState<string>(customTime)

  // Sync local state when prop changes (essential for "custom" filter)
  useEffect(() => { setLocalTime(customTime) }, [customTime])

  const filteredFiles = useMemo(() => {
    return filterFilesByTime(files, timeFilter, customDate, localTime)
  }, [files, timeFilter, customDate, localTime])

  const dropdownOptions = [
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom Range', value: 'custom' },
    
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border)/0.5)] rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            
            <div className="p-8 pb-6 border-b border-[rgb(var(--border)/0.5)] flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <p className="text-sm font-medium text-[rgb(var(--text)/0.5)]">{filteredFiles.length} files found</p>
              </div>
              <button onClick={onClose} className="p-2.5 rounded-full bg-[rgb(var(--muted)/0.2)] hover:bg-[rgb(var(--muted)/0.4)] transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-4 bg-[rgb(var(--background)/0.3)] border-b border-[rgb(var(--border)/0.3)] space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {['today', 'yesterday', 'last7days'].map(option => (
                  <button
                    key={option}
                    onClick={() => onTimeFilterChange?.(option as TimeFilter)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                      timeFilter === option ? 'bg-[rgb(var(--primary))] text-white shadow-lg' : 'bg-[rgb(var(--card))] border-[rgb(var(--border))]'
                    }`}
                  >
                    {option === 'last7days' ? 'Last 7 Days' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
                
                <Dropdown 
                  options={dropdownOptions}
                  value={['last30days', 'lastMonth', 'custom'].includes(timeFilter) ? timeFilter : ''}
                  onChange={(val) => onTimeFilterChange?.(val as TimeFilter)}
                  placeholder="More Options"
                />
              </div>

              <AnimatePresence>
                {timeFilter === 'custom' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="flex flex-wrap gap-3 p-4 bg-[rgb(var(--card))] rounded-2xl border border-[rgb(var(--primary)/0.2)]">
                      <div className="flex-1 min-w-[140px] relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--primary))]" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background)/0.5)] rounded-xl text-sm outline-none"
                          value={customDate ? customDate.toISOString().slice(0, 10) : ''}
                          onChange={e => onTimeFilterChange?.('custom', e.target.valueAsDate || undefined, localTime)}
                        />
                      </div>
                      <div className="flex-1 min-w-[140px] relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--primary))]" />
                        <input
                          type="time"
                          className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--background)/0.5)] rounded-xl text-sm outline-none"
                          value={localTime}
                          onChange={e => onTimeFilterChange?.('custom', customDate, e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {filteredFiles.length === 0 ? (
                <div className="py-24 flex flex-col items-center text-[rgb(var(--text)/0.4)]">
                   <Filter className="w-10 h-10 mb-4 opacity-20" />
                   <p className="font-semibold">No files found for this period</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map(file => (
                    <motion.div layout key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <FileListItem
                        file={file.currentVersion}
                        formatSize={formatFileSize}
                        onDownload={() => onDownload(file.id)}
                        onDelete={{ mutate: () => onDelete(file.id) }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UploadsModal