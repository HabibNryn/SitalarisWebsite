// app/layout.tsx - Perbaiki
import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {/* Tambahkan Navbar di sini */}
          <Navbar />
          {/* Main content */}
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}