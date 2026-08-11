"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Tutup menu saat link diklik (mobile)
  const handleLinkClick = () => setIsOpen(false);

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 relative">
        {/* Logo dan Nama */}
        <div className="flex items-center gap-3">
          <Image
            src="/LogoKelurahan.jpg"
            alt="Logo Kelurahan"
            width={45}
            height={45}
            className="rounded-sm"
            priority // opsional, agar gambar cepat dimuat
          />
          <div>
            <h1 className="font-semibold text-lg text-black">Kelurahan Grogol</h1>
            <span className="text-xs text-gray-500">Grogol Petamburan — Jakarta Barat</span>
          </div>
        </div>

        {/* Menu Desktop (muncul di layar ≥ md) */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`${
              isActive("/") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/informasi"
            className={`${
              isActive("/informasi") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"
            }`}
          >
            Informasi
          </Link>
          <Link
            href="/kontak"
            className={`${
              isActive("/kontak") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"
            }`}
          >
            Kontak
          </Link>
        </div>

        {/* Tombol Login (selalu tampil) */}
        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          Login
        </Link>

        {/* Tombol Hamburger (hanya untuk mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 ml-2"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="block w-6 h-0.5 bg-black transition-all"></span>
          <span className="block w-6 h-0.5 bg-black transition-all"></span>
          <span className="block w-6 h-0.5 bg-black transition-all"></span>
        </button>

        {/* Menu Mobile (muncul saat isOpen = true) */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b shadow-lg md:hidden flex flex-col items-center gap-4 py-4 z-50">
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`${
                isActive("/") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/informasi"
              onClick={handleLinkClick}
              className={`${
                isActive("/informasi") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"
              }`}
            >
              Informasi
            </Link>
            <Link
              href="/kontak"
              onClick={handleLinkClick}
              className={`${
                isActive("/kontak") ? "text-blue-600 font-semibold" : "text-black hover:text-blue-600"
              }`}
            >
              Kontak
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}