"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/Form";
import Input from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info } from "lucide-react";
import { getKondisiLabel } from "../constants/schemas";

interface DataPewarisFormProps {
  form: UseFormReturn<FormValues>;
}

export default function DataPewarisForm({ form }: DataPewarisFormProps) {
  const kondisi = form.watch("kondisi");
  const jenisKelamin = form.watch("dataPewaris.jenisKelamin");
  const statusPernikahan = form.watch("dataPewaris.statusPernikahan");
  const errors = form.formState.errors.dataPewaris;

  // Helper untuk menentukan apakah perlu pasangan hidup berdasarkan kondisi
  const perluPasanganHidup = () => {
    if (!kondisi) return false;
    
    const kondisiDenganPasangan = [
      "kondisi1", "kondisi2", "kondisi3", // Punya istri
      "kondisi4", // 2 istri
      "kondisi5", // Suami hidup
    ];
    
    return kondisiDenganPasangan.includes(kondisi);
  };

  // Helper untuk menentukan status pernikahan yang valid
  const getStatusPernikahanOptions = () => {
    const options = [
      { value: "MENIKAH", label: "Menikah" },
      { value: "BELUM_MENIKAH", label: "Belum Menikah" },
      { value: "CERAI_HIDUP", label: "Cerai Hidup" },
      { value: "CERAI_MATI", label: "Cerai Mati" },
    ];

    return options;
  };

  // Format date untuk input
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Step 2: Data Pewaris
        </h2>
        {kondisi && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {kondisi.replace("kondisi", "Kondisi ")}
          </Badge>
        )}
      </div>

      {/* Informasi kondisi */}
      {kondisi && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">
                <strong>Keterangan:</strong> {getKondisiLabel(kondisi)}
              </p>
              {perluPasanganHidup() && (
                <p className="text-xs text-blue-600 mt-1">
                  • Status pernikahan harus Menikah/Janda/Duda untuk kondisi ini
                </p>
              )}
              {kondisi === "kondisi5" && jenisKelamin !== "PEREMPUAN" && (
                <p className="text-xs text-red-600 mt-1">
                  • Untuk kondisi suami hidup, pewaris harus perempuan
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error summary */}
      {errors && Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="font-medium text-red-800">Data belum lengkap</p>
          </div>
          <p className="text-sm text-red-700 mt-2">
            Harap lengkapi semua field yang bertanda * (wajib diisi)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Pewaris - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Nama Lengkap Pewaris
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama lengkap pewaris"
                  value={field.value || ""}
                  onChange={field.onChange}
                  className={errors?.nama ? "border-red-300 focus:ring-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nama Ayah - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.namaAyah"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Nama Ayah Pewaris (untuk BIN/BINTI)
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama ayah pewaris"
                  value={field.value || ""}
                  onChange={field.onChange}
                  className={errors?.namaAyah ? "border-red-300 focus:ring-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs text-gray-500">
                Contoh: Untuk Muhammad bin Abdullah, isi Abdullah
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Jenis Kelamin - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.jenisKelamin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Jenis Kelamin Pewaris
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <select
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors?.jenisKelamin 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="LAKI-LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tempat Lahir - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.tempatLahir"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Tempat Lahir
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Kota/kabupaten tempat lahir"
                  value={field.value || ""}
                  onChange={field.onChange}
                  className={errors?.tempatLahir ? "border-red-300 focus:ring-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tanggal Lahir - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.tanggalLahir"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Tanggal Lahir
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={formatDate(field.value)}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={errors?.tanggalLahir ? "border-red-300 focus:ring-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Pernikahan - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.statusPernikahan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Status Pernikahan
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <select
                  value={field.value || "MENIKAH"}
                  onChange={field.onChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors?.statusPernikahan 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  {getStatusPernikahanOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
              {perluPasanganHidup() && 
                !["MENIKAH", "JANDA", "DUDA"].includes(field.value) && (
                <FormDescription className="text-red-500 text-xs">
                  • Status harus Menikah/Janda/Duda untuk kondisi yang dipilih
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        {/* Agama - WAJIB */}
        <FormField
          control={form.control}
          name="dataPewaris.agama"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                Agama
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <select
                  value={field.value || "Islam"}
                  onChange={field.onChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors?.agama 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data Kematian */}
        <div className="md:col-span-2 border-t pt-4 mt-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Data Kematian</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tempat Meninggal - WAJIB */}
            <FormField
              control={form.control}
              name="dataPewaris.tempatMeninggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    Tempat Meninggal
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kota Tempat Meninggal (Jakarta, Bandung, dsb.)"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors?.tempatMeninggal ? "border-red-300 focus:ring-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Meninggal - WAJIB */}
            <FormField
              control={form.control}
              name="dataPewaris.tanggalMeninggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    Tanggal Meninggal
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={formatDate(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={errors?.tanggalMeninggal ? "border-red-300 focus:ring-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nomor Akta Kematian - WAJIB */}
            <FormField
              control={form.control}
              name="dataPewaris.nomorAkteKematian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    Nomor Akta Kematian
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor akta kematian"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors?.nomorAkteKematian ? "border-red-300 focus:ring-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Akta Kematian - WAJIB */}
            <FormField
              control={form.control}
              name="dataPewaris.tanggalAkteKematian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    Tanggal Akta Kematian
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={formatDate(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={errors?.tanggalAkteKematian ? "border-red-300 focus:ring-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Alamat Lengkap */}
        <div className="md:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Alamat Lengkap</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dataPewaris.alamat"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    Alamat Jalan
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      rows={3}
                      placeholder="Alamat lengkap (jalan, nomor)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors?.alamat 
                          ? "border-red-300 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataPewaris.rt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    RT
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="RT"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataPewaris.rw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    RW
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="RW"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Data Pernikahan (jika MENIKAH/JANDA/DUDA) */}
        {["MENIKAH", "CERAI_MATI"].includes(statusPernikahan) && (
          <div className="md:col-span-2 border-t pt-4 mt-2">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Data Pernikahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="dataPewaris.noSuratNikah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nomor Surat Nikah
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nomor surat nikah"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataPewaris.tanggalNikah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Tanggal Nikah
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={formatDate(field.value)}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataPewaris.instansiNikah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Instansi Nikah
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="KUA/Dukcapil"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      {errors && Object.keys(errors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="font-medium text-red-800">Field yang perlu diperbaiki:</p>
          </div>
          <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([key, error]) => (
              <li key={key}>
                <span className="font-medium">{getFieldLabel(key)}:</span> {typeof error === "object" && error !== null && "message" in error ? error.message : "Wajib diisi"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function untuk label field
function getFieldLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    nama: "Nama Pewaris",
    namaAyah: "Nama Ayah Pewaris",
    tempatLahir: "Tempat Lahir",
    tanggalLahir: "Tanggal Lahir",
    tempatMeninggal: "Tempat Meninggal",
    tanggalMeninggal: "Tanggal Meninggal",
    nomorAkteKematian: "Nomor Akta Kematian",
    tanggalAkteKematian: "Tanggal Akta Kematian",
    instansiAkteKematian: "Instansi Akta Kematian",
    alamat: "Alamat",
    jenisKelamin: "Jenis Kelamin",
    statusPernikahan: "Status Pernikahan",
    agama: "Agama",
    pekerjaan: "Pekerjaan",
    kewarganegaraan: "Kewarganegaraan",
  };
  return labels[fieldName] || fieldName;
}