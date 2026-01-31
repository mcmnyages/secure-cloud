import { HardDrive } from 'lucide-react'

interface StorageCardProps {
  used: number
  limit: number
}

const StorageCard = ({ used, limit }: StorageCardProps) => {
  const percentage = Math.min((used / limit) * 100, 100)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4 text-blue-600">
        <HardDrive size={22} />
        <h2 className="font-semibold text-lg text-gray-800">Storage</h2>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-600">
        {(used / 1024 / 1024).toFixed(2)} MB of{' '}
        {(limit / 1024 / 1024).toFixed(0)} MB used
      </p>
    </div>
  )
}

export default StorageCard
