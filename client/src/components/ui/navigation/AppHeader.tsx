import { Menu, X, LogOut, User, Settings, Cloud } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import getInitials from '../../../utils/helpers/getInitials'
import MenuItem from './MenuItem'
import ThemeToggle from '../buttons/ThemeToggleButton'

interface Props {
  collapsed: boolean
  onToggleDesktop: () => void
  onOpenMobile: () => void
}

const AppHeader = ({ collapsed, onToggleDesktop, onOpenMobile }: Props) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = !!user
  const initials = getInitials(user?.name, user?.email)

  /* ---------------- Scroll & Click Logic ---------------- */
  useEffect(() => {
    if (isAuthenticated) return
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated])

  const closeMenus = useCallback(() => {
    setOpen(false)
    setMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setMobileMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    closeMenus()
    navigate('/')
  }

  /* ---------------- Responsive Constants ---------------- */
  // These should match your Sidebar widths exactly
  const sidebarWidth = collapsed ? 'md:left-20' : 'md:left-64'

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 z-40 transition-all duration-300 ease-in-out
        ${isAuthenticated
          ? `left-0 ${sidebarWidth} bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] shadow-sm`
          : `left-0 w-full ${scrolled ? "bg-[rgb(var(--card))/0.8] backdrop-blur-md border-b border-[rgb(var(--border))/0.5]" : "bg-transparent"}`
        }
      `}
    >
      <div className={`h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 ${!isAuthenticated && 'max-w-7xl mx-auto'}`}>

        {/* LEFT SECTION: Contextual Toggles */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Mobile: Hamburger to open Drawer */}
              <button
                onClick={onOpenMobile}
                className="md:hidden p-2 -ml-2 rounded-md text-[rgb(var(--text))] hover:bg-[rgb(var(--bg))] transition-colors"
              >
                <Menu size={24} />
              </button>

              {/* Desktop: Collapse/Expand Sidebar */}
              <button
                onClick={onToggleDesktop}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--primary)/0.1)] hover:text-[rgb(var(--primary))] transition-all"
              >
                {collapsed ? <Menu size={18} /> : <X size={18} />}
              </button>
            </>
          ) : (
            <Link to="/" className="flex items-center gap-2 group">
              <Cloud className="text-[rgb(var(--primary))] group-hover:scale-110 transition-transform" size={28} />
              <span className="font-bold text-xl tracking-tight  xs:block">
                Secure<span className="text-[rgb(var(--primary))]">Cloud</span>
              </span>
            </Link>
          )}
        </div>

        {/* RIGHT SECTION: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[rgb(var(--bg))] transition-colors"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-xs font-bold shadow-inner">
                  {initials}
                </div>
                {/* Desktop only: Show Name */}
                <span className="hidden lg:block text-sm font-medium pr-2">{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[rgb(var(--border))]">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-[rgb(var(--text)/0.5)] truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <MenuItem icon={<User size={16} />} onClick={() => { navigate('/profile'); setOpen(false); }}>Profile</MenuItem>
                    <MenuItem icon={<Settings size={16} />} onClick={() => { navigate('/settings'); setOpen(false); }}>Settings</MenuItem>
                    <div className="h-px bg-[rgb(var(--border))] my-1 mx-2" />
                    <MenuItem icon={<LogOut size={16} />} danger onClick={handleLogout}>Logout</MenuItem>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <nav className="flex items-center gap-2">
              {/* Public Desktop Nav */}
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-[rgb(var(--primary))] transition-colors">Log In</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold bg-[rgb(var(--primary))] text-white rounded-lg hover:opacity-90 transition-all">Get Started</Link>
              </div>

              {/* Public Mobile Nav Dropdown */}
              <div className="sm:hidden" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md border border-[rgb(var(--border))]"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {mobileMenuOpen && (
                  <div className="absolute right-4 mt-2 w-48 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-lg p-2 flex flex-col gap-1">
                    <Link to="/login" className="p-2 text-sm" onClick={closeMenus}>Log In</Link>
                    <Link to="/register" className="p-2 text-sm bg-[rgb(var(--primary))] text-white rounded-md text-center" onClick={closeMenus}>Sign Up</Link>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader