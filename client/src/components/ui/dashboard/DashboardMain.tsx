import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, MoreHorizontal, History } from 'lucide-react'
import FileListItem from './FileListItem'
import FileGridItem from './FileGridItem'
import UploadsModal from '@/components/ui/dashboard/modals/UploadsModal'
import FilterOptionsDropdown from '@/components/ui/dashboard/dropdowns/FilterOptionsDropdown'
import { type TimeFilter } from '@/utils/helpers/files/filterFilesByTime'
import { formatFileSize } from '@/utils/helpers/files/fileUtils'
import { OverlayLoader } from '@/components/ui/spinners'
import type { CloudFile } from '@/types/fileTypes'

interface DashboardMainProps {
    files: CloudFile[]
    isLoading: boolean
    viewMode: 'grid' | 'list'
    deleteFile: (id: string) => void
    downloadFile: (id: string, name: string) => void
}

const DashboardMain: React.FC<DashboardMainProps> = ({
    files,
    isLoading,
    viewMode,
    deleteFile,
    downloadFile
}) => {
    const [recentModalOpen, setRecentModalOpen] = useState(false)
    const [recentTimeFilter, setRecentTimeFilter] = useState<TimeFilter>('today')
    const [customDate, setCustomDate] = useState<Date | undefined>()
    const [customTime, setCustomTime] = useState<string>('')
    const [filesToShow, setFilesToShow] = useState<number>(10)

    const displayedFiles = useMemo(() => files.slice(0, filesToShow), [files, filesToShow]);

    const showOptions = [
        { label: '5 items', value: 5 },
        { label: '10 items', value: 10 },
        { label: '25 items', value: 25 },
        { label: '50 items', value: 50 },
    ]

    if (isLoading) return <OverlayLoader label="Preparing your workspace..." />

    if (files.length === 0) return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-gradient-to-b from-[rgb(var(--card))] to-transparent rounded-[2rem] border-2 border-dashed border-[rgb(var(--border)/0.5)]">
            <div className="bg-[rgb(var(--primary)/0.1)] p-4 rounded-full mb-4">
                <FileSearch className="w-10 h-10 text-[rgb(var(--primary))]" />
            </div>
            <h3 className="text-xl font-semibold">No files found</h3>
            <p className="text-[rgb(var(--text)/0.5)] max-w-xs mt-2">Try adjusting your filters or uploading new content.</p>
        </div>
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* --- Refined Header --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[rgb(var(--card)/0.5)] backdrop-blur-md p-3 rounded-2xl border border-[rgb(var(--border)/0.4)] shadow-sm">
                
                {/* Unified History Button - Removes redundancy */}
                <button
                    onClick={() => setRecentModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary))] text-white rounded-xl text-xs font-bold shadow-lg shadow-[rgb(var(--primary)/0.2)] hover:opacity-90 transition-all w-full sm:w-auto justify-center"
                >
                    <History size={16} />
                    Filter by Time & History
                </button>

                {/* Themed Show Selector */}
                <div className="w-full sm:w-auto flex justify-end">
                    <FilterOptionsDropdown 
                        label="Show"
                        value={filesToShow}
                        options={showOptions}
                        onChange={(val) => setFilesToShow(Number(val))}
                    />
                </div>
            </div>

            {/* --- Content Area --- */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[rgb(var(--card))] border border-[rgb(var(--border)/0.5)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[rgb(var(--border)/0.3)]"
                    >
                        {displayedFiles.map(file => (
                            <FileListItem
                                key={file.id}
                                file={file.currentVersion}
                                formatSize={formatFileSize}
                                onDownload={() => downloadFile(file.id, file.currentVersion.name)}
                                onDelete={{ mutate: () => deleteFile(file.id) }}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="grid"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5"
                    >
                        {displayedFiles.map(file => (
                            <FileGridItem
                                key={file.id}
                                file={file.currentVersion}
                                formatSize={formatFileSize}
                                onDownload={() => downloadFile(file.id, file.currentVersion.name)}
                                onDelete={{ mutate: () => deleteFile(file.id) }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Pagination */}
            {files.length > filesToShow && (
                <div className="flex justify-center pt-4">
                    <button 
                        onClick={() => window.location.href = '/files'}
                        className="flex items-center gap-2 px-6 py-2 rounded-full bg-[rgb(var(--card))] text-xs font-bold border border-[rgb(var(--border))] hover:bg-[rgb(var(--primary))] hover:text-white transition-all shadow-sm"
                    >
                        View all {files.length} files
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            )}

            <UploadsModal
                isOpen={recentModalOpen}
                files={files}
                timeFilter={recentTimeFilter}
                customDate={customDate}
                customTime={customTime}
                onClose={() => setRecentModalOpen(false)}
                onDownload={(id) => {
                    const file = files.find(f => f.id === id)
                    if (file) downloadFile(id, file.currentVersion.name)
                }}
                onDelete={deleteFile}
                onTimeFilterChange={(tf, date, time) => {
                    setRecentTimeFilter(tf);
                    setCustomDate(date);
                    setCustomTime(time || '');
                }}
            />
        </div>
    )
}

export default DashboardMain