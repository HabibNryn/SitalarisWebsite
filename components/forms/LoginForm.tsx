"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
  Building2,
  Users,
  FileCheck,
  User,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function AuthForm() {
  const router = useRouter();

  // Mode: 'login' atau 'register'
  const [mode, setMode] = useState<"login" | "register">("login");

  // State form login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // State form register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  // Show/hide password
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // ======== LOGIN HANDLER ========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
    });

    if (res?.error) {
      setLoginError(res.error);
      setLoginLoading(false);
      return;
    }

    // Sukses
    router.push("/dashboard");
  };

  // ======== REGISTER HANDLER ========
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");
    setRegSuccess(false);

    // Validasi sederhana (client-side)
    if (regPassword !== regConfirmPassword) {
      setRegError("Password dan konfirmasi tidak sama");
      setRegLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          confirmPassword: regConfirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      // Sukses
      setRegSuccess(true);
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      // Setelah sukses, alihkan ke mode login setelah 2 detik
      setTimeout(() => {
        setMode("login");
        setRegSuccess(false);
        // Isi email yang baru didaftarkan
        setLoginEmail(regEmail);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRegError(err.message);
      } else {
        setRegError("Terjadi kesalahan tidak diketahui");
      }
    } finally {
      setRegLoading(false);
    }
  };

  // ======== TOGGLE MODE ========
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    // Reset error & success state saat toggle
    setLoginError("");
    setRegError("");
    setRegSuccess(false);
  };

  // ======== RENDER ========
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Auth Form */}
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

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                {mode === "login" ? "Masuk ke Akun Anda" : "Daftar Akun Baru"}
              </h2>
              <p className="text-gray-500 text-center mt-1 text-sm">
                {mode === "login"
                  ? "Akses layanan administrasi desa dengan mudah"
                  : "Buat akun untuk mulai menggunakan layanan"}
              </p>
            </div>

            {/* Error / Success Messages */}
            {mode === "login" && loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" />
                {loginError}
              </div>
            )}
            {mode === "register" && regError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" />
                {regError}
              </div>
            )}
            {mode === "register" && regSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Registrasi berhasil! Mengalihkan ke login...
              </div>
            )}

            {/* ===== FORM LOGIN ===== */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 placeholder-gray-400"
                      placeholder="email@desa.domain"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Masukkan kata sandi"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>
            )}

            {/* ===== FORM REGISTER ===== */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-900"
                      placeholder="Masukkan nama lengkap"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-900"
                      placeholder="email@desa.domain"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-900"
                      placeholder="Minimal 6 karakter, huruf & angka"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showRegConfirm ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-900"
                      placeholder="Masukkan ulang password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm(!showRegConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading || regSuccess}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {regLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Memproses...
                    </>
                  ) : regSuccess ? (
                    "Berhasil ✅"
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <p className="px-4 text-gray-400 text-sm">atau</p>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Login (tetap ada di kedua mode) */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <Image
                src="/google.png"
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="ml-3">
                Masuk dengan Google
              </span>
            </button>

            {/* Toggle Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {mode === "login" ? "Daftar di sini" : "Masuk di sini"}
                </button>
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

      {/* Right Side - Hero (tetap) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Layanan Pembuatan
              <span className="block text-blue-200">
                Surat Keterangan Ahli Waris
              </span>
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Mulai Buat Surat Keterangan Ahli Waris dengan mudah dan cepat
              melalui sistem kami. Dapatkan layanan terpercaya untuk kebutuhan
              administrasi desa Anda.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">
                  {mode === "login"
                    ? "Masuk dengan email dan password"
                    : "Daftar dengan email dan password"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Atau langsung dengan Google</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">
                  {mode === "login"
                    ? "Belum punya akun? Daftar sekarang!"
                    : "Sudah punya akun? Login!"}
                </span>
              </div>
            </div>
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