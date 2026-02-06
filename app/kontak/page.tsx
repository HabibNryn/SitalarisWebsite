// app/kontak/page.tsx

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building,
  Users,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Alamat Kantor",
    details: [
      "Jl. Dr. Nurdin Raya No.41-43 9, RT.9/RW.8, Grogol",
      "Kecamatan Grogol Petamburan",
      "Kota Administrasi Jakarta Barat",
      "DKI Jakarta , 11450",
    ],
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Telepon",
    details: [
      "021-5678901 (Administrasi)",
      "021-5678902 (Pelayanan)",
      "021-5678903 (Informasi)",
    ],
    hours: "Senin - Jumat: 08.00 - 15.00 WIB",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    details: [
      "kelurahangrogol@jakarta.go.id",
      "pelayanangrogol@jakarta.go.id",
      "informasigrogol@jakarta.go.id",
    ],
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Jam Operasional",
    details: [
      "Senin - Kamis: 08.00 - 15.00 WIB",
      "Jumat: 08.00 - 14.30 WIB",
      "Sabtu: 08.00 - 12.00 WIB",
      "Minggu & Hari Libur: Tutup",
    ],
  },
];

const departments = [
  {
    name: "Pelayanan Administrasi",
    person: "Bapak Budi Santoso",
    phone: "021-5678901 ext. 101",
    email: "admin.grogol@jakarta.go.id",
  },
  {
    name: "Bagian Kependudukan",
    person: "Ibu Siti Rahayu",
    phone: "021-5678901 ext. 102",
    email: "kependudukan.grogol@jakarta.go.id",
  },
  {
    name: "Layanan Masyarakat",
    person: "Bapak Ahmad Wijaya",
    phone: "021-5678901 ext. 103",
    email: "layanan.grogol@jakarta.go.id",
  },
  {
    name: "Informasi dan Pengaduan",
    person: "Ibu Rina Permata",
    phone: "021-5678901 ext. 104",
    email: "pengaduan.grogol@jakarta.go.id",
  },
];

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi pengiriman form
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message setelah 5 detik
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Kelurahan Grogol siap melayani dan membantu kebutuhan administrasi
              masyarakat
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                </div>
                <CardDescription>
                  Isi form di bawah untuk mengajukan pertanyaan, saran, atau
                  pengaduan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Pesan Terkirim!
                    </h3>
                    <p className="text-gray-600">
                      Terima kasih telah menghubungi kami. Tim kami akan
                      merespons secepat mungkin.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nama@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="08xx-xxxx-xxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subjek *
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Keperluan menghubungi"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pesan *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tuliskan pesan Anda di sini..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Departments Contact */}
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl">Kontak Per Bagian</CardTitle>
                </div>
                <CardDescription>
                  Hubungi langsung bagian yang sesuai dengan kebutuhan Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {dept.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          {dept.person}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          {dept.phone}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          {dept.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">
                        {info.title}
                      </h3>
                      <div className="space-y-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">
                            {detail}
                          </p>
                        ))}
                        {info.hours && (
                          <p className="text-sm text-blue-600 font-medium mt-3">
                            {info.hours}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map Location */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Building className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl">Lokasi Kantor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {/* Placeholder for Google Maps */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl h-96">
                        {/* Google Maps Embed */}
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.787138621146!2d106.79008672046847!3d-6.159256860891303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5141129e7539ab5%3A0x630e979ab703154!2sKantor%20Lurah%20Grogol!5e0!3m2!1sid!2sid!4v1770367235740!5m2!1sid!2sid"
                          width="400"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full mt-4">
                  <a
                    href="https://maps.google.com/?q=Kelurahan+Grogol+Jakarta+Barat"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Buka di Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Kontak Darurat
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Untuk keperluan darurat di luar jam operasional
                  </p>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-red-600">112</p>
                    <p className="text-sm text-gray-600">
                      Nomor Darurat Nasional
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
