"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/AuthRedirect";

export default function Hero() {
const { data: session, status } = useSession();
const router = useRouter();
const { checkAuthAndRedirect, isLoading } = useAuthRedirect();

const handleCreateDocument = () => {
  if (status === "loading") return; // Tunggu sampai status login jelas

  checkAuthAndRedirect("/dashboard");
};

  return (
    <section className="w-full bg-gradient-to-br from-[#106EBE] to-[#0A4A8A] text-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            {/* Tagline */}
            <div className="mb-4">
              <span className="text-[#0FFCBF] font-semibold text-lg tracking-wide">
                Selamat datang di Aplikasi Sitaris
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-6">
              Surat Keterangan
              <span className="block text-[#0FFCBF]">Ahli Waris</span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
              Buat Surat Pernyataan Ahli Waris Secara Cepat Mudah, dan Otomatis. 
              <span className="block mt-2">
                Tidak harus datang ke kantor kelurahan. Pelayanan pembuatan surat 
                keterangan ahli waris yang cepat, mudah, dan terpercaya.
              </span>
            </p>

            {/* Divider */}
            <div className="my-8 w-20 h-1 bg-[#0FFCBF] rounded-full mx-auto lg:mx-0"></div>

            {/* CTA Button */}
            <div className="mt-8">
              <button
                onClick={handleCreateDocument}
                disabled={isLoading}
                className="inline-flex items-center bg-[#0FFCBF] text-gray-900 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#0DE5B0] hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading? (
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

            {/* Features */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0FFCBF] rounded-full"></div>
                <span className="text-blue-100">Cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0FFCBF] rounded-full"></div>
                <span className="text-blue-100">Mudah</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0FFCBF] rounded-full"></div>
                <span className="text-blue-100">Terpercaya</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-4 shadow-2xl">
                {/* Placeholder untuk gambar - ganti dengan Image component Next.js */}
                <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-[#0FFCBF]/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#0FFCBF] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Ilustrasi Surat</p>
                    <p className="text-blue-200 text-sm mt-1">Ahli Waris</p>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#0FFCBF] rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#0FFCBF] rounded-full opacity-40"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm border border-white/30"></div>
              <div className="absolute -top-6 -right-6 w-10 h-10 bg-[#0FFCBF]/30 rounded-full backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}