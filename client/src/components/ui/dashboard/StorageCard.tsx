import { HardDrive } from 'lucide-react'

interface StorageCardProps {
  used: number
  limit: number
}

const StorageCard = ({ used, limit }: StorageCardProps) => {
  const percentage = Math.min((used / limit) * 100, 100)

  return (
    <div className="
      flex items-center gap-4
      px-4 py-3
      rounded-xl
      bg-[rgb(var(--card))]
      border border-[rgb(var(--border))]
    ">
      {/* Icon */}
      <div className="p-2 rounded-md bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]">
        <HardDrive size={16} />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between text-xs text-[rgb(var(--text)/0.6)] mb-1">
          <span>Storage</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full bg-[rgb(var(--border)/0.3)] overflow-hidden">
          <div
            className="h-full bg-[rgb(var(--primary))] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StorageCard