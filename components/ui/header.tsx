// components/ui/header.tsx - NextAuth Version
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  User,
  Menu,
  Home,
  Settings,
  Shield,
  ChevronDown,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Get user data from session
  const user = session?.user || {
    name: "Loading...",
    email: "",
    role: "USER",
    phone: "",
    isActive: true,
  };

  const notifications = [
    { id: 1, title: "Welcome to SITALARIS", time: "Just now" },
    { id: 2, title: "System updated", time: "2 hours ago" },
  ];

  const handleLogout = () => {
    toast("Apakah Anda yakin ingin keluar?", {
      description: "Anda akan diarahkan ke halaman login.",
      action: {
        label: "Keluar",
        onClick: async () => {
          try {
            await signOut({
              redirect: true,
              callbackUrl: "/login",
            });
            toast.success("Logout berhasil");
          } catch (error) {
            console.error("Logout error:", error);
            toast.error("Gagal logout");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {
        },
      },
      duration: 6000,
    });
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    router.push("/dashboard/profile");
  };

  const handleAdminClick = () => {
    setShowDropdown(false);
    router.push("/dashboard/admin");
  };

  const handleSettingsClick = () => {
    setShowDropdown(false);
    router.push("/dashboard/settings");
  };

  // Show loading state
  if (status === "loading") {
    return <HeaderSkeleton />;
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-gray-800">SITALARIS</h1>
              <p className="text-xs text-gray-500">
                {user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                  ? "Admin Dashboard"
                  : "User Dashboard"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role?.toLowerCase().replace("_", " ")}
                  </span>
                  {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                    <Shield className="w-3 h-3 text-blue-500" />
                  )}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profil Saya
                  </button>

                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </button>

                  {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                    <button
                      onClick={handleAdminClick}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </button>
                  )}
                </div>

                {/* Logout */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(showDropdown || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}
