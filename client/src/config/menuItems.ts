import { LayoutGrid, Folder, Settings } from "lucide-react"

export interface MenuItem {
  label: string
  path: string
  icon: any
  section?: string
}

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "File Manager",
    path: "/files",
    icon: Folder,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    section: "System",
  },
]