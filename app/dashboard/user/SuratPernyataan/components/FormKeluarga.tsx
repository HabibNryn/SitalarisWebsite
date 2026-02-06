// app/dashboard/user/SuratPernyataan/components/FormKeluarga.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormValues, HubunganType, getHubunganLabel } from "../constants/schemas";

interface FormKeluargaProps {
  form: UseFormReturn<FormValues>;
  index: number;
  hubunganDefault: HubunganType;
  showKeterangan?: boolean;
  readonly?: boolean;
}

export default function FormKeluarga({ 
  form, 
  index, 
  hubunganDefault, 
  showKeterangan = true,
  readonly = false
}: FormKeluargaProps) {
  const hubungan = form.watch(`ahliWaris.${index}.hubungan`) || hubunganDefault;
  
  // List agama yang umum di Indonesia
  const agamaOptions = [
    { value: "ISLAM", label: "Islam" },
    { value: "KRISTEN", label: "Kristen Protestan" },
    { value: "KATOLIK", label: "Katolik" },
    { value: "HINDU", label: "Hindu" },
    { value: "BUDDHA", label: "Buddha" },
    { value: "KONGHUCU", label: "Konghucu" },
    { value: "LAINNYA", label: "Lainnya" },
  ];

  return (
    <div className="space-y-6">
      {/* Header dengan informasi hubungan */}
      <div className="p-3 bg-blue-50 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-blue-700">
            Data {getHubunganLabel(hubungan)} {index + 1}
          </h3>
          {!readonly && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Edit Mode
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* NAMA LENGKAP (WAJIB) */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.nama`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Nama Lengkap <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={`Contoh: Ahmad Budi`}
                  {...field}
                  disabled={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* NAMA AYAH */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.namaAyah`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Nama Ayah</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nama ayah kandung"
                  {...field}
                  disabled={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* NIK */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.nik`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">NIK</FormLabel>
              <FormControl>
                <Input 
                  placeholder="16 digit NIK"
                  {...field}
                  disabled={readonly}
                  maxLength={16}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* TEMPAT LAHIR */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.tempatLahir`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Tempat Lahir</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Kota/Kabupaten"
                  {...field}
                  disabled={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* TANGGAL LAHIR */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.tanggalLahir`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Tanggal Lahir</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field}
                  disabled={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* JENIS KELAMIN - Otomatis untuk ISTRI/SUAMI */}
        {["ISTRI", "SUAMI"].includes(hubungan) ? (
          <FormItem>
            <FormLabel className="text-sm font-medium">Jenis Kelamin</FormLabel>
            <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50 text-gray-700">
              <span className="font-medium">
                {hubungan === "ISTRI" ? "PEREMPUAN" : "LAKI-LAKI"}
              </span>
              <span className="ml-2 text-xs text-gray-500">(otomatis)</span>
            </div>
            <input 
              type="hidden" 
              value={hubungan === "ISTRI" ? "PEREMPUAN" : "LAKI-LAKI"} 
              {...form.register(`ahliWaris.${index}.jenisKelamin`)}
            />
          </FormItem>
        ) : (
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.jenisKelamin`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Jenis Kelamin</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={readonly}
                >
                  <FormControl>
                    <SelectTrigger className={readonly ? "bg-gray-50" : ""}>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LAKI-LAKI">Laki-laki</SelectItem>
                    <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        {/* PEKERJAAN */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.pekerjaan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Pekerjaan</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: PNS, Wiraswasta, dll"
                  {...field}
                  disabled={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* AGAMA */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.agama`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Agama</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={readonly}
              >
                <FormControl>
                  <SelectTrigger className={readonly ? "bg-gray-50" : ""}>
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agamaOptions.map((agama) => (
                    <SelectItem key={agama.value} value={agama.value}>
                      {agama.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* STATUS (HIDUP/MENINGGAL) */}
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.statusHidup`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "HIDUP"}
                disabled={readonly}
              >
                <FormControl>
                  <SelectTrigger className={readonly ? "bg-gray-50" : ""}>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HIDUP">Hidup</SelectItem>
                  <SelectItem value="MENINGGAL">Meninggal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* STATUS PERNIKAHAN */}
        {!["ISTRI", "SUAMI"].includes(hubungan) && (
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.statusPernikahan`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Status Pernikahan</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={readonly}
                >
                  <FormControl>
                    <SelectTrigger className={readonly ? "bg-gray-50" : ""}>
                      <SelectValue placeholder="Pilih status pernikahan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BELUM_MENIKAH">Belum Menikah</SelectItem>
                    <SelectItem value="MENIKAH">Menikah</SelectItem>
                    <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
                    <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        {/* MEMILIKI KETURUNAN (Checkbox) - untuk ANAK dan CUCU */}
        {["ANAK", "CUCU"].includes(hubungan) && (
          <div className="md:col-span-2 lg:col-span-1">
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.memilikiKeturunan`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={readonly}
                      className={readonly ? "opacity-50" : ""}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Memiliki Keturunan
                    </FormLabel>
                    <p className="text-xs text-gray-500">
                      Centang jika {getHubunganLabel(hubungan).toLowerCase()} sudah memiliki anak/cucu
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* ALAMAT (Full width) */}
      <div>
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.alamat`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contoh: Jl. Merdeka No. 10, RT 01/RW 02, Kelurahan Grogol, Kecamatan Grogol Petamburan, Jakarta Barat"
                  {...field}
                  disabled={readonly}
                  className={`min-h-[80px] ${readonly ? "bg-gray-50" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* KETERANGAN TAMBAHAN (Opsional) */}
      {showKeterangan && (
        <div>
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.keterangan`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Keterangan Tambahan <span className="text-gray-400">(Opsional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contoh: Anak pertama, Istri kedua, dll"
                    {...field}
                    disabled={readonly}
                    className={`min-h-[60px] ${readonly ? "bg-gray-50" : ""}`}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}