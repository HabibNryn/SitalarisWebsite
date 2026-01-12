// components/forms/SuratWarisForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { suratWarisSchema, SuratWarisFormData } from "@/types/permohonan";
import { BaseFormFields } from "./shared/BaseFormFields";
import { AhliWarisFields } from "./shared/AhliWarisFields";
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

interface SuratWarisFormProps {
  onSubmit: (data: SuratWarisFormData) => void;
  isLoading?: boolean;
}

export default function SuratWarisForm({ onSubmit, isLoading = false }: SuratWarisFormProps) {
  const [ahliWarisCount, setAhliWarisCount] = useState(1);

  const form = useForm<SuratWarisFormData>({
    resolver: zodResolver(suratWarisSchema),
    defaultValues: {
      email: "",
      nomorTelp: "",
      namaPemohon: "",
      tempatLahir: "",
      tanggalLahir: "",
      alamat: "",
      nik: "",
      namaPewaris: "",
      tempatLahirPewaris: "",
      tanggalLahirPewaris: "",
      tempatMeninggalPewaris: "",
      tanggalMeninggalPewaris: "",
      nomorAkteKematian: "",
      ahliWaris: [
        {
          nama: "",
          tempatLahir: "",
          tanggalLahir: "",
          pekerjaan: "",
          agama: "",
          alamat: "",
          nik: "",
        }
      ],
    },
  });

  const tambahAhliWaris = () => {
    const currentAhliWaris = form.getValues("ahliWaris");
    form.setValue("ahliWaris", [
      ...currentAhliWaris,
      {
        nama: "",
        tempatLahir: "",
        tanggalLahir: "",
        pekerjaan: "",
        agama: "",
        alamat: "",
        nik: "",
      }
    ]);
    setAhliWarisCount(prev => prev + 1);
  };

  const hapusAhliWaris = (index: number) => {
    const currentAhliWaris = form.getValues("ahliWaris");
    if (currentAhliWaris.length > 1) {
      const newAhliWaris = currentAhliWaris.filter((_, i) => i !== index);
      form.setValue("ahliWaris", newAhliWaris);
      setAhliWarisCount(prev => prev - 1);
    }
  };

  const handleSubmit = (data: SuratWarisFormData) => {
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

        {/* Data Pewaris (Khusus Surat Waris) */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Data Pewaris</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Pewaris */}
            <FormField
              control={form.control}
              name="namaPewaris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Nama Pewaris</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nama lengkap pewaris" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tempat Lahir Pewaris */}
            <FormField
              control={form.control}
              name="tempatLahirPewaris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tempat Lahir Pewaris</FormLabel>
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

            {/* Tanggal Lahir Pewaris */}
            <FormField
              control={form.control}
              name="tanggalLahirPewaris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tanggal Lahir Pewaris</FormLabel>
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

            {/* Tempat Meninggal Pewaris */}
            <FormField
              control={form.control}
              name="tempatMeninggalPewaris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tempat Meninggal Pewaris</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Kota tempat meninggal" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Meninggal Pewaris */}
            <FormField
              control={form.control}
              name="tanggalMeninggalPewaris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Tanggal Meninggal Pewaris</FormLabel>
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

            {/* Nomor Akte Kematian Pewaris */}
            <FormField
              control={form.control}
              name="nomorAkteKematian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Nomor Akte Kematian Pewaris</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nomor akte kematian" 
                      {...field} 
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Data Ahli Waris (Khusus Surat Waris) */}
        <AhliWarisFields
          form={form}
          ahliWarisCount={ahliWarisCount}
          onTambahAhliWaris={tambahAhliWaris}
          onHapusAhliWaris={hapusAhliWaris}
        />

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Mengajukan..." : "Ajukan Permohonan Surat Waris"}
          </Button>
        </div>
      </form>
    </Form>
  );
}