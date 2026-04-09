import QuickStat from '@/components/ui/dashboard/QuickStat'
import { File, Search } from 'lucide-react'
import { StorageCard } from '@/components/ui/dashboard'

interface DashboardStatsProps {
  totalFiles: number
  filteredFilesCount: number
  storage?: any
}
const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalFiles,
  filteredFilesCount,
  storage
}) => {
  return (
    <div className="
      flex flex-wrap items-center gap-3
    ">
      {storage && <StorageCard {...storage} />}

      <QuickStat
        label="Files"
        value={totalFiles}
        icon={<File size={16} />}
      />

      <QuickStat
        label="Matches"
        value={filteredFilesCount}
        icon={<Search size={16} />}
      />
    </div>
  )
}

export default DashboardStats