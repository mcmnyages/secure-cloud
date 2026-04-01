import { useState, useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Sidebar from "../components/ui/navigation/Sidebar"
import AppHeader from "../components/ui/navigation/AppHeader"

const AuthLayout = () => {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()

  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Layout wrapper */}
      <div
        className={`
          min-h-screen flex flex-col transition-all duration-300
          ${collapsed ? "md:pl-2" : "md:pl-[260px]"}
        `}
      >
        {/* Header */}
        <AppHeader
          collapsed={collapsed}
          onToggleDesktop={() => setCollapsed(!collapsed)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 py-6 md:py-8">
          
          {/* Responsive Content Container */}
          <div
            className="
              w-full
              px-4
              sm:px-6
              lg:px-8
              xl:px-10
              2xl:px-12
              max-w-[1600px]
              mx-auto
            "
          >
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default AuthLayout