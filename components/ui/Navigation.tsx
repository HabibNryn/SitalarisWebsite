// components/ui/Navigation.tsx
"use client";

import { useAuthRedirect } from "@/hooks/AuthRedirect";
import Link from "next/link";

export default function Navigation() {
  const { checkAuthAndRedirect, isLoggedIn, isChecking } = useAuthRedirect();

  const handleNavigation = (path: string) => {
    checkAuthAndRedirect(path);
  };

  return (
    <nav className="flex items-center space-x-4">
      {/* Tombol Login */}
      <button
        onClick={() => handleNavigation("/dashboard")}
        disabled={isChecking}
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isChecking ? "Loading..." : "Login"}
      </button>

      {/* Atau menggunakan Link untuk user yang sudah login */}
      {isLoggedIn && (
        <Link 
          href="/dashboard"
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Dashboard
        </Link>
      )}
    </nav>
  );
}