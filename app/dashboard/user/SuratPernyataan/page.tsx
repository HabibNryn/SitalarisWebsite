// /app/dashboard/SuratPernyataan/page.tsx - Versi yang sudah diperbaiki
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/Form"; // Pastikan ini diimpor dengan benar
import DownloadPDFButton from "./components/DownloadPDFButton";
import Header from "./components/Header";
import KondisiSelector from "./components/KondisiSelector";
import DataPewarisForm from "./components/DataPewarisForm";
import AhliWarisForm from "./components/AhliWarisForm";
import { formSchema } from "./constants/schemas";
import { defaultDataPewaris } from "./constants/defaultValues";
import { FormValues } from "./types";

export default function FormPernyataanWarisan() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kondisi: "",
      dataPewaris: defaultDataPewaris,
      ahliWaris: [],
      tambahanKeterangan: "",
    },
    mode: "onChange", // Tambahkan mode untuk validasi real-time
  });

  const kondisi = form.watch("kondisi");
  const formValues = form.watch(); // Watch semua nilai form

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Validasi semua field
      const isValid = await form.trigger();

      if (!isValid) {
        setSaveError("Harap lengkapi semua field yang diperlukan");
        return;
      }

      const data = form.getValues();
      
      // Simpan ke localStorage atau state
      localStorage.setItem('sitalaris-draft', JSON.stringify(data));
      
      // Simpan ke database (jika ada API)
      try {
        const response = await fetch('/api/surat-pernyataan/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Gagal menyimpan ke database');
        }

        const savedData = await response.json();
        console.log("Data saved to database:", savedData);
      } catch (dbError) {
        console.warn("Database save failed, continuing with local save:", dbError);
      }

      console.log("Data saved:", data);
      setFormData(data);
      setSaveSuccess(true);

      // Reset success message setelah 3 detik
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setSaveError(error instanceof Error ? error.message : "Gagal menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    form.reset({
      kondisi: "",
      dataPewaris: defaultDataPewaris,
      ahliWaris: [],
      tambahanKeterangan: "",
    });
    setFormData(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  // Cek apakah form valid untuk download
  const isFormValid = () => {
    return form.formState.isValid && formData !== null;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Header
        title="Form Pernyataan Ahli Waris"
        description="Isi data sesuai kondisi pewaris"
      />

      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Step 1: Pilih Kondisi */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Step 1: Pilih Kondisi Pewaris
              </h2>
              <KondisiSelector form={form} />
            </div>

            {/* Step 2: Data Pewaris - hanya muncul jika kondisi dipilih */}
            {kondisi && (
              <DataPewarisForm form={form} />
            )}

            {/* Step 3: Data Ahli Waris - tidak muncul untuk kondisi 6 */}
            {kondisi && kondisi !== "kondisi6" && (
              <AhliWarisForm 
                form={form}
                jumlahAnak={formValues.ahliWaris?.filter(item => item?.hubungan === "ANAK").length || 0}
                jumlahCucu={formValues.ahliWaris?.filter(item => item?.hubungan === "CUCU").length || 0}
                jumlahSaudara={formValues.ahliWaris?.filter(item => item?.hubungan === "SAUDARA").length || 0}
                anakPerIstri={[0, 0]} // Ini perlu disesuaikan dengan logika Anda
                setJumlahAnak={() => {}} // Tambahkan fungsi-fungsi ini
                setJumlahCucu={() => {}}
                setJumlahSaudara={() => {}}
              />
            )}

            {/* Status Messages */}
            {saveError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{saveError}</p>
                  </div>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Data berhasil disimpan! Sekarang Anda dapat mendownload PDF.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-6 pt-8 border-t border-gray-200">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Kembali
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Reset Form
                </Button>

                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Data"
                  )}
                </Button>
              </div>

              {/* Download PDF Button */}
              {formData && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-blue-900">Download Dokumen</h3>
                      <p className="text-sm text-blue-700">
                        Data sudah tersimpan. Klik tombol di bawah untuk mendownload Surat Pernyataan dalam format PDF.
                      </p>
                    </div>
                    <DownloadPDFButton
                      data={formData}
                      disabled={!isFormValid()}
                      onSuccess={() => {
                        console.log("PDF berhasil diunduh");
                      }}
                      onError={(error) => {
                        console.error("Download error:", error);
                        setSaveError("Gagal mengunduh PDF. Silakan coba lagi.");
                      }}
                    />
                  </div>
                </div>
              )}

              {!formData && kondisi && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Klik <strong className="font-semibold">Simpan Data</strong> terlebih dahulu untuk validasi data. 
                          Setelah data berhasil disimpan, tombol download PDF akan muncul di sini.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Tambahkan style untuk animasi */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}