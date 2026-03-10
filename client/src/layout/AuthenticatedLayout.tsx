import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/ui/navigation/Sidebar'
import AppHeader from '../components/ui/navigation/AppHeader'

const AuthLayout = () => {
  const { isAuthenticated } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          collapsed={collapsed}
          onToggleDesktop={() => setCollapsed(c => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-auto p-6 animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AuthLayout