import { useAuth } from '../../contexts/AuthContext'

const DashboardHeader = () => {
  const { user } = useAuth()

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold">My Secure Cloud</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>
    </header>
  )
}

export default DashboardHeader
