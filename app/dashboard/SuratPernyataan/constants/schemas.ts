import { z } from "zod";

/* =======================
   DATA KELUARGA
======================= */
export const dataKeluargaSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  namaAyah: z.string().min(1, "Nama ayah harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  agama: z.string().min(1, "Agama harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK harus angka"),

  jenisKelamin: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
  statusPernikahan: z.enum([
    "MENIKAH",
    "BELUM_MENIKAH",
    "CERAI_HIDUP",
    "CERAI_MATI",
  ]),
  hubungan: z.enum([
    "SUAMI",
    "ISTRI",
    "ANAK",
    "CUCU",
    "SAUDARA",
    "ORANG_TUA",
  ]),

  // 🔴 DIPERBAIKI
  masihHidup: z.boolean(),
  memilikiKeturunan: z.boolean(),

  keterangan: z.string().optional(),
});

/* =======================
   DATA PEWARIS
======================= */
export const dataPewarisSchema = z.object({
  nama: z.string().min(1, "Nama pewaris harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir pewaris harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir pewaris harus diisi"),
  tempatMeninggal: z.string().min(1, "Tempat meninggal pewaris harus diisi"),
  tanggalMeninggal: z.string().min(1, "Tanggal meninggal pewaris harus diisi"),
  nomorAkteKematian: z.string().min(1, "Nomor akte kematian harus diisi"),
  alamat: z.string().min(1, "Alamat pewaris harus diisi"),

  statusPernikahan: z.enum([
    "MENIKAH",
    "BELUM_MENIKAH",
    "CERAI_HIDUP",
    "CERAI_MATI",
  ]),
  jenisKelamin: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
});

/* =======================
   FORM UTAMA
======================= */
export const formSchema = z.object({
  kondisi: z.string().min(1, "Pilih kondisi ahli waris"),
  dataPewaris: dataPewarisSchema,
  ahliWaris: z
    .array(dataKeluargaSchema)
    .min(1, "Minimal ada 1 ahli waris"),
  tambahanKeterangan: z.string().optional(),
});
