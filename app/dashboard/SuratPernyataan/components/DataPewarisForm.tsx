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

interface DataPewarisFormProps {
  form: UseFormReturn<FormValues>;
}

export default function DataPewarisForm({ form }: DataPewarisFormProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Step 2: Data Pewaris
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="dataPewaris.nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Nama Pewaris
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama lengkap pewaris"
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
          name="dataPewaris.tempatLahir"
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
          name="dataPewaris.tanggalLahir"
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
          name="dataPewaris.tempatMeninggal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Tempat Meninggal
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Tempat meninggal"
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
          name="dataPewaris.tanggalMeninggal"
          render={({ field }) => {
            const dateValue = formatDateForInput(field.value);
            return (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Tanggal Meninggal
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
          name="dataPewaris.nomorAkteKematian"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Nomor Akte Kematian
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor akte kematian"
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
          name="dataPewaris.alamat"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-sm font-medium text-gray-700">
                Alamat Pewaris
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Alamat lengkap"
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
          name="dataPewaris.jenisKelamin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Jenis Kelamin Pewaris
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
          name="dataPewaris.statusPernikahan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Status Pernikahan Pewaris
              </FormLabel>
              <FormControl>
                <select
                  value={field.value || "MENIKAH"}
                  onChange={field.onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MENIKAH">Menikah</option>
                  <option value="BELUM_MENIKAH">Belum Menikah</option>
                  <option value="CERAI_HIDUP">Cerai Hidup</option>
                  <option value="CERAI_MATI">Cerai Mati</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}