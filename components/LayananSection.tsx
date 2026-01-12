import { UserPlus, ClipboardList, Clock } from "lucide-react";

export default function LayananSection() {
  const layanan = [
    {
      icon: <UserPlus size={40} className="text-blue-700" />,
      title: "Pembuatan Akun",
      desc: "Login ke dalam sistem degan membuat email dan password atau login dengan menggunakan google.",
    },
    {
      icon: <ClipboardList size={40} className="text-blue-700" />,
      title: "Isi data diri",
      desc: "Isi formulir pengajuan surat dengan data diri yang lengkap dan benar.",
    },
    {
      icon: <Clock size={40} className="text-blue-700" />,
      title: "TUnggu Verifikasi",
      desc: "Tunggu proses verifikasi dari admin kami dan surat akan dikirimkan ke email anda.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-black">
          Cara Membuat Surat
        </h2>
        <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
          Berikut adalah cara membuat surat pernyataan ahli waris
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {layanan.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 shadow rounded-xl text-center hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-black">{item.title}</h3>
              <p className="text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
