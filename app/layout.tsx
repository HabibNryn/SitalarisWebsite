// app/layout.tsx - Perbaiki dengan conditional rendering

"use client";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";
import PublicNavbar from "@/components/PublicNavbar"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <ConditionalNavbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

// Komponen client-side untuk menentukan Navbar
import { usePathname } from "next/navigation";
import { Suspense } from "react";

function ConditionalNavbar() {
  // Gunakan Suspense karena usePathname() adalah client component
  return (
    <Suspense fallback={<div className="h-16 bg-gray-100"></div>}>
      <NavbarSelector />
    </Suspense>
  );
}

function NavbarSelector() {
  const pathname = usePathname() || "";

  // Halaman publik yang butuh PublicNavbar
  const publicPages = ["/", "/informasi", "/kontak", "/login"];
  
  // 3. Jika di halaman publik
  if (publicPages.some(path => pathname === path)) {
    return <PublicNavbar />;
  }
  
  // 4. Default: tidak tampilkan navbar
  return null;
}