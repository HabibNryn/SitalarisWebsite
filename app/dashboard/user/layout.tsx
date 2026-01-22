// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={() => setCollapsed((v) => !v)} />
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}