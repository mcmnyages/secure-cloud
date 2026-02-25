import { useAuth } from '@/contexts/AuthContext'



const DashboardHeader = () => {
  const { user } = useAuth()

  return (
    <header className="flex justify-between items-center m-8">
      <div>
        <p className="text-gray-500">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

  
    </header>
  )
}
export default DashboardHeader