// components/forms/shared/BaseFormFields.tsx
import { UseFormReturn } from "react-hook-form";
import { BaseFormData } from "@/types/permohonan";
import Input from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";

interface BaseFormFieldsProps {
  form: UseFormReturn<BaseFormData>;
}

export function BaseFormFields({ form }: BaseFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="email@example.com" 
                {...field} 
                className="bg-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nomor Telp/WA */}
      <FormField
        control={form.control}
        name="nomorTelp"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Nomor Telp/WA</FormLabel>
            <FormControl>
              <Input 
                placeholder="08xxxxxxxxxx" 
                {...field} 
                className="bg-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nama Pemohon */}
      <FormField
        control={form.control}
        name="namaPemohon"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Nama Pemohon</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nama lengkap pemohon" 
                {...field} 
                className="bg-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tempat Lahir */}
      <FormField
        control={form.control}
        name="tempatLahir"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Tempat Lahir</FormLabel>
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

      {/* Tanggal Lahir */}
      <FormField
        control={form.control}
        name="tanggalLahir"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Tanggal Lahir</FormLabel>
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

      {/* NIK */}
      <FormField
        control={form.control}
        name="nik"
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

      {/* Alamat */}
      <FormField
        control={form.control}
        name="alamat"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel className="text-sm font-medium text-gray-700">Alamat</FormLabel>
            <FormControl>
              <textarea
                {...field}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                placeholder="Alamat lengkap pemohon"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}