// app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Cek error dari URL (misal dari callback OAuth)
  useEffect(() => {
    const error = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl");
    
    if (error) {
      // Handle specific OAuth errors
      const errorMessages: Record<string, string> = {
        "OAuthSignin": "Error saat memulai login dengan Google",
        "OAuthCallback": "Error saat callback dari Google",
        "OAuthCreateAccount": "Gagal membuat akun dari Google",
        "EmailCreateAccount": "Gagal membuat akun dari email",
        "Callback": "Error callback",
        "OAuthAccountNotLinked": "Akun Google sudah terhubung dengan email lain. Silakan login dengan email.",
        "EmailSignin": "Error saat mengirim email verifikasi",
        "CredentialsSignin": "Email atau password salah",
        "SessionRequired": "Silakan login terlebih dahulu",
        "Default": "Terjadi kesalahan saat login",
      };
      
      const errorMessage = errorMessages[error] || errorMessages["Default"];
      toast.error("Login Gagal", {
        description: errorMessage,
        duration: 5000,
      });
    }

    // Jika ada callbackUrl dan sudah login, redirect ke sana
    if (callbackUrl && status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [searchParams, status, router]);

  // Redirect jika sudah login
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check user role and redirect 
      const userRole = session.user.role?.toUpperCase();
      
      // Delay sedikit untuk UX yang lebih smooth
      const redirectTimer = setTimeout(() => {
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [status, session, router]);

  // Tampilkan loading state saat checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Memeriksa sesi...</p>
            <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  // Jika sudah login, tampilkan redirect screen
  if (status === "authenticated" && session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center space-y-6 max-w-md px-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Login Berhasil!</h2>
            <p className="text-gray-600 mt-2">Halo, <span className="font-semibold text-blue-600">{session.user.name || session.user.email}</span></p>
            
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              {session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "Administrator" : "User"}
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-500">Mengarahkan ke dashboard...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-xs text-gray-400">SISTEM SITALARIS - Layanan Ahli Waris</p>
          </div>
        </div>
      </div>
    );
  }

  // Render LoginForm component
  return <LoginForm />;
}