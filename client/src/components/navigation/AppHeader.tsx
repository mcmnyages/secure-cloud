import {
  Menu,
  X,
  LogOut,
  User,
  Settings
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import getInitials from '../../utils/helpers/getInitials'
import MenuItem from './MenuItem'

interface Props {
  collapsed: boolean
  onToggleDesktop: () => void
  onOpenMobile: () => void
}

const AppHeader = ({
  collapsed,
  onToggleDesktop,
  onOpenMobile,
}: Props) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = getInitials(user?.name, user?.email)

  const closeMenu = useCallback(() => {
    setOpen(false)
  }, [])

  // Close menu on outside click + escape
  useEffect(() => {
    if (!open) return

    const handleOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) closeMenu()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, closeMenu])

  const handleLogout = async () => {
    await logout()
    closeMenu()
  }

  const goTo = (path: string) => {
    navigate(path)
    closeMenu()
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left: Sidebar toggle + title */}
      <div className="flex items-center gap-2">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-gray-700" />
        </button>

        {/* Desktop sidebar toggle */}
<button
  type="button"
  onClick={onToggleDesktop}
  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  className={`
    hidden md:inline-flex
    p-2 rounded-lg
    transition-colors duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
    relative group
    ${collapsed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}
  `}
>
  {collapsed ? (
    <Menu size={20} className="text-white" />
  ) : (
    <X size={20} className="text-white" />
  )}

  {/* Tooltip */}
  <span
    className="
      pointer-events-none
      absolute top-full mt-2
      left-1/2 -translate-x-1/2
      rounded-md bg-gray-900 text-white text-xs
      px-2 py-1 whitespace-nowrap
      opacity-0 translate-y-1
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-200
      z-50
    "
  >
    {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  </span>
</button>



        <h1 className="font-semibold text-lg hidden sm:block text-gray-800">
          Dashboard
        </h1>
      </div>

      {/* Right: User menu */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="
            group flex items-center gap-2 px-1 py-1 rounded-full
            transition focus-visible:outline-none focus-visible:ring-2 ring-blue-500
          "
        >
          <div className="relative">
            <div
              className="
                w-9 h-9 rounded-full
                bg-gradient-to-br from-blue-500 to-indigo-600
                text-white font-semibold text-sm
                flex items-center justify-center
                ring-2 ring-transparent group-hover:ring-blue-200
                transition
              "
            >
              {initials}
            </div>

            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </button>

        {open && (
          <div
            role="menu"
            className="
              absolute right-0 mt-3 w-56
              rounded-xl bg-white/95 backdrop-blur
              ring-1 ring-black/5
              shadow-xl shadow-black/10
              origin-top-right
              animate-in fade-in slide-in-from-top-2
              z-50
            "
          >
            {/* User info */}
            <div className="px-4 py-3">
              <p className="text-sm font-medium leading-none text-gray-800">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate mt-1">
                {user?.email}
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Navigation */}
            <div className="py-1">
              <MenuItem
                icon={<Settings size={16} className="text-gray-600" />}
                onClick={() => goTo('/settings')}
              >
                Settings
              </MenuItem>

              <MenuItem
                icon={<User size={16} className="text-gray-600" />}
                onClick={() => goTo('/profile')}
              >
                Profile
              </MenuItem>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Logout */}
            <div className="py-1">
              <MenuItem
                icon={<LogOut size={16} className="text-red-600" />}
                danger
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppHeader
