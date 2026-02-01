import { Menu, PanelLeft, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  getInitials  from '../../utils/helpers/getInitials'

interface Props {
  onToggleDesktop: () => void
  onOpenMobile: () => void
}

const AppHeader = ({ onToggleDesktop, onOpenMobile }: Props) => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const initials = getInitials(user?.name, user?.email)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={onToggleDesktop}
          className="hidden md:inline-flex p-2 rounded-lg hover:bg-gray-100"
        >
          <PanelLeft size={20} />
        </button>

        <h1 className="font-semibold text-lg hidden sm:block">
          Dashboard
        </h1>
      </div>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-lg transition"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3 border-b">
              <p className="font-medium text-sm">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                navigate('/settings')
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
            >
              <Settings size={16} />
              Settings
            </button>

            <button
              onClick={() => {
                navigate('/profile')
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
            >
              <User size={16} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppHeader

// helper
