import { NavLink } from 'react-router-dom'
import { LayoutGrid, Folder, Settings, X } from 'lucide-react'
import type { JSX } from 'react'

interface Props {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}

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
    h-screen md:h-screen
    bg-white border-r
    transition-all duration-300
    ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
    md:translate-x-0
    ${collapsed ? 'md:w-20' : 'md:w-64'}
  `}
>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b">
          <span
            className={`
              font-bold text-lg transition-opacity duration-200
              ${collapsed ? 'opacity-0 md:hidden' : 'opacity-100'}
            `}
          >
            My Secure Cloud
          </span>

          <button
            onClick={onCloseMobile}
            className="ml-auto md:hidden p-2 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

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
      `flex items-center gap-3 px-3 py-2 rounded-lg transition
       ${
         isActive
           ? 'bg-blue-50 text-blue-600'
           : 'text-gray-600 hover:bg-gray-100'
       }`
    }
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </NavLink>
)

export default Sidebar
