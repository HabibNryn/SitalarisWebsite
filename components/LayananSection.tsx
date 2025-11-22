import { FileText, Users, Stamp } from "lucide-react";

export default function LayananSection() {
  const layanan = [
    {
      icon: <FileText size={40} className="text-blue-700" />,
      title: "Surat Keterangan Ahli Waris",
      desc: "Pengajuan surat ahli waris dengan sistem verifikasi cepat dan otomatis.",
    },
    {
      icon: <Users size={40} className="text-blue-700" />,
      title: "Layanan Kependudukan",
      desc: "Meliputi pembuatan surat domisili, pindah datang, dan keterangan lainnya.",
    },
    {
      icon: <Stamp size={40} className="text-blue-700" />,
      title: "Legalisasi Dokumen",
      desc: "Layanan legalisasi dokumen secara online dengan verifikasi ketua RT/RW.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-black">
          Layanan Kelurahan
        </h2>
        <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
          Pilih jenis layanan yang tersedia untuk memulai proses administrasi.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {layanan.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 shadow rounded-xl text-center hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
