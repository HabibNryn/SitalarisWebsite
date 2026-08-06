// app/informasi/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  Download, 
  CheckCircle,
  Clock,
  FileCheck,
  Users,
  HelpCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const processSteps = [
  {
    step: 1,
    title: "Pendaftaran & Login",
    description: "Pengguna melakukan login ke sistem dengan akun yang terdaftar",
    icon: <UserCheck className="h-6 w-6" />,
    details: [
      "Buka website Kelurahan Grogol",
      "Klik tombol Login di pojok kanan atas",
      "Masukkan email dan password",
      "Jika belum punya akun, registrasi terlebih dahulu"
    ],
    duration: "5 menit"
  },
  {
    step: 2,
    title: "Pilih Jenis Surat",
    description: "Memilih layanan 'Surat Pernyataan Ahli Waris'",
    icon: <FileText className="h-6 w-6" />,
    details: [
      "Setelah login, akses dashboard pengguna",
      "Pilih menu 'Surat Pernyataan Ahli Waris'",
      "Sistem akan menampilkan form pengisian data"
    ],
    duration: "2 menit"
  },
  {
    step: 3,
    title: "Isi Data Pewaris",
    description: "Mengisi data lengkap almarhum/almahrum",
    icon: <Users className="h-6 w-6" />,
    details: [
      "Nama lengkap pewaris beserta nama ayah",
      "Tempat dan tanggal lahir",
      "Tempat dan tanggal meninggal",
      "Alamat terakhir",
      "Nomor akta kematian",
      "Status pernikahan",
      "Data pernikahan (jika menikah)"
    ],
    duration: "10-15 menit"
  },
  {
    step: 4,
    title: "Isi Data Ahli Waris",
    description: "Mengisi data ahli waris sesuai kondisi",
    icon: <Users className="h-6 w-6" />,
    details: [
      "Pilih kondisi yang sesuai (ada 7 kondisi)",
      "Isi data ahli waris (istri/suami, anak, cucu, dll)",
      "Lengkapi data pribadi setiap ahli waris",
      "Upload dokumen pendukung jika diperlukan"
    ],
    duration: "15-20 menit"
  },
  {
    step: 5,
    title: "Submit & Verifikasi",
    description: "Mengirimkan data untuk diverifikasi admin",
    icon: <ShieldCheck className="h-6 w-6" />,
    details: [
      "Review semua data yang telah diisi",
      "Klik tombol 'Submit'",
      "Tunggu verifikasi dari admin kelurahan",
      "Admin akan memeriksa kelengkapan dokumen"
    ],
    duration: "1-2 hari kerja"
  },
  {
    step: 6,
    title: "Cetak & Download",
    description: "Mendownload surat pernyataan yang sudah disahkan",
    icon: <Download className="h-6 w-6" />,
    details: [
      "Notifikasi email ketika surat disetujui",
      "Login ke dashboard",
      "Download surat dalam format PDF",
      "Cetak surat untuk keperluan administrasi"
    ],
    duration: "5 menit"
  }
];

const conditions = [
  {
    id: "kondisi1",
    title: "Satu Istri, Semua Anak Hidup",
    description: "Pewaris memiliki 1 istri dan semua anak masih hidup",
    details: "Data yang diperlukan: data pewaris, data istri, data anak-anak"
  },
  {
    id: "kondisi2",
    title: "Satu Istri, Ada Anak Meninggal Tanpa Keturunan",
    description: "Ada anak yang telah meninggal tanpa meninggalkan keturunan",
    details: "Data anak yang meninggal beserta akta kematiannya"
  },
  {
    id: "kondisi3",
    title: "Satu Istri, Ada Anak Meninggal Dengan Keturunan",
    description: "Ada anak yang telah meninggal dan meninggalkan keturunan (cucu)",
    details: "Data anak yang meninggal, data pasangannya, dan data cucu"
  },
  {
    id: "kondisi4",
    title: "Menikah Dua Kali",
    description: "Pewaris pernah menikah dua kali",
    details: "Data kedua istri dan anak-anak dari masing-masing istri"
  },
  {
    id: "kondisi5",
    title: "Suami Pewaris Masih Hidup",
    description: "Pewaris perempuan dengan suami masih hidup",
    details: "Data suami dan anak-anak"
  },
  {
    id: "kondisi6",
    title: "Tidak Punya Keturunan (Orang Tua & Saudara)",
    description: "Pewaris tidak memiliki istri/suami maupun anak",
    details: "Data orang tua dan saudara kandung"
  },
  {
    id: "kondisi7",
    title: "Tidak Punya Keturunan (Hanya Saudara)",
    description: "Pewaris hanya meninggalkan saudara kandung",
    details: "Data saudara kandung"
  }
];

const requiredDocuments = [
  {
    title: "Untuk Pewaris",
    items: [
      "Fotokopi KTP almarhum/almahrum",
      "Fotokopi Kartu Keluarga (KK)",
      "Surat keterangan kematian dari rumah sakit/kelurahan",
      "Akta kematian (jika ada)",
      "Fotokopi buku nikah (jika menikah)",
      "Fotokopi akta kelahiran (jika ada)"
    ]
  },
  {
    title: "Untuk Ahli Waris",
    items: [
      "Fotokopi KTP semua ahli waris",
      "Fotokopi Kartu Keluarga (KK)",
      "Fotokopi akta kelahiran anak (untuk kondisi anak)",
      "Fotokopi akta kematian anak (jika ada anak meninggal)",
      "Surat nikah anak (jika anak menikah)"
    ]
  }
];

