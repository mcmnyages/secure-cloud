import { useAuth } from '../../contexts/AuthContext'

interface DashboardHeaderProps {
  onUpload: () => void
}

const DashboardHeader = ({ onUpload }: DashboardHeaderProps) => {
  const { user } = useAuth()

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold">My Secure Cloud</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      <button
        onClick={onUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Upload
      </button>
    </header>
  )
}
export default DashboardHeader