// app/components/Navbar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3">
          <Image
            src="/LogoKelurahan.jpg"
            alt="Logo Kelurahan"
            width={45}
            height={45}
            className="rounded-sm"
          />
          <div>
            <h1 className="font-semibold text-lg text-black">Kelurahan Grogol</h1>
            <span className="text-xs text-gray-500">Grogol Petamburan — Jakarta Barat</span>
          </div>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link 
            href="/" 
            className={`${isActive("/") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"}`}
          >
            Beranda
          </Link>
          <Link 
            href="/informasi" 
            className={`${isActive("/informasi") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"}`}
          >
            Informasi
          </Link>
          <Link 
            href="/kontak" 
            className={`${isActive("/kontak") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"}`}
          >
            Kontak
          </Link>
        </div>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}