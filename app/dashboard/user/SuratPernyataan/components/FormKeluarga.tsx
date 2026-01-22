import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import Input from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { formatDateForInput } from "../utils/formatters";

interface FormKeluargaProps {
  form: UseFormReturn<FormValues>;
  index: number;
  hubunganDefault: string;
  showKeterangan?: boolean;
}

export default function FormKeluarga({
  form,
  index,
  hubunganDefault,
  showKeterangan = true,
}: FormKeluargaProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
      {showKeterangan && (
        <div className="mb-4 pb-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {form.watch(`ahliWaris.${index}.keterangan`) ||
                `Data ${hubunganDefault}`}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
              {hubunganDefault}
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.nama`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama lengkap"
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
          name={`ahliWaris.${index}.namaAyah`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Nama Ayah
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama ayah kandung"
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
          name={`ahliWaris.${index}.nik`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                NIK
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="16 digit NIK"
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
          name={`ahliWaris.${index}.tempatLahir`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Tempat Lahir
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Kota tempat lahir"
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
          name={`ahliWaris.${index}.tanggalLahir`}
          render={({ field }) => {
            const dateValue = formatDateForInput(field.value);
            return (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Tanggal Lahir
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={dateValue}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name={`ahliWaris.${index}.pekerjaan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Pekerjaan
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Pekerjaan saat ini"
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
          name={`ahliWaris.${index}.agama`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Agama
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Agama"
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
          name={`ahliWaris.${index}.jenisKelamin`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Jenis Kelamin
              </FormLabel>
              <FormControl>
                <select
                  value={field.value || "LAKI-LAKI"}
                  onChange={field.onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LAKI-LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ahliWaris.${index}.statusPernikahan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Status Pernikahan
              </FormLabel>
              <FormControl>
                <select
                  value={field.value || "BELUM_MENIKAH"}
                  onChange={field.onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BELUM_MENIKAH">Belum Menikah</option>
                  <option value="MENIKAH">Menikah</option>
                  <option value="CERAI_HIDUP">Cerai Hidup</option>
                  <option value="CERAI_MATI">Cerai Mati</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ahliWaris.${index}.hubungan`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Hubungan dengan Pewaris
              </FormLabel>
              <FormControl>
                <select
                  value={field.value || hubunganDefault}
                  onChange={field.onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SUAMI">Suami</option>
                  <option value="ISTRI">Istri</option>
                  <option value="ANAK">Anak</option>
                  <option value="CUCU">Cucu</option>
                  <option value="SAUDARA">Saudara Kandung</option>
                  <option value="ORANG_TUA">Orang Tua</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ahliWaris.${index}.alamat`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Alamat Lengkap
              </FormLabel>
              <FormControl>
                <textarea
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alamat lengkap saat ini"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`ahliWaris.${index}.keterangan`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Keterangan
              </FormLabel>
              <FormControl>
                <textarea
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Keterangan tambahan..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
