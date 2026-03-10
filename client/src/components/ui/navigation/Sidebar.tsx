import { NavLink } from 'react-router-dom'
import { LayoutGrid, Folder, Settings, X } from 'lucide-react'
import type { JSX } from 'react'

interface Props {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}

const APP_NAME = 'Secure Cloud'
const APP_INITIALS = 'SC'

const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }: Props) => {
  // Placeholder user info for avatar/profile
  const user = { name: 'Jane Doe', email: 'jane@example.com' };
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:absolute inset-y-0 left-0 transition-all duration-300 ease-in-out
          bg-[rgb(var(--card))] border-r border-[rgb(var(--border))]
          flex flex-col z-50 shadow-lg
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
        style={{ width: collapsed ? '5rem' : '16rem', maxWidth: '100vw' }}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-[rgb(var(--border))] flex-shrink-0 relative">
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`
                font-bold text-lg whitespace-nowrap
                text-[rgb(var(--text))]
                transition-all duration-200
                ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}
              `}
            >
              {APP_NAME}
            </span>
            <span
              className={`
                hidden md:flex items-center justify-center font-bold text-sm
                w-9 h-9 rounded-lg bg-[rgb(var(--primary))] text-white
                transition-all duration-200
                ${collapsed ? 'md:opacity-100' : 'md:opacity-0 md:w-0 md:overflow-hidden'}
              `}
            >
              {APP_INITIALS}
            </span>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="absolute top-4 right-4 md:hidden p-2 rounded-lg hover:bg-[rgb(var(--bg))] transition"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-[rgb(var(--text))]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <NavItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/files" icon={<Folder size={20} />} label="Files" collapsed={collapsed} />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
        </nav>

        {/* User avatar/profile at bottom */}
        <div className="mt-auto px-4 py-3 border-t border-[rgb(var(--border))] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-sm font-bold shadow-md">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-[rgb(var(--text)/0.5)]">{user.email}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

const NavItem = ({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string
  icon: JSX.Element
  label: string
  collapsed: boolean
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
        group flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative
        ${isActive
        ? 'bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] border-l-4 border-[rgb(var(--primary))]'
        : 'text-[rgb(var(--text)/0.7)] hover:bg-[rgb(var(--bg))]'}
      `
    }
    title={collapsed ? label : undefined}
  >
    <div className="shrink-0">{icon}</div>
    <span
      className={`
        whitespace-nowrap transition-all duration-200
        ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}
      `}
    >
      {label}
    </span>
    {collapsed && (
      <span className="absolute left-12 bg-[rgb(var(--card))] text-xs rounded shadow-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    )}
  </NavLink>
)

export default Sidebar