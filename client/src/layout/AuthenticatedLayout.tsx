import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/ui/navigation/Sidebar'
import AppHeader from '../components/ui/navigation/AppHeader'

const AuthLayout = () => {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div 
        className={`
          flex flex-col min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          /* Only apply padding on desktop. Sync perfectly with Sidebar width. */
          ${collapsed ? 'md:pl-20' : 'md:pl-64'}
          pl-0
        `}
      >
        <AppHeader
          collapsed={collapsed}
          onToggleDesktop={() => setCollapsed(!collapsed)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 mt-16">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthLayout