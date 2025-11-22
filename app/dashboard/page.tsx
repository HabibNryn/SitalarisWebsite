"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Function untuk handle tombol "Mulai Buat Surat"
  const handleCreateDocument = () => {
    router.push("/permohonan");
  };

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Selamat datang, {session.user?.name}!
        </h1>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Permohonan</h3>
            <p className="text-3xl font-bold text-blue-600">Dalam Proses</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kelengkapan Surat</h3>
            <p className="text-3xl font-bold text-yellow-600">Lengkap</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selesai</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
        </div>

          {/* Tombol Mulai Buat Surat */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mulai Buat surat</h2>
          <button
            onClick={handleCreateDocument}
            disabled={status === "loading"}
            className="inline-flex items-center bg-[#0FFCBF] text-gray-900 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#0DE5B0] hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              "Loading..."
            ) : (
              <>
                Mulai Buat Surat
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}