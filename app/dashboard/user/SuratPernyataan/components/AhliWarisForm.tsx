"use client";

import { useEffect } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users, UserPlus, AlertCircle, Info } from "lucide-react";
import { FormValues, DataKeluargaType } from "../types";
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
import { getKondisiLabel } from "../constants/schemas";
import { StatusPernikahan } from "@/types/pernyataanWaris";

interface Props {
  form: UseFormReturn<FormValues>;
}

export default function AhliWarisForm({ form }: Props) {
  const kondisi = form.watch("kondisi");
  const dataPewaris = form.watch("dataPewaris");
  const ahliWaris = form.watch("ahliWaris") || [];
  

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
      hubungan: DataKeluargaType["hubungan"],
      keterangan: string,
    ): DataKeluargaType => ({
      nama: "",
      namaAyah: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamat: "",
      nik: "",
      pekerjaan: "",
      agama: "",
      jenisKelamin: "LAKI-LAKI",
      statusPernikahan: "MENIKAH",
      hubungan,
      masihHidup: true,
      memilikiKeturunan: false,
      keterangan,
    });

    const isPewarisPerempuan = dataPewaris?.jenisKelamin === "PEREMPUAN";

    switch (kondisi) {
      case "kondisi1": // 1 istri, semua anak hidup
      case "kondisi2": // 1 istri, ada anak meninggal
      case "kondisi3": // 1 istri, ada anak meninggal + cucu
        if (!isPewarisPerempuan) {
          replace([
            {
              ...baseData("ISTRI", "Istri Pewaris"),
              jenisKelamin: "PEREMPUAN",
              statusPernikahan: "MENIKAH",
              masihHidup: true,
            },
          ]);
        }
        break;

      case "kondisi4": // 2 istri
        if (!isPewarisPerempuan) {
          replace([
            {
              ...baseData("ISTRI", "Istri Pertama"),
              jenisKelamin: "PEREMPUAN",
              statusPernikahan: "MENIKAH",
              masihHidup: true,
            },
            {
              ...baseData("ISTRI", "Istri Kedua"),
              jenisKelamin: "PEREMPUAN",
              statusPernikahan: "MENIKAH",
              masihHidup: true,
            },
          ]);
        }
        break;

      case "kondisi5": // suami hidup
        if (isPewarisPerempuan) {
          replace([
            {
              ...baseData("SUAMI", "Suami Pewaris"),
              jenisKelamin: "LAKI-LAKI",
              statusPernikahan: "MENIKAH",
              masihHidup: true,
            },
          ]);
        }
        break;

      case "kondisi7": // saudara kandung
        replace([
          {
            ...baseData("SAUDARA", "Saudara Kandung"),
            jenisKelamin: "LAKI-LAKI",
            statusPernikahan: "BELUM_MENIKAH",
            memilikiKeturunan: false,
          },
        ]);
        break;

      case "kondisi6": // tidak ada ahli waris
        replace([]);
        break;
    }
  }, [kondisi, ahliWaris.length, replace, dataPewaris?.jenisKelamin]);

  useEffect(() => {
  ahliWaris.forEach((item, index) => {
    if (item.hubungan === "ISTRI" && item.jenisKelamin !== "PEREMPUAN") {
      form.setValue(`ahliWaris.${index}.jenisKelamin`, "PEREMPUAN");
    }

    if (item.hubungan === "SUAMI" && item.jenisKelamin !== "LAKI-LAKI") {
      form.setValue(`ahliWaris.${index}.jenisKelamin`, "LAKI-LAKI");
    }
  });
}, [ahliWaris, form]);


  /* =====================================================
     FUNGSI TAMBAH DATA - DIUPDATE
  ===================================================== */
  const tambahData = (
    hubungan: DataKeluargaType["hubungan"],
    keterangan: string,
    jenisKelamin: "LAKI-LAKI" | "PEREMPUAN" = "LAKI-LAKI",
    statusPernikahan: StatusPernikahan = "BELUM_MENIKAH",
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
      masihHidup: true,
      memilikiKeturunan: false,
      keterangan,
    });
  };

  const tambahAnak = (istriKe: number = 1) => {
    tambahData(
      "ANAK",
      `Anak dari ${istriKe === 1 ? "Istri Pertama" : "Istri Kedua"}`,
      "LAKI-LAKI",
      "BELUM_MENIKAH",
    );
  };

  const tambahSaudara = () => {
    tambahData("SAUDARA", "Saudara Kandung");
  };

  const tambahCucu = () => {
    tambahData("CUCU", "Cucu Pewaris");
  };

  const tambahIstri = () => {
    if (dataPewaris?.jenisKelamin === "LAKI-LAKI") {
      const istriCount =
        ahliWaris.filter((a: DataKeluargaType) => a.hubungan === "ISTRI")
          .length + 1;
      if (istriCount <= 2) {
        tambahData("ISTRI", `Istri ${istriCount}`, "PEREMPUAN", "MENIKAH");
      }
    }
  };

  /* =====================================================
     LOGIKA TOMBOL TAMBAH BERDASARKAN KONDISI
  ===================================================== */

  // Hitung jumlah berdasarkan kondisi saat ini
  const istriList = ahliWaris.filter(
    (item: DataKeluargaType) => item.hubungan === "ISTRI",
  );
  const suamiList = ahliWaris.filter(
    (item: DataKeluargaType) => item.hubungan === "SUAMI",
  );
  const anakList = ahliWaris.filter(
    (item: DataKeluargaType) => item.hubungan === "ANAK",
  );
  const saudaraList = ahliWaris.filter(
    (item: DataKeluargaType) => item.hubungan === "SAUDARA",
  );
  const cucuList = ahliWaris.filter(
    (item: DataKeluargaType) => item.hubungan === "CUCU",
  );

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
     VALIDATION WARNING
  ===================================================== */
  const showValidationWarning = errors.ahliWaris || errors.dataPewaris;

  /* =====================================================
     RENDER UTAMA
  ===================================================== */
  return (
    <div className="space-y-6">
      {/* Validation Warning */}
      {showValidationWarning && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.ahliWaris?.message ||
              "Ada data yang belum lengkap. Harap periksa semua field yang diperlukan."}
          </AlertDescription>
        </Alert>
      )}

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

          {/* Instruction */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
            <p className="text-gray-600">
              <strong>Petunjuk:</strong> Isi semua field yang ada di bawah.
              Field dengan tanda * wajib diisi.
            </p>
          </div>

          {/* Tombol tambah berdasarkan kondisi */}
          <div className="flex flex-wrap gap-3 mt-4">
            {showTambahIstri && (
              <Button
                type="button"
                variant="outline"
                onClick={tambahIstri}
                className="border-blue-300 text-blue-600"
                disabled={istriList.length >= 2}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Istri (Maks: 2)
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
                    alamat: "",
                    nik: "",
                    pekerjaan: "",
                    agama: "",
                    jenisKelamin: "LAKI-LAKI",
                    statusPernikahan: "MENIKAH",
                    hubungan: "SUAMI",
                    masihHidup: true,
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
          </div>
        </CardContent>
      </Card>

      {/* Render data ahli waris */}
      <div className="space-y-6">
        {/* Istri/Suami */}
        {ahliWaris
          .filter(
            (item) => item.hubungan === "ISTRI" || item.hubungan === "SUAMI",
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
                          {!item.masihHidup && (
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
                          {!item.masihHidup && (
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
                      {/* Tombol tambah anak hanya untuk istri/suami yang masih hidup */}
                      {(isIstri || item.hubungan === "SUAMI") &&
                        item.masihHidup &&
                        showTambahAnak && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => tambahAnak(index + 1)}
                            className={
                              isIstri
                                ? "border-blue-300 text-blue-600 hover:bg-blue-50"
                                : "border-purple-300 text-purple-600 hover:bg-purple-50"
                            }
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Tambah Anak
                          </Button>
                        )}
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
                  <FormKeluarga
                    form={form}
                    index={originalIndex}
                    hubunganDefault={item.hubungan}
                  />
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
                </CardTitle>
                {showTambahAnak && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => tambahAnak(1)}
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Anak
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {anakList.map((item, index) => {
                  const originalIndex = ahliWaris.findIndex((f) => f === item);
                  const fieldErrors = errors.ahliWaris?.[originalIndex];

                  return (
                    <div
                      key={`anak-${index}-${originalIndex}`}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium">
                            Anak {index + 1}{" "}
                            {item.keterangan && `(${item.keterangan})`}
                          </h4>
                          {fieldErrors && (
                            <div className="text-xs text-red-600 mt-1">
                              <AlertCircle className="inline w-3 h-3 mr-1" />
                              Periksa data
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(originalIndex)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus Anak
                        </Button>
                      </div>
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

        {/* Empty state jika belum ada ahli waris (kecuali kondisi 6) */}
        {ahliWaris.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Belum ada ahli waris yang ditambahkan. Klik tombol Tambah
              Istri/Suami di atas untuk memulai.
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
