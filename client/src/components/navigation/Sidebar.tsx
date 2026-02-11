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
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          inset-y-0 left-0
          bg-[rgb(var(--card))]
          border-r border-[rgb(var(--border))]
          transition-[width,transform] duration-300 ease-in-out
          
          /* Mobile */
          w-64
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          
          /* Desktop */
          ${collapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-[rgb(var(--border))]">
          <div className="flex items-center gap-2 overflow-hidden">
            
            {/* Full name */}
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

            {/* Initials */}
            <span
              className={`
                hidden md:flex
                items-center justify-center
                font-bold text-sm
                w-9 h-9 rounded-lg
                bg-[rgb(var(--primary))]
                text-white
                transition-all duration-200
                ${collapsed ? 'md:opacity-100' : 'md:opacity-0 md:w-0 md:overflow-hidden'}
              `}
            >
              {APP_INITIALS}
            </span>
          </div>

          {/* Mobile close */}
          <button
            onClick={onCloseMobile}
            className="ml-auto md:hidden p-2 rounded-lg hover:bg-[rgb(var(--bg))] transition"
            aria-label="Close sidebar"
          >
            <X size={18} className="text-[rgb(var(--text))]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          <NavItem
            to="/dashboard"
            icon={<LayoutGrid size={20} />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <NavItem
            to="/files"
            icon={<Folder size={20} />}
            label="Files"
            collapsed={collapsed}
          />
          <NavItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            collapsed={collapsed}
          />
        </nav>
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
        group flex items-center gap-3 px-3 py-2 rounded-lg
        transition-all
        ${
          isActive
            ? 'bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]'
            : 'text-[rgb(var(--text)/0.7)] hover:bg-[rgb(var(--bg))]'
        }
      `
    }
  >
    <div className="shrink-0">{icon}</div>

    <span
      className={`
        whitespace-nowrap
        transition-all duration-200
        ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}
      `}
    >
      {label}
    </span>
  </NavLink>
)

export default Sidebar
