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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = !!user
  const initials = getInitials(user?.name, user?.email)

  /* ---------------- Scroll Effect (public only) ---------------- */
  useEffect(() => {
    if (isAuthenticated) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated])

  /* ---------------- Close Dropdowns ---------------- */
  const closeMenu = useCallback(() => setOpen(false), [])
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        closeMobileMenu()
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [closeMenu, closeMobileMenu])

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate('/')
  }

  /* ---------------- Header Style ---------------- */
  const headerStyles = isAuthenticated
    ? "h-16 bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] shadow-sm sticky top-0 z-40"
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "h-16 bg-[rgb(var(--card))/0.8] backdrop-blur-lg border-b border-[rgb(var(--border))/0.5] shadow-md"
          : "h-16 bg-transparent"
      }`

  return (
    <header className={headerStyles}>
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <>
              <button
                onClick={onOpenMobile}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
                  hover:bg-[rgb(var(--bg))] transition"
              >
                <Menu size={18} className="text-[rgb(var(--text)/0.85)]" />
              </button>

              <button
                onClick={onToggleDesktop}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg
                  border border-[rgb(var(--border))]
                  bg-[rgb(var(--bg))]
                  hover:bg-[rgb(var(--primary)/0.1)]
                  transition"
              >
                {collapsed ? <Menu size={18} /> : <X size={18} />}
              </button>
            </>
          ) : (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[rgb(var(--primary))] p-2 rounded-xl
                shadow-lg shadow-[rgb(var(--primary))/0.15]
                group-hover:scale-105 transition"
              >
                <Cloud className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-[rgb(var(--text))]">
                Secure<span className="text-[rgb(var(--primary))]">Cloud</span>
              </span>
            </Link>
          )}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {isAuthenticated ? (
            /* ================= AUTH USER ================= */
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full flex items-center justify-center
                  bg-[rgb(var(--primary))] text-white font-bold text-sm"
              >
                {initials}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56
                  bg-[rgb(var(--card))]
                  border border-[rgb(var(--border))]
                  rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))/0.5]">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-[rgb(var(--text)/0.6)] truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-1">
                    <MenuItem icon={<Settings size={16} />} onClick={() => navigate('/settings')}>
                      Settings
                    </MenuItem>
                    <MenuItem icon={<User size={16} />} onClick={() => navigate('/profile')}>
                      Profile
                    </MenuItem>
                    <div className="h-px bg-[rgb(var(--border))] my-1 mx-2" />
                    <MenuItem icon={<LogOut size={16} />} danger onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= PUBLIC ================= */
            <>
              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold
                    text-[rgb(var(--text)/0.8)]
                    hover:text-[rgb(var(--primary))]"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-sm font-bold
                    bg-[rgb(var(--primary))]
                    text-white
                    hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <div className="md:hidden relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg
                    border border-[rgb(var(--border))]
                    bg-[rgb(var(--bg))]"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44
                    bg-[rgb(var(--card))]
                    border border-[rgb(var(--border))]
                    rounded-xl shadow-xl p-2"
                  >
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-2 rounded-lg text-sm
                        hover:bg-[rgb(var(--bg))]"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-2 rounded-lg text-sm
                        bg-[rgb(var(--primary))]
                        text-white mt-1 text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader
