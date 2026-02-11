import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/navigation/Sidebar'
import AppHeader from '../components/navigation/AppHeader'

const AuthLayout = () => {
  const { isAuthenticated } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader
          collapsed={collapsed}
          onToggleDesktop={() => setCollapsed(c => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
