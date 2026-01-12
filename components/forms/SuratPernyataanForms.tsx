// components/forms/SuratPernyataanForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { suratPernyataanSchema, SuratPernyataanFormData } from "@/types/permohonan";
import { BaseFormFields } from "./shared/BaseFormFields";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";

interface SuratPernyataanFormProps {
  onSubmit: (data: SuratPernyataanFormData) => void;
  isLoading?: boolean;
}

export default function SuratPernyataanForm({ onSubmit, isLoading = false }: SuratPernyataanFormProps) {
  const form = useForm<SuratPernyataanFormData>({
    resolver: zodResolver(suratPernyataanSchema),
    defaultValues: {
      email: "",
      nomorTelp: "",
      namaPemohon: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamat: "",
      nik: "",
      jenisPernyataan: "",
      maksudTujuan: "",
      keterangan: "",
      dokumenPendukung: [],
    },
  });

  const handleSubmit = (data: SuratPernyataanFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Data Pemohon (Shared) */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Data Pemohon</h2>
          </div>
          <BaseFormFields form={form} />
        </div>

        {/* Data Khusus Surat Pernyataan */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Data Pernyataan</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Jenis Pernyataan */}
            <FormField
              control={form.control}
              name="jenisPernyataan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Jenis Pernyataan</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">Pilih Jenis Pernyataan</option>
                      <option value="belum-menikah">Belum Menikah</option>
                      <option value="tidak-bekerja">Tidak Bekerja</option>
                      <option value="tidak-mampu">Tidak Mampu</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Maksud dan Tujuan */}
            <FormField
              control={form.control}
              name="maksudTujuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Maksud dan Tujuan</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      placeholder="Jelaskan maksud dan tujuan pembuatan surat pernyataan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Keterangan */}
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Keterangan</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      placeholder="Jelaskan secara detail keterangan yang diperlukan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Mengajukan..." : "Ajukan Permohonan Surat Pernyataan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}