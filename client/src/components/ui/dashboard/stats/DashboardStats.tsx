import QuickStat from '@/components/ui/dashboard/QuickStat'
import { File, Search } from 'lucide-react'
import { StorageCard } from '@/components/ui/dashboard'

interface DashboardStatsProps {
  totalFiles: number
  filteredFilesCount: number
  storage?: any
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ totalFiles, filteredFilesCount, storage }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {storage && <StorageCard {...storage} />}
    <QuickStat label="Total Files" value={totalFiles} icon={<File size={20} />} />
    <QuickStat label="Search Matches" value={filteredFilesCount} icon={<Search size={20} />} />
  </div>
)

export default DashboardStats