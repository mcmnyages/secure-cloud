import type { CloudFile } from '@/types/fileTypes'
import { subDays, subMonths, isWithinInterval, startOfDay, endOfDay } from 'date-fns' // Recommended: 'date-fns' for cleaner math

export type TimeFilter = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'lastMonth' | 'custom'

export const filterFilesByTime = (
    files: CloudFile[],
    timeFilter: TimeFilter,
    customDate?: Date,
    customTime?: string
): CloudFile[] => {
    const now = new Date()

    const getInterval = () => {
        switch (timeFilter) {
            case 'today':
                return { start: startOfDay(now), end: now }
            case 'yesterday':
                const yesterday = subDays(now, 1)
                return { start: startOfDay(yesterday), end: endOfDay(yesterday) }
            case 'last7days':
                return { start: startOfDay(subDays(now, 6)), end: now }
            case 'last30days':
                return { start: startOfDay(subDays(now, 29)), end: now }
            case 'lastMonth':
                const lastMonth = subMonths(now, 1)
                return { start: startOfDay(lastMonth), end: endOfDay(now) }
            case 'custom':
                if (!customDate) return null
                const start = new Date(customDate)
                if (customTime) {
                    const [h, m] = customTime.split(':').map(Number)
                    start.setHours(h, m, 0, 0)
                    const end = new Date(start)
                    end.setMinutes(end.getMinutes() + 59) // 1-hour window or exact minute
                    return { start, end }
                }
                return { start: startOfDay(customDate), end: endOfDay(customDate) }
            default:
                return null
        }
    }

    const interval = getInterval()
    if (!interval) return []

    return files.filter(f => {
        const created = new Date(f.createdAt)
        return isWithinInterval(created, interval)
    })
}