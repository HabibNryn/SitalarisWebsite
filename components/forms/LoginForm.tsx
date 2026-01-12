// components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ShieldCheck, Building2, Users, FileCheck } from "lucide-react";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah");
      return;
    }

    // Redirect ke dashboard setelah login berhasil
    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setError("Login dengan Google gagal");
        setGoogleLoading(false);
        return;
      }

      // Jika login berhasil, NextAuth akan otomatis redirect ke callbackUrl
      if (result?.url) {
        router.push(result.url);
      } else {
        router.push("/dashboard");
      }
      
    } catch (error) {
      setError("Terjadi kesalahan saat login dengan Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SITALARIS
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Surat Keterangan Ahli Waris Online Terpercaya
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <FileCheck className="w-4 h-4 mr-1 text-green-500" />
                Terintegrasi
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 mr-1 text-blue-500" />
                Aman
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Masuk ke Akun Anda
              </h2>
              <p className="text-gray-500 text-center mt-1 text-sm">
                Akses layanan administrasi desa dengan mudah
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    placeholder="email@desa.domain"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <p className="px-4 text-gray-400 text-sm">atau lanjut dengan</p>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <Image
                  src="/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              )}
              <span className="ml-3">
                {googleLoading ? "Memproses..." : "Masuk dengan Google"}
              </span>
            </button>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Belum Punya Akun?{" "}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Daftar Disini
                </a>
              </p>
            </div>
          </div>

          {/* Government Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>Sistem Terverifikasi Kementerian Desa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            {/* Government Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Layanan Pembuatan
              <span className="block text-blue-200">Surat Keterangan Ahli Waris</span>
            </h2>

            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Mulai Buat Surat Keterangan Ahli Waris dengan mudah dan cepat melalui
              sistem kami. Dapatkan layanan terpercaya untuk kebutuhan administrasi
              desa Anda.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Masuk Dengan Alamat Email dan Password</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Atau Langsung Masuk Dengan Akun Google Anda</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Jika Belum Mempunyai Akun, Daftar dengan menekan `Daftar Disini`</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Lalu Anda Akan Diarahkan Ke Halaman Dashboard</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">Resmi</div>
                <div className="text-blue-200 text-sm">Dari Pemerintah</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Aman</div>
                <div className="text-blue-200 text-sm">Data Suratnya</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Cepat</div>
                <div className="text-blue-200 text-sm">Pengurusannya</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}