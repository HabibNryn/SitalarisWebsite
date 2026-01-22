// components/ui/sidebar.tsx
"use client";
import { Home, FilePlus2, HelpCircle } from "lucide-react";
import cn from "classnames";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Buat Surat", icon: FilePlus2, path: "/dashboard/user/SuratPernyataan" }, // ✅ Update path
  { label: "Bantuan", icon: HelpCircle, path: "/dashboard/bantuan" }
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 transition-all shadow-sm z-20",
        collapsed ? "w-0 md:w-16" : "w-64"
      )}
    >
      <nav className={cn("p-4 space-y-1", collapsed && "hidden md:block")}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                active 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 flex-shrink-0",
                active ? "text-blue-600" : "text-gray-500"
              )} />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapsed view */}
      {collapsed && (
        <div className="hidden md:flex flex-col items-center justify-center h-20 text-gray-500 text-xs">
          <div className="rotate-90 whitespace-nowrap mb-2 font-medium">Menu</div>
          <div className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    active 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  )}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}