import { NavLink } from "react-router-dom"
import type { JSX } from "react"

interface Props {
  to: string
  icon: JSX.Element
  label: string
  collapsed: boolean
}

const NavItem = ({ to, icon, label, collapsed }: Props) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={`
            group relative flex items-center h-12 w-full
            px-3 rounded-xl
            transition-all duration-200
            
            ${
              isActive
                ? "bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]"
                : "text-[rgb(var(--text)/0.6)] hover:bg-[rgb(var(--bg))] hover:text-[rgb(var(--text))]"
            }

            ${collapsed ? "md:justify-center" : "gap-3"}
          `}
        >
          {/* Active indicator */}
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[rgb(var(--primary))]" />
          )}

          {/* Icon */}
          <div className="flex items-center justify-center shrink-0">
            {icon}
          </div>

          {/* Label */}
          {!collapsed && (
            <span className="font-semibold text-sm truncate">
              {label}
            </span>
          )}

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="hidden md:block absolute left-14 px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-medium rounded-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-lg z-50">
              {label}
            </div>
          )}
        </div>
      )}
    </NavLink>
  )
}

export default NavItem