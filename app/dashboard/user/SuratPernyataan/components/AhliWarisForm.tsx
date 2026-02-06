"use client";

import { useEffect } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users, UserPlus, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { FormValues, KondisiType } from "../types";
import FormKeluarga from "./FormKeluarga";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getKondisiLabel, getHubunganLabel } from "../constants/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  form: UseFormReturn<FormValues>;
}

export default function AhliWarisForm({ form }: Props) {
  const kondisi = form.watch("kondisi");
  const dataPewaris = form.watch("dataPewaris");
  const ahliWaris = form.watch("ahliWaris") || [];
  type AhliWarisItem = FormValues["ahliWaris"][number];

  const { append, remove, replace } = useFieldArray({
    control: form.control,
    name: "ahliWaris",
  });

  // Validasi errors
  const errors = form.formState.errors;

  /* =====================================================
     USE EFFECT UNTUK SEED DATA AWAL - DIUPDATE
  ===================================================== */
  useEffect(() => {
    if (!kondisi || ahliWaris.length > 0) return;

    const baseData = (
      hubungan: AhliWarisItem["hubungan"],
      keterangan: string,
      jenisKelamin: AhliWarisItem["jenisKelamin"] = "LAKI-LAKI",
      statusPernikahan: AhliWarisItem["statusPernikahan"] = "BELUM_MENIKAH"
    ): AhliWarisItem => ({
      nama: "",
      namaAyah: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamat: "",
      nik: "",
      pekerjaan: "",
      agama: "",
      jenisKelamin,
      statusPernikahan,
      hubungan,
      statusHidup: "HIDUP",
      memilikiKeturunan: false,
      keterangan,
    });

    const isPewarisPerempuan = dataPewaris?.jenisKelamin === "PEREMPUAN";

    switch (kondisi as KondisiType) {
      case "kondisi1": // 1 istri, semua anak hidup
      case "kondisi2": // 1 istri, ada anak meninggal
      case "kondisi3": // 1 istri, ada anak meninggal + cucu
        if (!isPewarisPerempuan) {
          replace([
            {
              ...baseData("ISTRI", "Istri Pewaris", "PEREMPUAN", "MENIKAH"),
              statusHidup: "HIDUP",
            },
          ]);
        }
        break;

      case "kondisi4": // 2 istri
        if (!isPewarisPerempuan) {
          replace([
            {
              ...baseData("ISTRI", "Istri Pertama", "PEREMPUAN", "MENIKAH"),
              urutan: 1,
              asalIstri: "PERTAMA",
              statusHidup: "HIDUP",
            },
            {
              ...baseData("ISTRI", "Istri Kedua", "PEREMPUAN", "MENIKAH"),
              urutan: 2,
              asalIstri: "KEDUA",
              statusHidup: "HIDUP",
            },
          ]);
        }
        break;

      case "kondisi5": // suami hidup
        if (isPewarisPerempuan) {
          replace([
            {
              ...baseData("SUAMI", "Suami Pewaris", "LAKI-LAKI", "MENIKAH"),
              statusHidup: "HIDUP",
            },
          ]);
        }
        break;

      case "kondisi7": // saudara kandung
        replace([
          {
            ...baseData("SAUDARA", "Saudara Kandung", "LAKI-LAKI", "BELUM_MENIKAH"),
            statusHidup: "HIDUP",
            memilikiKeturunan: false,
          },
        ]);
        break;

      case "kondisi6": // tidak ada ahli waris (tidak memiliki keturunan)
        // Kosongkan ahli waris untuk kondisi 6
        replace([]);
        break;
    }
  }, [kondisi, ahliWaris.length, replace, dataPewaris?.jenisKelamin]);

  /* =====================================================
     VALIDASI OTOMATIS JENIS KELAMIN BERDASARKAN HUBUNGAN
  ===================================================== */
  useEffect(() => {
    ahliWaris.forEach((item, index) => {
      // Otomatis set jenis kelamin berdasarkan hubungan
      if (item.hubungan === "ISTRI" && item.jenisKelamin !== "PEREMPUAN") {
        form.setValue(`ahliWaris.${index}.jenisKelamin`, "PEREMPUAN");
      }

      if (item.hubungan === "SUAMI" && item.jenisKelamin !== "LAKI-LAKI") {
        form.setValue(`ahliWaris.${index}.jenisKelamin`, "LAKI-LAKI");
      }
    });
  }, [ahliWaris, form]);

  /* =====================================================
     FUNGSI TAMBAH DATA
  ===================================================== */
  const tambahData = (
    hubungan: AhliWarisItem["hubungan"],
    keterangan: string,
    jenisKelamin: AhliWarisItem["jenisKelamin"] = "LAKI-LAKI",
    statusPernikahan: AhliWarisItem["statusPernikahan"] = "BELUM_MENIKAH"
  ) => {
    append({
      nama: "",
      namaAyah: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamat: "",
      nik: "",
      pekerjaan: "",
      agama: "",
      jenisKelamin,
      statusPernikahan,
      hubungan,
      statusHidup: "HIDUP",
      memilikiKeturunan: false,
      keterangan,
    });
  };

  const tambahAnak = (asalIstri: "PERTAMA" | "KEDUA" = "PERTAMA") => {
    const keterangan = asalIstri === "PERTAMA" 
      ? "Anak dari Istri Pertama" 
      : "Anak dari Istri Kedua";
    
    append({
      nama: "",
      namaAyah: dataPewaris.nama,
      tempatLahir: "",
      tanggalLahir: "",
      alamat: dataPewaris.alamat || "",
      nik: "",
      pekerjaan: "",
      agama: dataPewaris.agama || "",
      jenisKelamin: "LAKI-LAKI",
      statusPernikahan: "BELUM_MENIKAH",
      hubungan: "ANAK" as const,
      statusHidup: "HIDUP",
      memilikiKeturunan: false,
      keterangan,
      asalIstri: kondisi === "kondisi4" ? asalIstri : undefined,
    });
  };

  const tambahSaudara = () => {
    tambahData("SAUDARA", "Saudara Kandung");
  };

  const tambahCucu = () => {
    tambahData("CUCU", "Cucu Pewaris");
  };

  const tambahIstri = (urutan: number = 1) => {
    if (dataPewaris?.jenisKelamin === "LAKI-LAKI") {
      const keterangan = urutan === 1 ? "Istri Pertama" : "Istri Kedua";
      append({
        nama: "",
        namaAyah: "",
        tempatLahir: "",
        tanggalLahir: "",
        alamat: dataPewaris.alamat || "",
        nik: "",
        pekerjaan: "",
        agama: dataPewaris.agama || "",
        jenisKelamin: "PEREMPUAN",
        statusPernikahan: "MENIKAH",
        hubungan: "ISTRI" as const,
statusHidup: "HIDUP",  
        memilikiKeturunan: false,
        keterangan,
        urutan,
        asalIstri: urutan === 1 ? "PERTAMA" : "KEDUA",
      });
    }
  };

  /* =====================================================
     FUNGSI UNTUK MENGATUR STATUS HIDUP
  ===================================================== */
  const toggleStatusHidup = (index: number) => {
    const currentValue = form.getValues(`ahliWaris.${index}.statusHidup`);
    form.setValue(`ahliWaris.${index}.statusHidup`, currentValue === "HIDUP" ? "MENINGGAL" : "HIDUP");
  };

  const toggleMemilikiKeturunan = (index: number) => {
    const currentValue = form.getValues(`ahliWaris.${index}.memilikiKeturunan`);
    form.setValue(`ahliWaris.${index}.memilikiKeturunan`, !currentValue);
  };

  /* =====================================================
     LOGIKA TOMBOL TAMBAH BERDASARKAN KONDISI
  ===================================================== */
  // Hitung jumlah berdasarkan kondisi saat ini
  const istriList = ahliWaris.filter((item) => item.hubungan === "ISTRI");
  const suamiList = ahliWaris.filter((item) => item.hubungan === "SUAMI");
  const anakList = ahliWaris.filter((item) => item.hubungan === "ANAK");
  const saudaraList = ahliWaris.filter((item) => item.hubungan === "SAUDARA");
  const cucuList = ahliWaris.filter((item) => item.hubungan === "CUCU");

  // Tentukan tombol mana yang harus ditampilkan berdasarkan kondisi
  const showTambahIstri =
    dataPewaris?.jenisKelamin === "LAKI-LAKI" &&
    istriList.length < 2 &&
    ["kondisi1", "kondisi2", "kondisi3", "kondisi4"].includes(kondisi);

  const showTambahSuami =
    dataPewaris?.jenisKelamin === "PEREMPUAN" &&
    suamiList.length === 0 &&
    kondisi === "kondisi5";

  const showTambahAnak = [
    "kondisi1",
    "kondisi2",
    "kondisi3",
    "kondisi4",
    "kondisi5",
  ].includes(kondisi);

  const showTambahSaudara = kondisi === "kondisi7";
  const showTambahCucu = kondisi === "kondisi3";

  /* =====================================================
     RENDER UTAMA
  ===================================================== */
  return (
    <div className="space-y-6">
      {/* Validation Warning */}
      {errors.ahliWaris || errors.dataPewaris ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.ahliWaris?.message ||
              "Ada data yang belum lengkap. Harap periksa semua field yang diperlukan."}
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Header dengan statistik */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Data Ahli Waris
            <Badge variant="outline" className="ml-2">
              {ahliWaris.length} Orang
            </Badge>
          </CardTitle>
          <CardDescription className="space-y-1">
            <span>
              Kondisi: <strong>{getKondisiLabel(kondisi)}</strong>
            </span>
            <span className="text-xs text-gray-500">
              Jenis Kelamin Pewaris:{" "}
              <strong>{dataPewaris?.jenisKelamin || "Belum ditentukan"}</strong>
              {dataPewaris?.jenisKelamin === "LAKI-LAKI" && (
                <span className="ml-2">(Istri maksimal: 2)</span>
              )}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {istriList.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {istriList.length} Istri
                {kondisi === "kondisi4" && " (2 Istri)"}
              </Badge>
            )}
            {suamiList.length > 0 && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {suamiList.length} Suami
              </Badge>
            )}
            {anakList.length > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {anakList.length} Anak
                {anakList.some(a => a.statusHidup === "MENINGGAL") && " (termasuk almarhum)"}
              </Badge>
            )}
            {saudaraList.length > 0 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                {saudaraList.length} Saudara
              </Badge>
            )}
            {cucuList.length > 0 && (
              <Badge variant="outline" className="bg-cyan-50 text-cyan-700">
                {cucuList.length} Cucu
              </Badge>
            )}
          </div>

          {/* Instruction berdasarkan kondisi */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
            <p className="text-gray-600 mb-2">
              <strong>Petunjuk Pengisian untuk {getKondisiLabel(kondisi)}:</strong>
            </p>
            {kondisi === "kondisi1" && (
              <ul className="list-disc pl-4 text-gray-600">
                <li>Semua anak harus masih hidup (centang Masih Hidup)</li>
                <li>Anak tidak boleh memiliki keturunan</li>
              </ul>
            )}
            {kondisi === "kondisi2" && (
              <ul className="list-disc pl-4 text-gray-600">
                <li>Harus ada minimal 1 anak yang meninggal (hapus centang Masih Hidup)</li>
                <li>Anak yang meninggal tidak boleh memiliki keturunan</li>
              </ul>
            )}
            {kondisi === "kondisi3" && (
              <ul className="list-disc pl-4 text-gray-600">
                <li>Harus ada anak yang meninggal</li>
                <li>Anak yang meninggal harus memiliki keturunan (cucu)</li>
                <li>Tambahkan cucu dengan tombol Tambah Cucu</li>
              </ul>
            )}
            {kondisi === "kondisi4" && (
              <ul className="list-disc pl-4 text-gray-600">
                <li>Pewaris memiliki 2 istri</li>
                <li>Pastikan setiap anak memiliki asal istri yang benar</li>
              </ul>
            )}
            {kondisi === "kondisi5" && (
              <ul className="list-disc pl-4 text-gray-600">
                <li>Suami harus masih hidup</li>
                <li>Semua anak harus masih hidup</li>
              </ul>
            )}
            {kondisi === "kondisi6" && (
              <p className="text-gray-600">
                Pewaris tidak memiliki keturunan. Tidak perlu menambahkan ahli waris.
              </p>
            )}
            {kondisi === "kondisi7" && (
              <ul className="list-disc pl-4 text-gray-600">
                <li>Pewaris hanya memiliki saudara kandung</li>
                <li>Tidak ada istri/suami/anak/cucu</li>
              </ul>
            )}
          </div>

          {/* Tombol tambah berdasarkan kondisi */}
          <div className="flex flex-wrap gap-3 mt-4">
            {showTambahIstri && (
              <Button
                type="button"
                variant="outline"
                onClick={() => tambahIstri(istriList.length + 1)}
                className="border-blue-300 text-blue-600"
                disabled={istriList.length >= 2}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Istri {istriList.length > 0 ? `(${istriList.length + 1})` : ""}
              </Button>
            )}

            {showTambahSuami && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  append({
                    nama: "",
                    namaAyah: "",
                    tempatLahir: "",
                    tanggalLahir: "",
                    alamat: dataPewaris.alamat || "",
                    nik: "",
                    pekerjaan: "",
                    agama: dataPewaris.agama || "",
                    jenisKelamin: "LAKI-LAKI",
                    statusPernikahan: "MENIKAH",
                    hubungan: "SUAMI",
                    statusHidup: "HIDUP",
                    memilikiKeturunan: false,
                    keterangan: "Suami Pewaris",
                  });
                }}
                className="border-purple-300 text-purple-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Suami
              </Button>
            )}

            {showTambahSaudara && (
              <Button
                type="button"
                variant="outline"
                onClick={tambahSaudara}
                className="border-orange-300 text-orange-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Saudara
              </Button>
            )}

            {showTambahCucu && (
              <Button
                type="button"
                variant="outline"
                onClick={tambahCucu}
                className="border-cyan-300 text-cyan-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Cucu
              </Button>
            )}

            {/* Tombol tambah anak (selalu muncul untuk kondisi yang memerlukan anak) */}
            {showTambahAnak && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => tambahAnak("PERTAMA")}
                  className="border-green-300 text-green-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Anak
                </Button>
                
                {/* Untuk kondisi 4, tampilkan tombol tambah anak untuk istri kedua */}
                {kondisi === "kondisi4" && istriList.length >= 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => tambahAnak("KEDUA")}
                    className="border-green-300 text-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Anak (Istri Kedua)
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Render data ahli waris */}
      <div className="space-y-6">
        {/* Istri/Suami */}
        {ahliWaris
          .filter(
            (item) => item.hubungan === "ISTRI" || item.hubungan === "SUAMI"
          )
          .map((item, index) => {
            const originalIndex = ahliWaris.findIndex((f) => f === item);
            const isIstri = item.hubungan === "ISTRI";
            const fieldErrors = errors.ahliWaris?.[originalIndex];

            return (
              <Card
                key={`${item.hubungan}-${index}-${originalIndex}`}
                className={`border-l-4 ${isIstri ? "border-l-blue-500 border-blue-100" : "border-l-purple-500 border-purple-100"}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle
                      className={`flex items-center ${isIstri ? "text-blue-700" : "text-purple-700"}`}
                    >
                      {isIstri ? (
                        <>
                          <Users className="w-5 h-5 mr-2" />
                          {item.keterangan || `Istri ${index + 1}`}
                          {item.urutan && ` (Istri ke-${item.urutan})`}
                          {item.statusHidup === "MENINGGAL" && (
                            <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                            >
                              Almarhumah
                            </Badge>
                          )}
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5 mr-2" />
                          {item.keterangan || "Suami Pewaris"}
                          {item.statusHidup === "MENINGGAL" && (
                            <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                            >
                              Almarhum
                            </Badge>
                          )}
                        </>
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                      {/* Status hidup toggle */}
                      <Button
                        type="button"
                        size="sm"
                        variant={item.statusHidup === "HIDUP" ? "outline" : "destructive"}
                        onClick={() => toggleStatusHidup(originalIndex)}
                        className={item.statusHidup === "HIDUP" ? 
                          "border-green-300 text-green-600 hover:bg-green-50" : 
                          "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                      >
                        {item.statusHidup === "HIDUP" ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Hidup
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Meninggal
                          </>
                        )}
                      </Button>

                      {ahliWaris.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(originalIndex)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Error summary untuk field ini */}
                  {fieldErrors && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      <AlertCircle className="inline w-4 h-4 mr-1" />
                      Ada field yang belum diisi dengan benar
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <FormKeluarga
                      form={form}
                      index={originalIndex}
                      hubunganDefault={item.hubungan}
                      showKeterangan={false} // Sembunyikan keterangan karena sudah ada di header
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

        {/* Anak-anak (jika ada) */}
        {anakList.length > 0 && (
          <Card className="border-l-4 border-l-green-500 border-green-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-green-700">
                  <Users className="w-5 h-5 mr-2" />
                  Anak-anak Pewaris ({anakList.length} orang)
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({anakList.filter(a => a.statusHidup === "HIDUP").length} hidup, {anakList.filter(a => a.statusHidup === "MENINGGAL").length} meninggal)
                  </span>
                </CardTitle>
                {showTambahAnak && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => tambahAnak("PERTAMA")}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Tambah Anak
                    </Button>
                    {kondisi === "kondisi4" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => tambahAnak("KEDUA")}
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Anak (Istri 2)
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {anakList.map((item, index) => {
                  const originalIndex = ahliWaris.findIndex((f) => f === item);
                  const fieldErrors = errors.ahliWaris?.[originalIndex];
                  const isAlmarhum = item.statusHidup === "MENINGGAL";

                  return (
                    <div
                      key={`anak-${index}-${originalIndex}`}
                      className={`border rounded-lg p-4 ${isAlmarhum ? 'bg-red-50 border-red-200' : 'bg-white border-green-200'}`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium">
                              Anak {index + 1}
                              {item.keterangan && ` - ${item.keterangan}`}
                              {item.asalIstri && ` (${item.asalIstri === "PERTAMA" ? "Istri Pertama" : "Istri Kedua"})`}
                            </h4>
                            {fieldErrors && (
                              <div className="text-xs text-red-600 mt-1">
                                <AlertCircle className="inline w-3 h-3 mr-1" />
                                Periksa data
                              </div>
                            )}
                          </div>
                          {isAlmarhum && (
                            <Badge variant="destructive" className="text-xs">
                              Almarhum/Almarhumah
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {/* Toggle status hidup */}
                          <Button
                            type="button"
                            size="sm"
                            variant={item.statusHidup === "HIDUP" ? "outline" : "destructive"}
                            onClick={() => toggleStatusHidup(originalIndex)}
                            className={item.statusHidup === "HIDUP" ? 
                              "border-green-300 text-green-600 hover:bg-green-50" : 
                              "bg-red-100 text-red-700 hover:bg-red-200"
                            }
                          >
                            {item.statusHidup === "HIDUP" ? "Hidup" : "Meninggal"}
                          </Button>

                          {/* Toggle memiliki keturunan (hanya untuk anak yang meninggal) */}
                          {item.statusHidup === "MENINGGAL" && (
                            <Button
                              type="button"
                              size="sm"
                              variant={item.memilikiKeturunan ? "outline" : "secondary"}
                              onClick={() => toggleMemilikiKeturunan(originalIndex)}
                              className={item.memilikiKeturunan ? 
                                "border-cyan-300 text-cyan-600 hover:bg-cyan-50" : 
                                "border-gray-300 text-gray-600 hover:bg-gray-50"
                              }
                            >
                              {item.memilikiKeturunan ? "Punya Keturunan" : "Tidak Punya Keturunan"}
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => remove(originalIndex)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                      
                      {/* Untuk kondisi 4, pilih asal istri */}
                      {kondisi === "kondisi4" && (
                        <div className="mb-4 p-3 bg-blue-50 rounded">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asal Istri
                          </label>
                          <Select
                            value={item.asalIstri || "PERTAMA"}
                            onValueChange={(value) => 
                              form.setValue(`ahliWaris.${originalIndex}.asalIstri`, value as "PERTAMA" | "KEDUA")
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih asal istri" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PERTAMA">Istri Pertama</SelectItem>
                              <SelectItem value="KEDUA">Istri Kedua</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <FormKeluarga
                        form={form}
                        index={originalIndex}
                        hubunganDefault="ANAK"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saudara (jika ada) */}
        {saudaraList.length > 0 && (
          <Card className="border-l-4 border-l-orange-500 border-orange-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-orange-700">
                  <Users className="w-5 h-5 mr-2" />
                  Saudara Kandung ({saudaraList.length} orang)
                </CardTitle>
                {showTambahSaudara && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={tambahSaudara}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Saudara
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {saudaraList.map((item, index) => {
                  const originalIndex = ahliWaris.findIndex((f) => f === item);
                  const fieldErrors = errors.ahliWaris?.[originalIndex];

                  return (
                    <div
                      key={`saudara-${index}-${originalIndex}`}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">Saudara {index + 1}</h4>
                          {fieldErrors && (
                            <div className="text-xs text-red-600 mt-1">
                              <AlertCircle className="inline w-3 h-3 mr-1" />
                              Periksa data
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={item.statusHidup === "HIDUP" ? "outline" : "destructive"}
                            onClick={() => toggleStatusHidup(originalIndex)}
                            className={item.statusHidup === "HIDUP" ? 
                              "border-green-300 text-green-600 hover:bg-green-50" : 
                              "bg-red-100 text-red-700 hover:bg-red-200"
                            }
                          >
                            {item.statusHidup === "HIDUP" ? "Hidup" : "Meninggal"}
                          </Button>
                          {saudaraList.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => remove(originalIndex)}
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Hapus
                            </Button>
                          )}
                        </div>
                      </div>
                      <FormKeluarga
                        form={form}
                        index={originalIndex}
                        hubunganDefault="SAUDARA"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cucu (jika ada) */}
        {cucuList.length > 0 && (
          <Card className="border-l-4 border-l-cyan-500 border-cyan-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-cyan-700">
                  <Users className="w-5 h-5 mr-2" />
                  Cucu ({cucuList.length} orang)
                </CardTitle>
                {showTambahCucu && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={tambahCucu}
                    className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Cucu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cucuList.map((item, index) => {
                  const originalIndex = ahliWaris.findIndex((f) => f === item);
                  const fieldErrors = errors.ahliWaris?.[originalIndex];

                  return (
                    <div
                      key={`cucu-${index}-${originalIndex}`}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">Cucu {index + 1}</h4>
                          {fieldErrors && (
                            <div className="text-xs text-red-600 mt-1">
                              <AlertCircle className="inline w-3 h-3 mr-1" />
                              Periksa data
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={item.statusHidup === "HIDUP" ? "outline" : "destructive"}
                            onClick={() => toggleStatusHidup(originalIndex)}
                            className={item.statusHidup === "HIDUP" ? 
                              "border-green-300 text-green-600 hover:bg-green-50" : 
                              "bg-red-100 text-red-700 hover:bg-red-200"
                            }
                          >
                            {item.statusHidup === "HIDUP" ? "Hidup" : "Meninggal"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => remove(originalIndex)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                      <FormKeluarga
                        form={form}
                        index={originalIndex}
                        hubunganDefault="CUCU"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state jika belum ada ahli waris */}
        {ahliWaris.length === 0 && kondisi !== "kondisi6" && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Belum ada ahli waris yang ditambahkan. Klik tombol Tambah Istri/Suami di atas untuk memulai.
            </AlertDescription>
          </Alert>
        )}

        {/* Khusus kondisi 6 */}
        {kondisi === "kondisi6" && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Kondisi 6: Pewaris tidak memiliki keturunan.</strong> 
              Tidak perlu menambahkan ahli waris untuk kondisi ini.
            </AlertDescription>
          </Alert>
        )}

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p>
                  <strong>Ada beberapa field yang perlu diperbaiki:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {errors.dataPewaris && (
                    <li>
                      Data Pewaris:{" "}
                      {errors.dataPewaris.message || "Periksa data pewaris"}
                    </li>
                  )}
                  {errors.ahliWaris?.message && (
                    <li>Ahli Waris: {errors.ahliWaris.message}</li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
