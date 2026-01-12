// app/dashboard/page.tsx (Update tanpa Card component)
"use client";

import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();


  

  const recentActivities = [
    { id: 1, title: "Pendaftaran Akun", description: "Akun Anda telah terdaftar", time: "2 hari yang lalu", status: "completed" },
    { id: 2, title: "Verifikasi Email", description: "Email telah diverifikasi", time: "1 hari yang lalu", status: "completed" },
    { id: 3, title: "Lengkapi Data Diri", description: "Data diri Anda belum lengkap", time: "5 jam yang lalu", status: "pending" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Selamat Datang di SITALARIS</h1>
            <p className="text-gray-600 mt-2">
              Sistem Pengajuan Surat Izin Administrasi Layanan Aplikasi Rumah Sakit
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Silakan lengkapi data diri Anda untuk mulai mengajukan permohonan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Status: Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
              <p className="text-sm text-gray-600">Riwayat aktivitas akun Anda</p>
            </div>
            <button 
              onClick={() => router.push("/dashboard/aktivitas")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${
                activity.status === "completed" ? "bg-green-100" : "bg-yellow-100"
              }`}>
                {activity.status === "completed" ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </div>
                {activity.status === "pending" && (
                  <Button
                    size="sm"
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/dashboard/data-diri")}
                  >
                    Lengkapi Sekarang
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Akses Cepat</h2>
          <p className="text-sm text-gray-600">Fitur utama yang bisa Anda akses</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push("/dashboard/permohonan")}
            className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-blue-600 font-medium">Buat Permohonan Baru</div>
                <p className="text-sm text-gray-600 mt-1">Ajukan surat keterangan waris</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/status-surat")}
            className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-green-600 font-medium">Lihat Status</div>
                <p className="text-sm text-gray-600 mt-1">Cek status permohonan Anda</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/data-diri")}
            className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-purple-600 font-medium">Data Diri</div>
                <p className="text-sm text-gray-600 mt-1">Kelola profil dan data pribadi</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/bantuan")}
            className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-orange-600 font-medium">Panduan</div>
                <p className="text-sm text-gray-600 mt-1">Download panduan penggunaan</p>
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
}