import { Menu, PanelLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  onToggleDesktop: () => void
  onOpenMobile: () => void
}

const AppHeader = ({ onToggleDesktop, onOpenMobile }: Props) => {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        {/* Desktop collapse */}
        <button
          onClick={onToggleDesktop}
          className="hidden md:inline-flex p-2 rounded-lg hover:bg-gray-100"
        >
          <PanelLeft size={20} />
        </button>

        <h1 className="font-semibold text-lg hidden sm:block">
          Dashboard
        </h1>
      </div>

      <span className="text-sm text-gray-600">
        {user?.name || user?.email}
      </span>
    </header>
  )
}

export default AppHeader
