"use client";

import { useState, useEffect } from "react";
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
import { getAnakPerIstri } from "./utils/keluargaHelper";

export default function FormPernyataanWarisan() {
  const router = useRouter();
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [jumlahCucu, setJumlahCucu] = useState(0);
  const [jumlahSaudara, setJumlahSaudara] = useState(0);
  const [anakPerIstri, setAnakPerIstri] = useState<number[]>([0, 0]); // Untuk kondisi 4
  const [formData, setFormData] = useState<FormValues | null>(null);

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
      setAnakPerIstri([1, 1]); // 1 anak per istri
      
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
    
    // Sisipkan anak sebelum istri terkait (untuk pengelompokan visual)
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

  const onSubmit = async (data: FormValues) => {
    console.log("Data pernyataan warisan:", data);

    try {
      const isValid = await form.trigger();

      if (!isValid) {
        alert("Harap isi semua field yang diperlukan!");
        return;
      }
      setFormData(data);
      alert("Data berhasil disimpan! Anda dapat mendownload PDF sekarang.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data!");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <KondisiSelector form={form} />

          {kondisi && <DataPewarisForm form={form} />}

          {kondisi && kondisi !== "kondisi6" && (
            <AhliWarisForm
              form={form}
              jumlahAnak={jumlahAnak}
              jumlahCucu={jumlahCucu}
              jumlahSaudara={jumlahSaudara}
              anakPerIstri={anakPerIstri} // Pass new prop
              setJumlahAnak={setJumlahAnak}
              setJumlahCucu={setJumlahCucu}
              setJumlahSaudara={setJumlahSaudara}
              tambahAnakKeIstri={tambahAnakKeIstri} // Pass new function
              hapusAnakDariIstri={hapusAnakDariIstri} // Pass new function
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

          {kondisi && (
            <div className="flex justify-end gap-3 pt-6">
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
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Menyimpan..."
                  : "Simpan & Generate PDF"}
              </Button>

              {formData && (
                <DownloadPDFButton
                  data={formData}
                  fileName={`Surat-Pernyataan-Ahli-Waris-${formData.dataPewaris.nama}.pdf`}
                />
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}