const faqs = [
  {
    question: "Apa itu Surat Pernyataan Ahli Waris?",
    answer: "Surat Pernyataan Ahli Waris adalah dokumen resmi yang menyatakan hubungan hukum antara pewaris (almarhum/almahrum) dengan ahli warisnya. Surat ini digunakan untuk berbagai keperluan administrasi seperti pengurusan harta warisan, pengalihan aset, dan keperluan hukum lainnya."
  },
  {
    question: "Berapa lama proses pembuatan surat ahli waris?",
    answer: "Proses online memakan waktu 1-2 hari kerja setelah data lengkap diverifikasi. Proses offline di kantor kelurahan memakan waktu 3-5 hari kerja."
  },
  {
    question: "Apakah bisa diwakilkan untuk mengurus surat?",
    answer: "Ya, dengan membawa surat kuasa yang dilegalisir dan dilampiri fotokopi KTP pemberi kuasa serta dokumen-dokumen yang diperlukan."
  },
  {
    question: "Berapa biaya pengurusan surat ahli waris?",
    answer: "Seluruh layanan administrasi di Kelurahan Grogol tidak dipungut biaya (gratis) sesuai dengan Peraturan Daerah tentang Pelayanan Publik."
  },
  {
    question: "Apa saja kondisi yang tersedia dalam sistem?",
    answer: "Tersedia 7 kondisi yang mencakup berbagai situasi pewarisan, mulai dari pewaris dengan satu istri, menikah dua kali, tidak memiliki keturunan, hingga pewaris perempuan dengan suami masih hidup."
  },
  {
    question: "Bagaimana jika ada kesalahan dalam pengisian data?",
    answer: "Anda dapat menghubungi admin melalui halaman kontak atau datang langsung ke kantor kelurahan untuk melakukan koreksi data sebelum surat diproses."
  },
  {
    question: "Apakah surat ini memiliki kekuatan hukum?",
    answer: "Ya, Surat Pernyataan Ahli Waris yang diterbitkan oleh Kelurahan Grogol memiliki kekuatan hukum yang sah dan dapat digunakan untuk keperluan administrasi dan hukum."
  },
  {
    question: "Bagaimana cara mendapatkan bantuan teknis?",
    answer: "Anda dapat menghubungi kami melalui halaman kontak, telepon (021-5678901), atau datang langsung ke kantor selama jam operasional."
  }
];

const benefits = [
  {
    title: "Proses Online",
    description: "Tidak perlu datang ke kantor, semua proses dapat dilakukan dari rumah"
  },
  {
    title: "Cepat & Efisien",
    description: "Proses lebih cepat dibandingkan cara konvensional"
  },
  {
    title: "Dokumen Digital",
    description: "Surat dalam format PDF yang dapat diakses kapan saja"
  },
  {
    title: "Bimbingan Langkah Demi Langkah",
    description: "Sistem akan memandu Anda dari awal sampai akhir"
  }
];

export default function InformasiPage() {
  return (
        <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Informasi Pembuatan Surat Pernyataan Ahli Waris
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Panduan lengkap dan langkah demi langkah untuk membuat Surat Pernyataan Ahli Waris secara online
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Layanan Surat Pernyataan Ahli Waris Online
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                  Kelurahan Grogol menyediakan layanan pembuatan Surat Pernyataan Ahli Waris secara online
                  untuk memudahkan masyarakat dalam mengurus administrasi pewarisan. Layanan ini gratis,
                  cepat, dan dapat diakses kapan saja dari mana saja.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alur Proses */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Alur Pembuatan Surat</h2>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden lg:block"></div>
            
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="flex items-start gap-6">
                    {/* Step number */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">{step.step}</span>
                    </div>
                    
                    {/* Step content */}
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              {step.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                              <p className="text-gray-600">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{step.duration}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Detail Langkah:</h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kondisi yang Tersedia */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Kondisi yang Tersedia</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition) => (
              <Card key={condition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{condition.title}</CardTitle>
                  <CardDescription>{condition.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{condition.details}</p>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {condition.id}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Persyaratan Dokumen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FileCheck className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Persyaratan Dokumen</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {requiredDocuments.map((doc, index) => (
              <Card key={index}>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-xl">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {doc.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Catatan Penting</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Semua dokumen harus fotokopi yang jelas dan terbaca</li>
                    <li>• Bawa dokumen asli untuk verifikasi jika diminta</li>
                    <li>• Dokumen dalam bahasa asing harus diterjemahkan dan dilegalisir</li>
                    <li>• Pastikan data pada dokumen konsisten (nama, tanggal lahir, dll)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Pertanyaan Umum (Q&A)</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <FileCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Siap Membuat Surat Pernyataan Ahli Waris?
                </h2>
                <p className="text-gray-600 mb-6">
                  Ikuti langkah-langkah di atas untuk membuat surat Anda secara online.
                  Jika mengalami kesulitan, tim kami siap membantu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/login">
                      Mulai Proses Online
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/kontak">
                      Butuh Bantuan?
                      <Phone className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>kelurahangrogol@jakarta.go.id</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>021-5678901</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Jl. Kelurahan Grogol No. 123</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}