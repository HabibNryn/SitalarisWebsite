"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/Form";
import DownloadPDFButton from "@/app/components/DownloadPDFButton";
import Header from "./components/Header";
import KondisiSelector from "./components/KondisiSelector";
import DataPewarisForm from "./components/DataPewarisForm";
import AhliWarisForm from "./components/AhliWarisForm";
import { formSchema } from "./constants/schemas";
import { defaultDataPewaris, defaultAhliWaris, templateIstri, templateAnakDariIstri } from "./constants/defaultValues";
import { FormValues } from "./types";

export default function FormPernyataanWarisan() {
  const router = useRouter();
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [jumlahCucu, setJumlahCucu] = useState(0);
  const [jumlahSaudara, setJumlahSaudara] = useState(0);
  const [anakPerIstri, setAnakPerIstri] = useState<number[]>([0, 0]);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Ref untuk mencegah multiple submission
  const isProcessing = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kondisi: "",
      dataPewaris: defaultDataPewaris,
      ahliWaris: [],
      tambahanKeterangan: "",
    },
  });

  // Logika berdasarkan kondisi yang dipilih
  useEffect(() => {
    const kondisi = form.watch("kondisi");

    if (!kondisi) {
      setJumlahAnak(0);
      setJumlahCucu(0);
      setJumlahSaudara(0);
      setAnakPerIstri([0, 0]);
      form.setValue("ahliWaris", []);
      return;
    }

    console.log("Kondisi dipilih:", kondisi);

    // Reset dan setup ahli waris berdasarkan kondisi
    if (kondisi === "kondisi1" || kondisi === "kondisi2") {
      // Kondisi 1 & 2: 1 istri + 1 anak
      const dataAnak = {
        ...defaultAhliWaris,
        hubungan: "ANAK" as const,
        keterangan: "Anak dari Istri 1 - Anak 1",
      };
      
      const dataIstri = templateIstri(1);
      
      form.setValue("ahliWaris", [dataAnak, dataIstri]);
      setJumlahAnak(1);
      setJumlahCucu(0);
      setJumlahSaudara(0);
      setAnakPerIstri([1, 0]);
      
    } else if (kondisi === "kondisi3") {
      // Kondisi 3: 1 istri + 2 anak (1 meninggal) + 1 cucu
      const dataAnak1 = {
        ...defaultAhliWaris,
        hubungan: "ANAK" as const,
        keterangan: "Anak dari Istri 1 - Anak 1",
      };
      
      const dataAnak2 = {
        ...defaultAhliWaris,
        hubungan: "ANAK" as const,
        keterangan: "Anak dari Istri 1 - Anak 2",
      };
      
      const dataCucu = {
        ...defaultAhliWaris,
        hubungan: "CUCU" as const,
        keterangan: "Cucu Pewaris",
      };
      
      const dataIstri = templateIstri(1);
      
      form.setValue("ahliWaris", [dataAnak1, dataAnak2, dataCucu, dataIstri]);
      setJumlahAnak(2);
      setJumlahCucu(1);
      setJumlahSaudara(0);
      setAnakPerIstri([2, 0]);
      
    } else if (kondisi === "kondisi4") {
      // Kondisi 4: 2 istri + minimal 2 anak (1 per istri)
      const dataAnakIstri1 = templateAnakDariIstri(1, 1);
      const dataAnakIstri2 = templateAnakDariIstri(2, 1);
      
      const dataIstri1 = templateIstri(1);
      const dataIstri2 = templateIstri(2);
      
      form.setValue("ahliWaris", [dataAnakIstri1, dataAnakIstri2, dataIstri1, dataIstri2]);
      setJumlahAnak(2);
      setJumlahCucu(0);
      setJumlahSaudara(0);
      setAnakPerIstri([1, 1]);
      
    } else if (kondisi === "kondisi5") {
      // Kondisi 5: Suami hidup
      const dataSuami = {
        ...defaultAhliWaris,
        hubungan: "SUAMI" as const,
        statusPernikahan: "MENIKAH" as const,
        keterangan: "Suami Pewaris",
      };
      
      form.setValue("ahliWaris", [dataSuami]);
      setJumlahAnak(0);
      setJumlahCucu(0);
      setJumlahSaudara(0);
      setAnakPerIstri([0, 0]);
      
    } else if (kondisi === "kondisi6") {
      // Kondisi 6: Tidak ada keturunan
      form.setValue("ahliWaris", []);
      setJumlahAnak(0);
      setJumlahCucu(0);
      setJumlahSaudara(0);
      setAnakPerIstri([0, 0]);
      
    } else if (kondisi === "kondisi7") {
      // Kondisi 7: Saudara kandung
      const dataSaudara = {
        ...defaultAhliWaris,
        hubungan: "SAUDARA" as const,
        keterangan: "Saudara Kandung Pewaris",
      };
      
      form.setValue("ahliWaris", [dataSaudara]);
      setJumlahAnak(0);
      setJumlahCucu(0);
      setJumlahSaudara(1);
      setAnakPerIstri([0, 0]);
    }
  }, [form.watch("kondisi")]);

  // Function untuk menambah anak ke istri tertentu (kondisi 4)
  const tambahAnakKeIstri = (istriNumber: number) => {
    const currentAhliWaris = form.getValues("ahliWaris") || [];
    const istriIndices = currentAhliWaris
      .map((data, index) => data.hubungan === "ISTRI" ? index : -1)
      .filter(idx => idx !== -1);
    
    const targetIstriIndex = istriIndices[istriNumber - 1];
    if (targetIstriIndex === undefined) return;

    // Hitung anak untuk istri ini
    const currentAnak = currentAhliWaris.filter(
      (data, index) => data.hubungan === "ANAK" && 
      data.keterangan?.includes(`Istri ${istriNumber}`)
    ).length;
    
    const newAnakNumber = currentAnak + 1;
    const newAnak = templateAnakDariIstri(istriNumber, newAnakNumber);
    
    // Sisipkan anak sebelum istri terkait
    const newAhliWaris = [...currentAhliWaris];
    newAhliWaris.splice(targetIstriIndex, 0, newAnak);
    
    form.setValue("ahliWaris", newAhliWaris);
    setJumlahAnak(prev => prev + 1);
    
    // Update anak per istri
    const newAnakPerIstri = [...anakPerIstri];
    newAnakPerIstri[istriNumber - 1] += 1;
    setAnakPerIstri(newAnakPerIstri);
  };

  // Function untuk menghapus anak dari istri tertentu
  const hapusAnakDariIstri = (anakIndex: number, istriNumber: number) => {
    const currentAhliWaris = form.getValues("ahliWaris") || [];
    const updatedAhliWaris = currentAhliWaris.filter((_, index) => index !== anakIndex);
    
    form.setValue("ahliWaris", updatedAhliWaris);
    setJumlahAnak(prev => Math.max(0, prev - 1));
    
    // Update anak per istri
    const newAnakPerIstri = [...anakPerIstri];
    newAnakPerIstri[istriNumber - 1] = Math.max(0, newAnakPerIstri[istriNumber - 1] - 1);
    setAnakPerIstri(newAnakPerIstri);
  };

  const handleSave = async () => {
    // Cegah multiple submission
    if (isProcessing.current || isSaving) {
      return;
    }

    try {
      isProcessing.current = true;
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Validasi form
      const isValid = await form.trigger();
      
      if (!isValid) {
        const errors = form.formState.errors;
        console.log("Form errors:", errors);
        
        // Temukan field pertama yang error
        const firstError = Object.keys(errors)[0];
        if (firstError) {
          setSaveError(`Harap periksa field: ${firstError}`);
        } else {
          setSaveError("Harap isi semua field yang diperlukan!");
        }
        return;
      }

      // Ambil data dari form
      const data = form.getValues();
      console.log("Data pernyataan warisan:", data);

      // Simpan ke state dengan timeout untuk mencegah UI blocking
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFormData(data);
      setSaveSuccess(true);
      
      // Reset success message setelah 3 detik
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error saving form:", error);
      setSaveError("Terjadi kesalahan saat menyimpan data!");
    } finally {
      setIsSaving(false);
      isProcessing.current = false;
    }
  };

  const handleCancel = () => {
    if (isSaving) {
      if (window.confirm("Proses penyimpanan sedang berjalan. Yakin ingin membatalkan?")) {
        isProcessing.current = false;
        router.back();
      }
    } else {
      router.back();
    }
  };

  const kondisi = form.watch("kondisi");

  return (
    <div className="space-y-6">
      <Header
        title="Form Pernyataan Ahli Waris"
        description="Isi data sesuai kondisi pewaris"
      />

      <Form {...form}>
        <div className="space-y-8">
          <KondisiSelector form={form} />

          {kondisi && <DataPewarisForm form={form} />}

          {kondisi && kondisi !== "kondisi6" && (
            <AhliWarisForm
              form={form}
              jumlahAnak={jumlahAnak}
              jumlahCucu={jumlahCucu}
              jumlahSaudara={jumlahSaudara}
              anakPerIstri={anakPerIstri}
              setJumlahAnak={setJumlahAnak}
              setJumlahCucu={setJumlahCucu}
              setJumlahSaudara={setJumlahSaudara}
              tambahAnakKeIstri={tambahAnakKeIstri}
              hapusAnakDariIstri={hapusAnakDariIstri}
            />
          )}

          {/* Debug info */}
          <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
            <div>Kondisi: {kondisi}</div>
            <div>Total Anak: {jumlahAnak}</div>
            {kondisi === "kondisi4" && (
              <div>
                Anak Istri 1: {anakPerIstri[0]}, Anak Istri 2: {anakPerIstri[1]}
              </div>
            )}
          </div>

          {/* Status messages */}
          {saveError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-in fade-in">
              <p className="text-sm text-red-600 font-medium">Error:</p>
              <p className="text-sm text-red-600 mt-1">{saveError}</p>
              <button
                onClick={() => setSaveError(null)}
                className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
              >
                Tutup
              </button>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md animate-in fade-in">
              <p className="text-sm text-green-600 font-medium">Berhasil!</p>
              <p className="text-sm text-green-600 mt-1">
                Data berhasil disimpan. Anda dapat mendownload PDF sekarang.
              </p>
            </div>
          )}

          {kondisi && (
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                Batal
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Data"
                )}
              </Button>

              {formData && !isSaving && (
                <div className="ml-2">
                  <DownloadPDFButton
                    data={formData}
                    fileName={`Surat-Pernyataan-Ahli-Waris-${formData.dataPewaris.nama}.pdf`}
                  />
                </div>
              )}
            </div>
          )}

          {/* Info penting */}
          {kondisi && !formData && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600 font-medium">Info:</p>
              <p className="text-sm text-blue-600 mt-1">
                Klik <strong>Simpan Data</strong> terlebih dahulu untuk memvalidasi dan menyimpan data.
                Setelah data berhasil disimpan, tombol <strong>Download PDF</strong> akan muncul.
              </p>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}