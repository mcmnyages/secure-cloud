import { LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const DashboardHeader = () => {
  const { user, logout } = useAuth()

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold">My Secure Cloud</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  )
}

export default DashboardHeader
