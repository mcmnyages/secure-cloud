import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/ui/navigation/Sidebar";
import AppHeader from "../components/ui/navigation/AppHeader";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] overflow-x-hidden">
      {/* SIDEBAR - Fixed Position */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out
          ${collapsed ? "md:ml-[70px]" : "md:ml-[260px]"}
        `}
      >
        {/* HEADER - Fixed but relative to this wrapper */}
        <AppHeader
          collapsed={collapsed}
          onToggleDesktop={() => setCollapsed(!collapsed)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;