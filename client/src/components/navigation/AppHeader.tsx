import { Menu, X, LogOut, User, Settings, Cloud } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import getInitials from '../../utils/helpers/getInitials'
import MenuItem from './MenuItem'
import ThemeToggle from '../ui/buttons/ThemeToggleButton'

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
  const menuRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = !!user
  const initials = getInitials(user?.name, user?.email)

  // Only track scroll if the user is NOT logged in
  useEffect(() => {
    if (isAuthenticated) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated])

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) closeMenu()
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate('/')
  }

  // --- Header Styling Logic ---
  // 1. Authenticated: Standard solid header
  // 2. Unauthenticated + Top: Transparent
  // 3. Unauthenticated + Scrolled: Glassmorphism
  const headerStyles = isAuthenticated
    ? "h-16 bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] shadow-sm sticky top-0"
    : `fixed top-0 left-0 right-0 transition-all duration-500 z-50 ${
        scrolled 
          ? "h-16 bg-[rgb(var(--card))/0.8] backdrop-blur-lg border-b border-[rgb(var(--border))/0.5] shadow-md" 
          : "h-20 bg-transparent border-b border-transparent"
      }`;

  return (
    <header className={headerStyles}>
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button onClick={onOpenMobile} className="md:hidden p-2 rounded-lg hover:bg-[rgb(var(--bg))] transition-colors">
                <Menu size={20} className="text-[rgb(var(--text)/0.85)]" />
              </button>
              <button
                onClick={onToggleDesktop}
                className={`hidden md:flex p-2 rounded-lg transition-all ${
                  collapsed ? 'bg-[rgb(var(--primary))]' : 'bg-red-500'
                } text-white shadow-sm`}
              >
                {collapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
            </>
          ) : (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[rgb(var(--primary))] p-2 rounded-xl shadow-lg shadow-[rgb(var(--primary))/0.15] group-hover:scale-110 transition-transform">
                <Cloud className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-[rgb(var(--text))]">
                Secure<span className="text-[rgb(var(--primary))]">Cloud</span>
              </span>
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button onClick={() => setOpen(!open)} className="p-1 rounded-full transition-all hover:bg-[rgb(var(--bg))]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {initials}
                </div>
              </button>
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-[rgb(var(--card))] rounded-xl shadow-2xl border border-[rgb(var(--border))] overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))/0.5]">
                    <p className="text-sm font-bold text-[rgb(var(--text))]">{user?.name}</p>
                    <p className="text-xs text-[rgb(var(--text)/0.6)] truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <MenuItem icon={<Settings size={16} />} onClick={() => navigate('/settings')}>Settings</MenuItem>
                    <MenuItem icon={<User size={16} />} onClick={() => navigate('/profile')}>Profile</MenuItem>
                    <div className="h-px bg-[rgb(var(--border))] my-1 mx-2" />
                    <MenuItem icon={<LogOut size={16} />} danger onClick={handleLogout}>Logout</MenuItem>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-[rgb(var(--text)/0.8)] hover:text-[rgb(var(--primary))] transition">
                Log in
              </Link>
              <Link
                to="/register"
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
                  scrolled 
                    ? 'bg-[rgb(var(--primary))] text-white shadow-lg' 
                    : 'bg-[rgb(var(--card))] text-[rgb(var(--primary))] shadow-md hover:bg-[rgb(var(--bg))]'
                }`}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader