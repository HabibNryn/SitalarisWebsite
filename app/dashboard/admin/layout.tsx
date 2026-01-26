"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const UsePathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  /* ──────────────────────────────
     Auth & Role Guard
  ────────────────────────────── */
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    return null;
  }

  /* ──────────────────────────────
     Menu Items
  ────────────────────────────── */
  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/dashboard/admin",
      isActive: UsePathname === "/dashboard/admin" || UsePathname === "/dashboard/admin/",
    },
    {
      title: "Surat Pernyataan",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/admin/submissions",
      isActive: UsePathname.startsWith("/dashboard/admin/submissions"),
    },
    {
      title: "Pengguna",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/admin/users",
      isActive: UsePathname.startsWith("/dashboard/admin/users"),
    },
    {
      title: "Pengaturan",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/admin/settings",
      isActive: UsePathname.startsWith("/dashboard/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                  <>
                    <div>
                      <h1 className="font-bold text-lg text-gray-900">Sitalaris</h1>
                      <p className="text-xs text-gray-500">Admin Panel</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100",
                  collapsed && "rotate-180"
                )}
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                      collapsed && "justify-center px-2",
                      item.isActive && "bg-blue-50 text-blue-600"
                    )}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="font-semibold text-white text-sm">
                  {session?.user?.name?.charAt(0) ?? "A"}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={cn("h-8 w-8", collapsed && "hidden")}
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-500">
                  Selamat datang kembali, {session?.user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}