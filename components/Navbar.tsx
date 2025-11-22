"use client";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-30 shadow-sm">
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
            <span className="text-xs text-gray-500">Kecamatan — Kota</span>
          </div>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="text-black hover:text-blue-600">Beranda</Link>
          <Link href="/layanan" className="text-black hover:text-blue-600">Layanan</Link>
          <Link href="/informasi" className="text-black hover:text-blue-600">Informasi</Link>
          <Link href="/kontak" className="text-black hover:text-blue-600">Kontak</Link>
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
