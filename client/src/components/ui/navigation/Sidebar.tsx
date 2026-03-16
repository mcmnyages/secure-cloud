import { Cloud, X, Zap } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { menuItems } from "@/config/menuItems"
import NavItem from "./sidebar/NavItem"

interface Props {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}

const APP_NAME = "SecureCloud"

const Sidebar = ({ collapsed, mobileOpen, onCloseMobile }: Props) => {
  const { user } = useAuth()

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] flex flex-col
        bg-[rgb(var(--card))]/95 backdrop-blur-xl
        border-r border-[rgb(var(--border))]
        transition-[width,transform] duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        shadow-xl md:shadow-none
        
        ${collapsed ? "md:w-[80px]" : "md:w-[260px]"}
        
        w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-5 border-b border-[rgb(var(--border))] shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 min-w-max group">
            <div
              className="
              w-10 h-10
              rounded-2xl
              bg-gradient-to-br
              from-[rgb(var(--primary))]
              to-blue-500
              flex items-center justify-center
              text-white
              shadow-md
              transition
              group-hover:scale-105
            "
            >
              <Cloud size={22} />
            </div>

            <span
              className={`font-black text-xl tracking-tighter transition-opacity duration-300 ${
                collapsed ? "md:opacity-0" : "opacity-100"
              }`}
            >
              {APP_NAME}
            </span>
          </div>

          <button
            onClick={onCloseMobile}
            className="ml-auto md:hidden p-2 rounded-lg hover:bg-[rgb(var(--bg))] transition"
          >
            <X size={20} className="text-[rgb(var(--text)/0.7)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-2 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.path}>
                {item.section && (
                  <div
                    className={`pt-6 pb-2 px-3 transition-opacity duration-300 ${
                      collapsed ? "md:opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-semibold text-[rgb(var(--text)/0.45)] uppercase tracking-[0.18em]">
                        {item.section}
                      </p>
                      <div className="flex-1 h-px bg-[rgb(var(--border))]" />
                    </div>
                  </div>
                )}

                <NavItem
                  to={item.path}
                  icon={<Icon size={22} />}
                  label={item.label}
                  collapsed={collapsed}
                />
              </div>
            )
          })}

          {/* Scroll Fade */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[rgb(var(--card))] to-transparent" />
        </nav>

        {/* Storage Card */}
        <div
          className={`px-4 mb-4 transition-all duration-300 ${
            collapsed
              ? "md:opacity-0 md:translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="p-3 rounded-xl bg-[rgb(var(--primary)/0.07)] border border-[rgb(var(--primary)/0.15)] backdrop-blur">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[rgb(var(--primary))]" />
              <span className="text-xs font-bold uppercase tracking-tight">
                Storage
              </span>
            </div>

            <div className="h-2 w-full bg-[rgb(var(--border))] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-blue-400 w-[80%] rounded-full transition-all duration-700 ease-out" />
            </div>

            <span className="text-[10px] text-[rgb(var(--text)/0.45)]">
              8GB of 10GB used
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))]">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
              collapsed
                ? "md:justify-center"
                : "hover:bg-[rgb(var(--bg))] hover:shadow-sm cursor-pointer"
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-[rgb(var(--primary))] flex items-center justify-center text-white text-sm font-black shadow-inner">
                {initials}
              </div>

              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[rgb(var(--card))] rounded-full" />
            </div>

            <div
              className={`flex flex-col min-w-0 transition-all duration-300 ${
                collapsed
                  ? "md:w-0 md:opacity-0 md:hidden"
                  : "w-full opacity-100"
              }`}
            >
              <span className="font-semibold text-sm truncate">
                {user?.name}
              </span>

              <span className="text-[10px] font-medium text-[rgb(var(--text)/0.45)] truncate">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar