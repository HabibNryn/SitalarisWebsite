// /app/dashboard/SuratPernyataan/page.tsx - Versi yang sudah diperbaiki
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/Form"; // Pastikan ini diimpor dengan benar
import Header from "./components/Header";
import KondisiSelector from "./components/KondisiSelector";
import DataPewarisForm from "./components/DataPewarisForm";
import AhliWarisForm from "./components/AhliWarisForm";
import { defaultDataPewaris, formSchema } from "./constants/schemas";
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
      kondisi: "kondisi1",
      dataPewaris: defaultDataPewaris,
      ahliWaris: [],
      tambahanKeterangan: "",
    },
    mode: "onChange", 
  });

  const kondisi = form.watch("kondisi");
  const formValues = form.watch(); // Watch semua nilai form

  const handleSave = async () => {
    let submissionId: string | null = null;
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
      console.log("Data yang akan dikirim:", JSON.stringify(data, null, 2));
      // Simpan ke localStorage atau state
      localStorage.setItem("sitalaris-draft", JSON.stringify(data));

      // Simpan ke database (jika ada API)
      try {
        const response = await fetch("/api/surat-pernyataan/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Error response dari server:", result);
          throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
        }

        submissionId = result?.data?.id || result?.pengajuanId || null;
        console.log("Data saved to database:", result);
      } catch (dbError) {
        console.warn(
          "Database save failed, continuing with local save:",
          dbError,
        );
      }

      console.log("Data saved:", data);
      setFormData(data);
      setSaveSuccess(true);

      // Reset success message setelah 3 detik
      if (submissionId) {
        setTimeout(() => {
          router.push(
            `/dashboard/user/SuratPernyataan/progress?pengajuanId=${submissionId}`,
          );
        }, 2000);
      }
    } catch (error) {
      console.error("Error Details:", error);
      setSaveError(
        error instanceof Error ? error.message : "Gagal menyimpan data",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    form.reset({
      kondisi: undefined,
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
            <KondisiSelector form={form} />

            {/* Step 2: Data Pewaris - hanya muncul jika kondisi dipilih */}
            {kondisi && <DataPewarisForm form={form} />}

            {/* Step 3: Data Ahli Waris - tidak muncul untuk kondisi 6 */}
            {kondisi && kondisi !== "kondisi6" && (
              <AhliWarisForm form={form} />
            )}

            {/* Status Messages */}
            {saveError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {saveError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Data berhasil disimpan!
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
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Data"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Tambahkan style untuk animasi */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
