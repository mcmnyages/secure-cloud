import { NavLink } from "react-router-dom"
import type { JSX } from "react"

interface Props {
  to: string
  icon: JSX.Element
  label: string
  collapsed: boolean
}

const NavItem = ({ to, icon, label, collapsed }: Props) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      group relative flex items-center h-12 rounded-xl transition-all duration-200
      ${
        isActive
          ? "bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))] shadow-sm"
          : "text-[rgb(var(--text)/0.5)] hover:bg-[rgb(var(--bg))] hover:text-[rgb(var(--text))]"
      }
    `}
  >
    <div className="w-20 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
      {icon}
    </div>

    <span
      className={`font-bold text-sm whitespace-nowrap transition-all duration-300
      ${
        collapsed
          ? "md:opacity-0 md:-translate-x-4 md:pointer-events-none"
          : "opacity-100 translate-x-0"
      }`}
    >
      {label}
    </span>

    {collapsed && (
      <div className="hidden md:block absolute left-20 px-3 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none z-[80] shadow-xl">
        {label}
      </div>
    )}
  </NavLink>
)

export default NavItem