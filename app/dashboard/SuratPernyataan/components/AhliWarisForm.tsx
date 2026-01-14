import { useState, useMemo, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { FormValues, DataKeluargaType } from "../types";
import FormKeluarga from "./FormKeluarga";
import { kelompokkanKeluarga } from "../utils/keluargaHelper";

interface AhliWarisFormProps {
  form: UseFormReturn<FormValues>;
  jumlahAnak: number;
  jumlahCucu: number;
  jumlahSaudara: number;
  anakPerIstri: number[];
  setJumlahAnak: (value: number | ((prev: number) => number)) => void;
  setJumlahCucu: (value: number | ((prev: number) => number)) => void;
  setJumlahSaudara: (value: number | ((prev: number) => number)) => void;
  tambahAnakKeIstri?: (istriNumber: number) => void;
  hapusAnakDariIstri?: (anakIndex: number, istriNumber: number) => void;
}

export default function AhliWarisForm({
  form,
  jumlahAnak,
  jumlahCucu,
  jumlahSaudara,
  anakPerIstri,
  setJumlahAnak,
  setJumlahCucu,
  setJumlahSaudara,
  tambahAnakKeIstri,
  hapusAnakDariIstri,
}: AhliWarisFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Isolasi ahliWaris ke dalam useMemo terpisah
const ahliWarisValue = form.watch("ahliWaris"); // ✅ Simpan ke variabel
const ahliWaris = useMemo(() => {
  return Array.isArray(ahliWarisValue) ? ahliWarisValue : [];
}, [ahliWarisValue]);
  
  const kondisi = form.watch("kondisi");

  // Kelompokkan data untuk rendering
  const { kelompokIstri } = useMemo(() => 
    kelompokkanKeluarga(ahliWaris), 
    [ahliWaris]
  );

  // Filter anak-anak sekali saja
  const anakList = useMemo(() => 
    ahliWaris.filter((data) => data.hubungan === "ANAK"),
    [ahliWaris]
  );

  // Fungsi untuk mendapatkan indeks anak berdasarkan istri
  const getAnakIndicesForIstri = useCallback((istriIndex: number): number[] => {
    const istriData = ahliWaris[istriIndex];
    if (!istriData || istriData.hubungan !== "ISTRI") return [];

    // Cari anak yang terkait dengan istri ini
    return ahliWaris.reduce((indices, data, index) => {
      if (data.hubungan === "ANAK" && 
          data.keterangan?.includes(`Istri ${kelompokIstri.findIndex(k => k.istriIndex === istriIndex) + 1}`)) {
        indices.push(index);
      }
      return indices;
    }, [] as number[]);
  }, [ahliWaris, kelompokIstri]);

  // Handler untuk menghapus saudara
  const handleHapusSaudara = useCallback((index: number) => {
    const updated = ahliWaris.filter((_, i) => i !== index);
    form.setValue("ahliWaris", updated);
    setJumlahSaudara(prev => Math.max(0, prev - 1));
  }, [ahliWaris, form, setJumlahSaudara]);

  // Handler untuk menambah saudara
  const handleTambahSaudara = useCallback(() => {
    const newSaudara: DataKeluargaType = {
      nama: "",
      namaAyah: "",
      tempatLahir: "",
      tanggalLahir: "",
      pekerjaan: "",
      agama: "",
      alamat: "",
      nik: "",
      jenisKelamin: "LAKI-LAKI",
      statusPernikahan: "BELUM_MENIKAH",
      hubungan: "SAUDARA",
      masihHidup: true,
      memilikiKeturunan: false,
      keterangan: "Saudara Kandung Pewaris",
    };
    form.setValue("ahliWaris", [...ahliWaris, newSaudara]);
    setJumlahSaudara(prev => prev + 1);
  }, [ahliWaris, form, setJumlahSaudara]);

  // Handler untuk menambah anak
  const handleTambahAnak = useCallback(() => {
    const newAnak: DataKeluargaType = {
      nama: "",
      namaAyah: "",
      tempatLahir: "",
      tanggalLahir: "",
      pekerjaan: "",
      agama: "",
      alamat: "",
      nik: "",
      jenisKelamin: "LAKI-LAKI",
      statusPernikahan: "BELUM_MENIKAH",
      hubungan: "ANAK",
      masihHidup: true,
      memilikiKeturunan: false,
      keterangan: `Anak dari Istri 1 - Anak ${jumlahAnak + 1}`,
    };
    form.setValue("ahliWaris", [...ahliWaris, newAnak]);
    setJumlahAnak(prev => prev + 1);
  }, [ahliWaris, form, setJumlahAnak, jumlahAnak]);

  // Handler untuk menghapus anak
  const handleHapusAnak = useCallback((actualIndex: number) => {
    const updated = ahliWaris.filter((_, i) => i !== actualIndex);
    form.setValue("ahliWaris", updated);
    setJumlahAnak(prev => Math.max(0, prev - 1));
  }, [ahliWaris, form, setJumlahAnak]);

  // Render untuk kondisi 5 (Suami masih hidup)
  const renderKondisi5 = useCallback(() => (
    <div className="space-y-6">
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">
          Data Suami Pewaris
        </h4>
        <p className="text-sm text-blue-600">
          Suami pewaris masih hidup dan menjadi ahli waris
        </p>
      </div>
      {ahliWaris.map((_, index) => (
        <div key={index}>
          <FormKeluarga form={form} index={index} hubunganDefault="SUAMI" />
        </div>
      ))}
    </div>
  ), [ahliWaris, form]);

  // Render untuk kondisi 7 (Saudara kandung)
  const renderKondisi7 = useCallback(() => (
    <div className="space-y-6">
      <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-purple-800 mb-2">
          Data Saudara Kandung
        </h4>
        <p className="text-sm text-purple-600">
          Pewaris tidak memiliki keturunan, ahli waris adalah saudara kandung
        </p>
      </div>
      {ahliWaris.map((_, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">
              Saudara {index + 1}
            </h4>
            {ahliWaris.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleHapusSaudara(index)}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Hapus Saudara
              </Button>
            )}
          </div>
          <FormKeluarga form={form} index={index} hubunganDefault="SAUDARA" />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={handleTambahSaudara}
        className="border-purple-300 text-purple-600 hover:bg-purple-50"
      >
        <Plus className="w-4 h-4 mr-2" /> Tambah Saudara Kandung
      </Button>
    </div>
  ), [ahliWaris, form, handleHapusSaudara, handleTambahSaudara]);

  // Render untuk kondisi 6 (Tidak ada keturunan)
  const renderKondisi6 = useCallback(() => (
    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
      <h4 className="font-medium text-yellow-800 mb-2">
        Tidak Ada Ahli Waris
      </h4>
      <p className="text-sm text-yellow-600">
        Pewaris tidak memiliki keturunan. Silakan lanjutkan pengisian data pewaris.
      </p>
    </div>
  ), []);

  // Render untuk kondisi 4 (2 istri)
  const renderKondisi4 = useCallback(() => {
    const anakIndicesIstri1 = kelompokIstri[0] ? getAnakIndicesForIstri(kelompokIstri[0].istriIndex) : [];
    const anakIndicesIstri2 = kelompokIstri[1] ? getAnakIndicesForIstri(kelompokIstri[1].istriIndex) : [];

    return (
      <div className="space-y-8">
        {/* Kelompok Istri 1 dengan Anak-anaknya */}
        {kelompokIstri[0] && (
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-800">
                  Keluarga Istri Pertama
                </h3>
                <p className="text-blue-600 text-sm">
                  Data istri pertama beserta anak-anaknya
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {anakIndicesIstri1.length} Anak
              </span>
            </div>

            {/* Data Istri 1 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-800 mb-4 text-lg">
                Data Istri Pertama
              </h4>
              <FormKeluarga 
                form={form} 
                index={kelompokIstri[0].istriIndex} 
                hubunganDefault="ISTRI" 
              />
            </div>

            {/* Anak-anak Istri 1 */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-medium text-gray-800 text-lg">
                  Anak-anak dari Istri Pertama
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => tambahAnakKeIstri && tambahAnakKeIstri(1)}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Anak
                </Button>
              </div>

              {anakIndicesIstri1.map((anakIndex, idx) => (
                <div key={anakIndex} className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-gray-700">
                      Anak {idx + 1} dari Istri Pertama
                    </h5>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => hapusAnakDariIstri && hapusAnakDariIstri(anakIndex, 1)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Hapus Anak
                    </Button>
                  </div>
                  <FormKeluarga form={form} index={anakIndex} hubunganDefault="ANAK" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kelompok Istri 2 dengan Anak-anaknya */}
        {kelompokIstri[1] && (
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50/30 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-800">
                  Keluarga Istri Kedua
                </h3>
                <p className="text-purple-600 text-sm">
                  Data istri kedua beserta anak-anaknya
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {anakIndicesIstri2.length} Anak
              </span>
            </div>

            {/* Data Istri 2 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-800 mb-4 text-lg">
                Data Istri Kedua
              </h4>
              <FormKeluarga 
                form={form} 
                index={kelompokIstri[1].istriIndex} 
                hubunganDefault="ISTRI" 
              />
            </div>

            {/* Anak-anak Istri 2 */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-medium text-gray-800 text-lg">
                  Anak-anak dari Istri Kedua
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => tambahAnakKeIstri && tambahAnakKeIstri(2)}
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Anak
                </Button>
              </div>

              {anakIndicesIstri2.map((anakIndex, idx) => (
                <div key={anakIndex} className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-gray-700">
                      Anak {idx + 1} dari Istri Kedua
                    </h5>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => hapusAnakDariIstri && hapusAnakDariIstri(anakIndex, 2)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Hapus Anak
                    </Button>
                  </div>
                  <FormKeluarga form={form} index={anakIndex} hubunganDefault="ANAK" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Cucu (jika ada) */}
        {jumlahCucu > 0 && (
          <div className="mt-8 border border-green-200 rounded-lg p-6 bg-green-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Data Cucu Pewaris
            </h3>
            {/* ... render cucu ... */}
          </div>
        )}
      </div>
    );
  }, [kelompokIstri, getAnakIndicesForIstri, form, tambahAnakKeIstri, hapusAnakDariIstri, jumlahCucu]);

  // Render untuk kondisi 1, 2, 3 (satu istri)
  const renderKondisiSingleIstri = useCallback(() => {
    // Buat array anak elements
    const anakElements = anakList.map((_, index) => {
      const actualIndex = ahliWaris.findIndex((item, i) => 
        item.hubungan === "ANAK" && 
        ahliWaris.slice(0, i).filter(it => it.hubungan === "ANAK").length === index
      );

      return (
        <div key={actualIndex} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">
              Anak {index + 1}
            </h4>
            {jumlahAnak > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleHapusAnak(actualIndex)}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Hapus Anak
              </Button>
            )}
          </div>
          <FormKeluarga form={form} index={actualIndex} hubunganDefault="ANAK" />
        </div>
      );
    });

    return (
      <div className="space-y-6">
        {/* Data Anak (semua dari istri 1) */}
        {jumlahAnak > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Data Anak Pewaris
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Jumlah Anak: {jumlahAnak}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTambahAnak}
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Anak
                </Button>
              </div>
            </div>
            {anakElements}
          </div>
        )}

        {/* Data Istri (hanya satu untuk kondisi 1,2,3) */}
        {kelompokIstri[0] && (
          <div className="mt-8 border-2 border-blue-200 rounded-xl p-6 bg-blue-50/30">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Data Istri Pewaris
            </h3>
            <FormKeluarga 
              form={form} 
              index={kelompokIstri[0].istriIndex} 
              hubunganDefault="ISTRI" 
            />
          </div>
        )}

        {/* Data Cucu */}
        {jumlahCucu > 0 && (
          <div className="mt-8 border border-green-200 rounded-lg p-6 bg-green-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Data Cucu Pewaris
            </h3>
            {/* ... render cucu ... */}
          </div>
        )}
      </div>
    );
  }, [anakList, ahliWaris, jumlahAnak, form, handleHapusAnak, handleTambahAnak, kelompokIstri, jumlahCucu]);

  // Render utama berdasarkan kondisi
  const renderAhliWarisForms = useCallback(() => {
    if (!kondisi) return null;

    switch (kondisi) {
      case "kondisi5": // Suami masih hidup
        return renderKondisi5();
      case "kondisi7": // Saudara kandung
        return renderKondisi7();
      case "kondisi6": // Tidak ada keturunan
        return renderKondisi6();
      case "kondisi4": // 2 istri
        return renderKondisi4();
      default: // Kondisi 1, 2, 3 (satu istri)
        return renderKondisiSingleIstri();
    }
  }, [
    kondisi, 
    renderKondisi5, 
    renderKondisi7, 
    renderKondisi6, 
    renderKondisi4, 
    renderKondisiSingleIstri
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Step 3: Data Ahli Waris
        </h2>
        {kondisi === "kondisi4" && (
          <div className="text-sm text-gray-600">
            <span className="text-blue-600 font-medium">Istri 1:</span> {anakPerIstri[0]} anak • 
            <span className="text-purple-600 font-medium ml-2">Istri 2:</span> {anakPerIstri[1]} anak
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="w-4 h-4" /> Sembunyikan Pengaturan
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Pengaturan Lanjutan
            </>
          )}
        </button>
      </div>

      {renderAhliWarisForms()}

      {showAdvanced && (
        <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-3">
            Pengaturan Lanjutan
          </h4>
          <FormField
            control={form.control}
            name="tambahanKeterangan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Keterangan Tambahan
                </FormLabel>
                <FormControl>
                  <textarea
                    value={field.value || ""}
                    onChange={field.onChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tambahkan keterangan jika diperlukan..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}