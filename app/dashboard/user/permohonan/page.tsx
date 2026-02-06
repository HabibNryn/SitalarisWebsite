// app/dashboard/permohonan/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Schema untuk ahli waris
const ahliWarisSchema = z.object({
  nama: z.string().min(1, "Nama ahli waris harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  agama: z.string().min(1, "Agama harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  nik: z.string().length(16, "NIK harus 16 digit"),
});

// Schema utama
const schema = z.object({
  email: z.string().email("Email tidak valid"),
  nomorTelp: z.string().min(10, "Nomor telepon minimal 10 digit"),
  namaPewaris: z.string().min(1, "Nama pewaris harus diisi"),
  tempatLahirPewaris: z.string().min(1, "Tempat lahir pewaris harus diisi"),
  tanggalLahirPewaris: z.string().min(1, "Tanggal lahir pewaris harus diisi"),
  tempatMeninggalPewaris: z.string().min(1, "Tempat meninggal pewaris harus diisi"),
  tanggalMeninggalPewaris: z.string().min(1, "Tanggal meninggal pewaris harus diisi"),
  nomorAkteKematian: z.string().min(1, "Nomor akte kematian harus diisi"),
  ahliWaris: z.array(ahliWarisSchema).min(1, "Minimal ada 1 ahli waris"),
});

type AhliWaris = z.infer<typeof ahliWarisSchema>;
type FormValues = z.infer<typeof schema>;

export default function FormPermohonan() {
  const [ahliWarisCount, setAhliWarisCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      nomorTelp: "",
      namaPewaris: "",
      tempatLahirPewaris: "",
      tanggalLahirPewaris: "",
      tempatMeninggalPewaris: "",
      tanggalMeninggalPewaris: "",
      nomorAkteKematian: "",
      ahliWaris: [
        {
          nama: "",
          tempatLahir: "",
          tanggalLahir: "",
          pekerjaan: "",
          agama: "",
          alamat: "",
          nik: "",
        }
      ],
    },
  });

  const tambahAhliWaris = () => {
    const currentAhliWaris = form.getValues("ahliWaris");
    form.setValue("ahliWaris", [
      ...currentAhliWaris,
      {
        nama: "",
        tempatLahir: "",
        tanggalLahir: "",
        pekerjaan: "",
        agama: "",
        alamat: "",
        nik: "",
      }
    ]);
    setAhliWarisCount(prev => prev + 1);
  };

  const hapusAhliWaris = (index: number) => {
    const currentAhliWaris = form.getValues("ahliWaris");
    if (currentAhliWaris.length > 1) {
      const newAhliWaris = currentAhliWaris.filter((_, i) => i !== index);
      form.setValue("ahliWaris", newAhliWaris);
      setAhliWarisCount(prev => prev - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("DATA FORM PERMOHONAN:", data);
      alert("Permohonan berhasil dikirim! Kami akan memprosesnya segera.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Form Pendaftaran Surat Pernyataan Ahli Waris
          </h1>
          <p className="text-gray-600">
            Silakan isi formulir berikut untuk mengajukan permohonan surat pernyataan ahli waris.
          </p>
        </div>
      </div>

      {/* Form dalam card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Data Pewaris */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Data Pewaris</h2>
                <p className="text-sm text-gray-500 mt-1">Data almarhum/almarhumah</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email Pemohon</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="email@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nomor Telp/WA */}
                <FormField
                  control={form.control}
                  name="nomorTelp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nomor Telp/WA Pemohon</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="08xxxxxxxxxx" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nama Pewaris */}
                <FormField
                  control={form.control}
                  name="namaPewaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nama Lengkap Pewaris </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nama lengkap pewaris" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tempat Lahir Pewaris */}
                <FormField
                  control={form.control}
                  name="tempatLahirPewaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Tempat Lahir Pewaris</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Kota tempat lahir" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tanggal Lahir Pewaris */}
                <FormField
                  control={form.control}
                  name="tanggalLahirPewaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Tanggal Lahir Pewaris</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tempat Meninggal Pewaris */}
                <FormField
                  control={form.control}
                  name="tempatMeninggalPewaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Tempat Meninggal Pewaris</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Kota tempat meninggal" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tanggal Meninggal Pewaris */}
                <FormField
                  control={form.control}
                  name="tanggalMeninggalPewaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Tanggal Meninggal Pewaris</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nomor Akte Kematian Pewaris */}
                <FormField
                  control={form.control}
                  name="nomorAkteKematian"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nomor Akte Kematian</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nomor akte kematian" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Garis Pemisah */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Data Ahli Waris */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Data Ahli Waris</h2>
                  <p className="text-sm text-gray-500">Data penerima warisan</p>
                </div>
                <Button
                  type="button"
                  onClick={tambahAhliWaris}
                  variant="outline"
                  className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Ahli Waris
                </Button>
              </div>

              {form.watch("ahliWaris").map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">Ahli Waris {index + 1}</h3>
                    {ahliWarisCount > 1 && (
                      <Button
                        type="button"
                        onClick={() => hapusAhliWaris(index)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.nama`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nama lengkap ahli waris" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* NIK Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.nik`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">NIK</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="16 digit NIK" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tempat Lahir Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.tempatLahir`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Tempat Lahir</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Kota tempat lahir" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tanggal Lahir Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.tanggalLahir`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Tanggal Lahir</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pekerjaan Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.pekerjaan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Pekerjaan</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Pekerjaan ahli waris" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Agama Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.agama`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Agama</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Agama ahli waris" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alamat Ahli Waris */}
                    <FormField
                      control={form.control}
                      name={`ahliWaris.${index}.alamat`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Alamat Lengkap</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                              placeholder="Alamat lengkap ahli waris"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? "Mengirim..." : "Ajukan Permohonan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}