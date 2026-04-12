import { Menu, X, LogOut, User, Settings, Cloud, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useNotifications } from "@/hooks/notifications/query/useNotification";
import { useNotificationsAction } from "@/hooks/notifications/mutations/useNotificationsAction";
import getInitials from '@/utils/helpers/getInitials'
import MenuItem from './MenuItem'
import ThemeToggle from '../buttons/ThemeToggleButton'
import { NotificationModal } from '../modals/NotificationModal'
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  collapsed: boolean
  onToggleDesktop: () => void
  onOpenMobile: () => void
}

const AppHeader = ({ collapsed, onToggleDesktop, onOpenMobile }: Props) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showNotification, setShowNotification] = useState(false)

  const isAuthenticated = !!user

  /* ---------------- Notification Logic ---------------- */
  const { data } = useNotifications(
    {
      page: 1,
      limit: 10,
      onlyUnread: false,
    },
    {
      enabled: isAuthenticated
    }
  );

  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  } = useNotificationsAction();


  const notifications = useMemo(() => {
    return Array.isArray(data) ? data : data?.data ?? [];
  }, [data]);

  // 2. Filter to get only the count of unread items
  const unreadCount = useMemo(() => {
    return notifications.filter((n: any) => !n.isRead).length;
  }, [notifications]);

  const handleMarkRead = (ids: string[]) => ids.forEach(id => markAsRead.mutate(id));
  const handleMarkAllRead = () => markAllAsRead.mutate();
  const handleDelete = (ids: string[]) => ids.forEach(id => deleteNotification.mutate(id));
  const handleDeleteAll = () => deleteAllNotifications.mutate();

  /* ---------------- UI State ---------------- */
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const initials = getInitials(user?.name, user?.email)

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
    logout()
    closeMenus()
    navigate('/login')
  }

  /* ---------------- Dynamic Layout Styles ---------------- */
  const sidebarWidth = collapsed ? '4.0625rem' : '16rem'
  const [headerStyle, setHeaderStyle] = useState({ left: sidebarWidth, width: `calc(100% - ${sidebarWidth})`, transition: 'left 0.3s, width 0.3s', minWidth: '0' });

  useEffect(() => {
    const updateHeaderStyle = () => {
      if (!isAuthenticated || window.innerWidth < 768) {
        setHeaderStyle({ left: '0', width: '100%', transition: 'left 0.3s, width 0.3s', minWidth: '0' });
      } else {
        setHeaderStyle({ left: sidebarWidth, width: `calc(100% - ${sidebarWidth})`, transition: 'left 0.3s, width 0.3s', minWidth: '0' });
      }
    };
    updateHeaderStyle();
    window.addEventListener('resize', updateHeaderStyle);
    return () => window.removeEventListener('resize', updateHeaderStyle);
  }, [sidebarWidth, isAuthenticated]);

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-40 transition-all duration-300 ease-in-out shadow-lg ${isAuthenticated
        ? `bg-[rgb(var(--card))] border-b border-[rgb(var(--border))]`
        : `${scrolled ? "bg-[rgb(var(--card))/0.8] backdrop-blur-md border-b border-[rgb(var(--border))/0.5]" : "bg-transparent"}`
        }`}
      style={headerStyle}
    >
      <div className={`h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 ${!isAuthenticated && 'max-w-7xl mx-auto'}`}>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button onClick={onOpenMobile} className="md:hidden p-2 -ml-2 rounded-md text-[rgb(var(--text))] hover:bg-[rgb(var(--bg))] transition-colors">
                <Menu size={24} />
              </button>
              <button onClick={onToggleDesktop} className="hidden md:flex items-center justify-center w-8 h-8 rounded-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--primary)/0.1)] hover:text-[rgb(var(--primary))] transition-all">
                {collapsed ? <Menu size={18} /> : <X size={18} />}
              </button>
            </>
          ) : (
            <Link to="/" className="flex items-center gap-2 group">
              <Cloud className="text-[rgb(var(--primary))] group-hover:scale-110 transition-transform" size={28} />
              <span className="font-bold text-xl tracking-tight">
                Secure<span className="text-[rgb(var(--primary))]">Cloud</span>
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && (
            <button
              onClick={() => setShowNotification(true)}
              className="group relative p-2 rounded-xl transition-all active:scale-90 hover:bg-[rgb(var(--primary)/0.1)]"
            >
              <div className="relative">
                <Bell
                  size={22}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:rotate-12"
                  style={{ color: 'rgb(var(--text))' }}
                />

                <AnimatePresence>
                  {/* Change this condition to unreadCount */}
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black leading-none text-white rounded-full border-2"
                      style={{ backgroundColor: 'rgb(var(--primary))', borderColor: 'rgb(var(--bg))' }}
                    >
                      {/* Display unreadCount here */}
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2 p-1 rounded-full hover:bg-[rgb(var(--bg))] transition-colors group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-xs font-bold shadow-inner group-hover:ring-2 group-hover:ring-[rgb(var(--primary))] transition-all">
                  {initials}
                </div>
                <span className="hidden lg:block text-sm font-medium pr-2">{user?.name?.split(' ')[0]}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-[rgb(var(--primary))] transition-colors">Log In</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold bg-[rgb(var(--primary))] text-white rounded-lg hover:opacity-90 transition-all">Get Started</Link>
              </div>

              <div className="sm:hidden" ref={mobileMenuRef}>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md border border-[rgb(var(--border))]">
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {mobileMenuOpen && (
                  <div className="absolute right-4 mt-2 w-48 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-lg p-2 flex flex-col gap-1 animate-in fade-in duration-200">
                    <Link to="/login" className="p-2 text-sm" onClick={closeMenus}>Log In</Link>
                    <Link to="/register" className="p-2 text-sm bg-[rgb(var(--primary))] text-white rounded-md text-center" onClick={closeMenus}>Sign Up</Link>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
        onMarkAllRead={handleMarkAllRead}
      />
    </header>
  )
}

export default AppHeader