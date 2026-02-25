// components/ui/dashboard/DashboardSidebar.tsx


const DashboardSidebar: React.FC = () => {
  return (
    <aside className="lg:w-72 w-full space-y-6 hidden lg:block">
      <div className="bg-[rgb(var(--primary))] p-6 rounded-3xl text-white shadow-lg shadow-[rgb(var(--primary)/0.2)]">
        <h3 className="text-lg font-bold mb-2">Workspace</h3>
        <p className="text-white/80 text-sm mb-6">
          Need more space? Upgrade to Pro for unlimited uploads.
        </p>
      </div>
    </aside>
  )
}

export default DashboardSidebar