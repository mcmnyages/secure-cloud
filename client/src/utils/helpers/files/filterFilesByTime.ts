import type { CloudFile } from '@/types/fileTypes'
import type { TimeFilter } from '@/components/ui/dashboard/modals/UploadsModal'

// Helpers
const startOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const endOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export const filterFilesByTime = (
  files: CloudFile[],
  timeFilter: TimeFilter,
  customDate?: Date,
  customTime?: string
): CloudFile[] => {
  const now = new Date()

  switch (timeFilter) {
    case 'today': {
      const start = startOfDay(now)
      return files.filter(f => {
        const created = new Date(f.createdAt)
        return created >= start && created <= now
      })
    }

    case 'yesterday': {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const start = startOfDay(yesterday)
      const end = endOfDay(yesterday)

      return files.filter(f => {
        const created = new Date(f.createdAt)
        return created >= start && created <= end
      })
    }

    case 'last7days': {
      const start = new Date()
      start.setDate(start.getDate() - 6) // 6 days ago + today = 7 total
      start.setHours(0, 0, 0, 0)

      return files.filter(f => {
        const created = new Date(f.createdAt)
        return created >= start && created <= now
      })
    }

    case 'custom': {
      if (!customDate) return []

      const start = new Date(customDate)
      const end = new Date(customDate)

      if (customTime) {
        const [h, m] = customTime.split(':')
        start.setHours(Number(h), Number(m), 0, 0)
        end.setHours(Number(h), Number(m), 59, 999)
      } else {
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
      }

      return files.filter(f => {
        const created = new Date(f.createdAt)
        return created >= start && created <= end
      })
    }

    default:
      return []
  }
}