export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">Tidak Diizinkan</h1>
      <p className="mt-2 text-gray-700">
        Anda tidak memiliki akses ke halaman ini.
      </p>
    </div>
  );
}
