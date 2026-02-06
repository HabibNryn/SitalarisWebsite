// components/forms/shared/AhliWarisFields.tsx
import { UseFormReturn } from "react-hook-form";
import { AhliWaris, SuratWarisFormData } from "@/types/permohonan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";

interface AhliWarisFieldsProps {
  form: UseFormReturn<SuratWarisFormData>;
  ahliWarisCount: number;
  onTambahAhliWaris: () => void;
  onHapusAhliWaris: (index: number) => void;
}

export function AhliWarisFields({ 
  form, 
  ahliWarisCount, 
  onTambahAhliWaris, 
  onHapusAhliWaris 
}: AhliWarisFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Data Ahli Waris</h2>
        <Button
          type="button"
          onClick={onTambahAhliWaris}
          variant="outline"
          className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
        >
          <span className="text-lg">+</span>
          <span>Tambah Ahli Waris</span>
        </Button>
      </div>

      {form.watch("ahliWaris").map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-gray-900">Ahli Waris {index + 1}</h3>
            {ahliWarisCount > 1 && (
              <Button
                type="button"
                onClick={() => onHapusAhliWaris(index)}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.nama`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Nama</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nama lengkap ahli waris" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NIK Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.nik`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">NIK</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="16 digit NIK" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tempat Lahir Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.tempatLahir`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tempat Lahir Ahli Waris</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Kota tempat lahir" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Lahir Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.tanggalLahir`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tanggal Lahir Ahli Waris</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pekerjaan Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.pekerjaan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Pekerjaan</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Pekerjaan ahli waris" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Agama Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.agama`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Agama</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Agama ahli waris" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alamat Ahli Waris */}
            <FormField
              control={form.control}
              name={`ahliWaris.${index}.alamat`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Alamat</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      placeholder="Alamat lengkap ahli waris"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}