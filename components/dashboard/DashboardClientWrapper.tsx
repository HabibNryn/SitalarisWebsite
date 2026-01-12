// components/dashboard/DashboardClientWrapper.tsx
"use client";

import { useState } from "react";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import ProfileForm from "@/components/forms/ProfileForm";

export default function DashboardClientWrapper() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={() => setCollapsed((v) => !v)} />
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 p-4 md:p-8 space-y-6">
          {/* Bagian HeroSpline dihapus sesuai permintaan */}
          
          {/* Welcome Section */}
          <section className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Selamat Datang di SITALARIS</h1>
                <p className="text-gray-600 mt-2">
                  Sistem Pembuatan Surat Pernyataan Ahli Waris secara online.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">Status: Aktif</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                <div className="text-blue-600 font-medium">📋 Buat Surat Baru</div>
                <p className="text-sm text-gray-600 mt-1">Ajukan permohonan surat baru</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                <div className="text-green-600 font-medium">📁 Lihat Berkas</div>
                <p className="text-sm text-gray-600 mt-1">Cek status berkas Anda</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors">
                <div className="text-purple-600 font-medium">📊 Status Surat</div>
                <p className="text-sm text-gray-600 mt-1">Pantau perkembangan surat</p>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                <div className="text-orange-600 font-medium">ℹ️ Bantuan</div>
                <p className="text-sm text-gray-600 mt-1">Panduan penggunaan sistem</p>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}