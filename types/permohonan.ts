// types/permohonan.ts
import { z } from "zod";

// Schema dasar yang sama untuk kedua form
export const baseSchema = z.object({
  email: z.string().email("Email tidak valid"),
  nomorTelp: z.string().min(10, "Nomor telepon minimal 10 digit"),
  namaPemohon: z.string().min(1, "Nama pemohon harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  nik: z.string().length(16, "NIK harus 16 digit"),
});

// Schema untuk ahli waris
export const ahliWarisSchema = z.object({
  nama: z.string().min(1, "Nama ahli waris harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  agama: z.string().min(1, "Agama harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  nik: z.string().length(16, "NIK harus 16 digit"),
});

// Schema untuk Surat Keterangan Ahli Waris
export const suratWarisSchema = baseSchema.extend({
  // Data khusus untuk surat waris
  namaPewaris: z.string().min(1, "Nama pewaris harus diisi"),
  tempatLahirPewaris: z.string().min(1, "Tempat lahir pewaris harus diisi"),
  tanggalLahirPewaris: z.string().min(1, "Tanggal lahir pewaris harus diisi"),
  tempatMeninggalPewaris: z.string().min(1, "Tempat meninggal pewaris harus diisi"),
  tanggalMeninggalPewaris: z.string().min(1, "Tanggal meninggal pewaris harus diisi"),
  nomorAkteKematian: z.string().min(1, "Nomor akte kematian harus diisi"),
  ahliWaris: z.array(ahliWarisSchema).min(1, "Minimal ada 1 ahli waris"),
});

// Schema untuk Surat Pernyataan Register
export const suratPernyataanSchema = baseSchema.extend({
  // Data khusus untuk surat pernyataan
  jenisPernyataan: z.string().min(1, "Jenis pernyataan harus diisi"),
  maksudTujuan: z.string().min(1, "Maksud dan tujuan harus diisi"),
  keterangan: z.string().min(1, "Keterangan harus diisi"),
  dokumenPendukung: z.array(z.string()).optional(),
});

export type BaseFormData = z.infer<typeof baseSchema>;
export type AhliWaris = z.infer<typeof ahliWarisSchema>;
export type SuratWarisFormData = z.infer<typeof suratWarisSchema>;
export type SuratPernyataanFormData = z.infer<typeof suratPernyataanSchema>;