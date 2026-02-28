import { useState } from 'react'
import FileListItem from './FileListItem'
import FileGridItem from './FileGridItem'
import UploadsModal, { type TimeFilter } from '@/components/ui/dashboard/modals/UploadsModal'
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
    const [filesToShow, setFilesToShow] = useState<number>(5)



    if (isLoading) return <OverlayLoader label="Loading Dashboard Elements..." />

    if (files.length === 0)
        return (
            <div className="text-center py-20 bg-[rgb(var(--card))] rounded-3xl border border-dashed border-[rgb(var(--border))]">
                <p className="text-[rgb(var(--text)/0.6)] font-medium">No files match your current filters.</p>
            </div>
        )

    return (
        <div className="space-y-4">
            {/* Files-to-show selector */}
            <div className="flex justify-end items-center gap-2">
                <label className="text-sm text-[rgb(var(--text)/0.7)]">Show:</label>
                <select
                    value={filesToShow}
                    onChange={(e) => setFilesToShow(Number(e.target.value))}
                    className="border border-[rgb(var(--border))] rounded-lg p-1 text-sm
               bg-[rgb(var(--card))] text-[rgb(var(--text))] 
               dark:bg-[rgb(var(--card))] dark:text-[rgb(var(--text))] 
               focus:ring-2 focus:ring-[rgb(var(--primary)/0.3)] 
               focus:outline-none transition-colors"
                >
                    {[5, 10, 15, 20].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>

            {/* Quick filter buttons */}
            <div className="flex gap-2">
                {['today', 'yesterday', 'last7days', 'custom'].map(option => (
                    <button
                        key={option}
                        onClick={() => {
                            setRecentModalOpen(true)
                            setRecentTimeFilter(option as TimeFilter)
                        }}
                        className="px-3 py-1 rounded-xl border text-sm bg-[rgb(var(--background))] hover:bg-[rgb(var(--muted)/0.2)]"
                    >
                        {option === 'custom' ? 'Custom' : option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* Grid/List display */}
            {viewMode === 'list' ? (
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-[rgb(var(--border))]">
                        {files.slice(0, filesToShow).map(file => (
                            <FileListItem
                                key={file.id}
                                file={file.currentVersion}
                                formatSize={formatFileSize}
                                onDownload={() => downloadFile(file.id, file.currentVersion.name)}
                                onDelete={{ mutate: (id: string) => deleteFile(id) }}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.slice(0, filesToShow).map(file => (
                        <FileGridItem
                            key={file.id}
                            file={file.currentVersion}
                            formatSize={formatFileSize}
                            onDownload={() => downloadFile(file.id, file.currentVersion.name)}
                            onDelete={{ mutate: (id: string) => deleteFile(id) }}
                        />
                    ))}
                </div>
            )}

            {files.length > filesToShow && (
                <div className="flex justify-end mt-2">
                    <a href="/files" className="text-sm text-blue-600 hover:underline font-medium">
                        View all files
                    </a>
                </div>
            )}

            {/* Uploads Modal */}
            <UploadsModal
                isOpen={recentModalOpen}
                files={files}
                timeFilter={recentTimeFilter}
                customDate={customDate}
                customTime={customTime}
                title={`Uploads: ${recentTimeFilter.charAt(0).toUpperCase() + recentTimeFilter.slice(1)}`}
                onClose={() => setRecentModalOpen(false)}
                onDownload={(id) => {
                    const file = files.find(f => f.id === id)
                    if (file) downloadFile(id, file.currentVersion.name)
                }}
                onDelete={deleteFile}
                onTimeFilterChange={(tf, date, time) => {
                    setRecentTimeFilter(tf);
                    if (tf === 'custom') {
                        setCustomDate(date);
                        setCustomTime(typeof time === 'string' ? time : '');
                    } else {
                        setCustomDate(undefined);
                        setCustomTime('');
                    }
                }}
            />
        </div>
    )
}

export default DashboardMain