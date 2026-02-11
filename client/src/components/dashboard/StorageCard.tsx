import { HardDrive } from 'lucide-react'

interface StorageCardProps {
  used: number
  limit: number
}

const StorageCard = ({ used, limit }: StorageCardProps) => {
  const percentage = Math.min((used / limit) * 100, 100)

  return (
    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] p-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 text-[rgb(var(--primary))]">
        <HardDrive size={22} />
        <h2 className="font-semibold text-lg text-[rgb(var(--text))]">Storage</h2>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[rgb(var(--border)/0.2)] rounded-full h-3 mb-2">
        <div
          className="bg-[rgb(var(--primary))] h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Usage text */}
      <p className="text-sm text-[rgb(var(--text)/0.7)]">
        {(used / 1024 / 1024).toFixed(2)} MB of{' '}
        {(limit / 1024 / 1024).toFixed(0)} MB used
      </p>
    </div>
  )
}

export default StorageCard
