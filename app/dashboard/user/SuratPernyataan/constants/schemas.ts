// app/dashboard/SuratPernyataan/constants/schemas.ts
import { z } from "zod";

/* =======================
   ENUM DEFINITIONS
======================= */
export const JenisKelaminEnum = z.enum(["LAKI-LAKI", "PEREMPUAN"]);
export const StatusPernikahanEnum = z.enum([
  "MENIKAH",
  "BELUM_MENIKAH",
  "CERAI_HIDUP",
  "CERAI_MATI",
]);
export const HubunganEnum = z.enum([
  "ISTRI",
  "SUAMI",
  "ANAK",
  "CUCU",
  "SAUDARA",
  "ORANG_TUA",
  "LAINNYA",
]);
export const KondisiEnum = z.enum([
  "kondisi1",
  "kondisi2",
  "kondisi3",
  "kondisi4",
  "kondisi5",
  "kondisi6",
  "kondisi7",
]);
export const StatusHidupEnum = z.enum(["HIDUP", "MENINGGAL"]);

/* =======================
   DATA KELUARGA (Ahli Waris) - DIPERBARUI
======================= */
export const dataKeluargaSchema = z.object({
  id: z.string().optional(),
  // Data Diri - WAJIB
  nama: z.string().min(1, "Nama harus diisi"),
  hubungan: HubunganEnum,
  jenisKelamin: JenisKelaminEnum,
  
  // Data tambahan berdasarkan template surat
  namaAyah: z.string().min(1, "Nama ayah harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  
  // Informasi dari template surat
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  agama: z.string().min(1, "Agama harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  nik: z.string().min(1, "NIK harus diisi"),
  
  // Status hidup - penting untuk kondisi 2 dan 3
  statusHidup: StatusHidupEnum.default("HIDUP"),
  statusPernikahan: StatusPernikahanEnum.optional(),
  memilikiKeturunan: z.boolean().default(false),
  
  // Keterangan tambahan
  keterangan: z.string().optional(),
  urutan: z.number().optional(), // untuk urutan penampilan
  asalIstri: z.enum(["PERTAMA", "KEDUA"]).optional(), // untuk kondisi 4
  nomorSuratNikah: z.string().optional(), // untuk data tambahan jika perlu
});

/* =======================
   ANAK MENINGGAL - UNTUK KONDISI 2 DAN 3
======================= */
export const anakMeninggalSchema = z.object({
  id: z.string().optional(),
  nama: z.string().min(1, "Nama anak meninggal harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir anak meninggal harus diisi"),
  tanggalMeninggal: z.string().min(1, "Tanggal meninggal anak harus diisi"),
  nomorAkteKematian: z.string().min(1, "Nomor akte kematian harus diisi"),
  tanggalAkteKematian: z.string().min(1, "Tanggal akte kematian harus diisi"),
  memilikiKeturunan: z.boolean().default(false),
  // Data pernikahan jika sudah menikah
  sudahMenikah: z.boolean().default(false),
  namaPasangan: z.string().min(1, "Nama pasangan dari anak yang sudah meninggal harus diisi"),
  nomorSuratNikah: z.string().min(1, "Nomor surat nikah harus diisi"),
  tanggalNikah: z.string().min(1, "Tanggal nikah harus diisi"),
  instansiNikah: z.string().min(1, "Instansi nikah harus diisi"),
});

/* =======================
   DATA PEWARIS - DIPERBARUI
======================= */
export const dataPewarisSchema = z.object({
  // ==== DATA DIRI PEWARIS - WAJIB ====
  nama: z.string().min(1, "Nama pewaris harus diisi"),
  namaAyah: z.string().min(1, "Nama ayah pewaris harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir pewaris harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir pewaris harus diisi"),
  jenisKelamin: JenisKelaminEnum,

  // ==== DATA KEMATIAN - WAJIB ====
  tempatMeninggal: z.string().min(1, "Tempat meninggal pewaris harus diisi"),
  tanggalMeninggal: z.string().min(1, "Tanggal meninggal pewaris harus diisi"),
  nomorAkteKematian: z.string().min(1, "Nomor akte kematian harus diisi"),
  tanggalAkteKematian: z.string().min(1, "Tanggal akte kematian harus diisi"),

  // ==== ALAMAT - WAJIB ====
  alamat: z.string().min(1, "Alamat pewaris harus diisi"),
  rt: z.string().min(1, "RT pewaris harus diisi"),
  rw: z.string().min(1, "RW pewaris harus diisi"),
  kelurahan: z.string().default("Grogol"),
  kecamatan: z.string().default("Grogol Petamburan"),
  kota: z.string().default("Jakarta Barat"),
  provinsi: z.string().default("DKI Jakarta"),

  // ==== DATA PERNIKAHAN - WAJIB UNTUK YANG MENIKAH ====
  statusPernikahan: StatusPernikahanEnum,

  // ==== DATA PERNIKAHAN PERTAMA - OPSIONAL ====
  noSuratNikah: z.string().min(1, "Nomor surat nikah harus diisi"),
  tanggalNikah: z.string().min(1, "Tanggal nikah harus diisi"),
  instansiNikah: z.string().min(1, "Instansi nikah harus diisi"),

  // ==== DATA PERNIKAHAN KEDUA - UNTUK KONDISI 4 ====
  noSuratNikahKedua: z.string().optional(),
  tanggalNikahKedua: z.string().optional(),
  instansiNikahKedua: z.string().optional(),

  // ==== INFORMASI TAMBAHAN - OPSIONAL ====
  pekerjaan: z.string().optional(),
  agama: z.string().min(1, "Agama pewaris harus diisi"),
  nik: z.string().optional(),
  
  // ==== JUMLAH UNTUK STATISTIK ====
  jumlahAnak: z.number().optional(),
  jumlahCucu: z.number().optional(),
  jumlahSaudara: z.number().optional(),
  jumlahIstri: z.number().optional(),
});

/* =======================
   FORM UTAMA - DIPERBARUI
======================= */
export const formSchema = z.object({
  kondisi: KondisiEnum,
  dataPewaris: dataPewarisSchema,
  ahliWaris: z.array(dataKeluargaSchema).min(1, "Minimal 1 ahli waris diperlukan"),
  anakMeninggal: z.array(anakMeninggalSchema).optional(), // Untuk kondisi 2 dan 3
  tambahanKeterangan: z.string().optional(),
});

/* =======================
   TYPES
======================= */
export type DataKeluargaType = z.infer<typeof dataKeluargaSchema>;
export type AnakMeninggalType = z.infer<typeof anakMeninggalSchema>;
export type DataPewarisType = z.infer<typeof dataPewarisSchema>;
// NOTE: For react-hook-form, we want the input type (before Zod defaults apply).
export type FormValues = z.input<typeof formSchema>;
export type FormValuesOutput = z.output<typeof formSchema>;
export type JenisKelaminType = z.infer<typeof JenisKelaminEnum>;
export type StatusPernikahanType = z.infer<typeof StatusPernikahanEnum>;
export type HubunganType = z.infer<typeof HubunganEnum>;
export type KondisiType = z.infer<typeof KondisiEnum>;
export type StatusHidupType = z.infer<typeof StatusHidupEnum>;
// export type FormValuesExtended = FormValues & {
//   dataPewaris: DataPewarisType & {
//     jumlahAnak: number;
//     jumlahCucu: number;
//     jumlahSaudara: number;
//     jumlahIstri: number;
//   };
// };

/* =======================
   DEFAULT VALUES - DIPERBARUI
======================= */

export const defaultDataPewaris: DataPewarisType = {
  // Data Diri Pewaris - WAJIB
  nama: "",
  namaAyah: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: JenisKelaminEnum.options[0],

  // Data Kematian - WAJIB
  tempatMeninggal: "",
  tanggalMeninggal: "",
  nomorAkteKematian: "",
  tanggalAkteKematian: "",

  // Alamat - WAJIB
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "Grogol",
  kecamatan: "Grogol Petamburan",
  kota: "Jakarta Barat",
  provinsi: "DKI Jakarta",

  // Data Pernikahan - WAJIB
  statusPernikahan: StatusPernikahanEnum.options[0],

  // Data Pernikahan - OPSIONAL
  noSuratNikah: "",
  tanggalNikah: "",
  instansiNikah: "",

  // Data Pernikahan Kedua - OPSIONAL
  noSuratNikahKedua: "",
  tanggalNikahKedua: "",
  instansiNikahKedua: "",

  // Informasi Tambahan - OPSIONAL
  pekerjaan: "",
  agama: "",
  nik: "",
};

export const defaultDataKeluarga: DataKeluargaType = {
  // Data Diri - WAJIB
  nama: "",
  hubungan: "ANAK",
  jenisKelamin: JenisKelaminEnum.options[0],
  statusHidup: StatusHidupEnum.options[0],

  // Data Diri - OPSIONAL
  namaAyah: "",
  tempatLahir: "",
  tanggalLahir: "",

  // Informasi Lain - OPSIONAL
  pekerjaan: "",
  agama: "",
  alamat: "",
  nik: "",
  keterangan: "",
  memilikiKeturunan: false,
};

export const defaultAnakMeninggal: AnakMeninggalType = {
  nama: "",
  tanggalLahir: "",
  tanggalMeninggal: "",
  nomorAkteKematian: "",
  tanggalAkteKematian: "",
  memilikiKeturunan: false,
  sudahMenikah: false,
  namaPasangan: "",
  nomorSuratNikah: "",
  tanggalNikah: "",
  instansiNikah: "",
};

export const defaultFormValues: FormValues = {
  kondisi: "kondisi1",
  dataPewaris: defaultDataPewaris,
  ahliWaris: [],
  anakMeninggal: [],
  tambahanKeterangan: "",
};

/* =======================
   HELPER FUNCTIONS - DIPERBARUI
======================= */

// Fungsi untuk menentukan jumlah ahli waris berdasarkan kondisi
export function getJumlahAhliWaris(ahliWaris: DataKeluargaType[]): {
  jumlahAnak: number;
  jumlahIstri: number;
  jumlahSaudara: number;
  jumlahCucu: number;
} {
  const jumlahAnak = ahliWaris.filter((a) => a.hubungan === "ANAK").length;
  const jumlahIstri = ahliWaris.filter((a) => a.hubungan === "ISTRI").length;
  const jumlahSaudara = ahliWaris.filter((a) => a.hubungan === "SAUDARA").length;
  const jumlahCucu = ahliWaris.filter((a) => a.hubungan === "CUCU").length;
  
  return {
    jumlahAnak,
    jumlahIstri,
    jumlahSaudara,
    jumlahCucu,
  };
}

// Fungsi untuk validasi kondisi
export const validateBasedOnKondisi = (data: FormValues): string[] => {
  const errors: string[] = [];
  const { kondisi, ahliWaris, dataPewaris, anakMeninggal } = data;

  // Filter berdasarkan hubungan
  const istriList = ahliWaris.filter((item) => item.hubungan === "ISTRI");
  const suamiList = ahliWaris.filter((item) => item.hubungan === "SUAMI");
  const anakList = ahliWaris.filter((item) => item.hubungan === "ANAK");
  const saudaraList = ahliWaris.filter((item) => item.hubungan === "SAUDARA");
  const cucuList = ahliWaris.filter((item) => item.hubungan === "CUCU");
  const anakHidup = anakList.filter((item) => item.statusHidup === "HIDUP");
  const anakMeninggalList = anakList.filter((item) => item.statusHidup === "MENINGGAL");

  switch (kondisi) {
    case "kondisi1":
      // 1 istri, semua anak masih hidup
      if (dataPewaris.jenisKelamin !== "LAKI-LAKI") {
        errors.push("Kondisi 1 hanya untuk pewaris laki-laki");
      }
      if (istriList.length !== 1) {
        errors.push("Harus ada 1 istri untuk kondisi 1");
      }
      if (anakList.length === 0) {
        errors.push("Minimal 1 anak untuk kondisi 1");
      }
      if (anakMeninggalList.length > 0) {
        errors.push("Semua anak harus masih hidup untuk kondisi 1");
      }
      break;

    case "kondisi2":
      // 1 istri, ada anak yang meninggal (tanpa keturunan)
      if (dataPewaris.jenisKelamin !== "LAKI-LAKI") {
        errors.push("Kondisi 2 hanya untuk pewaris laki-laki");
      }
      if (istriList.length !== 1) {
        errors.push("Harus ada 1 istri untuk kondisi 2");
      }
      if (anakHidup.length === 0 && anakMeninggalList.length === 0) {
        errors.push("Minimal 1 anak untuk kondisi 2");
      }
      if (anakMeninggalList.length === 0) {
        errors.push("Harus ada anak yang meninggal untuk kondisi 2");
      }
      if (cucuList.length > 0) {
        errors.push("Tidak boleh ada cucu untuk kondisi 2");
      }
      break;

    case "kondisi3":
      // 1 istri, ada anak yang meninggal (dengan keturunan/cucu)
      if (dataPewaris.jenisKelamin !== "LAKI-LAKI") {
        errors.push("Kondisi 3 hanya untuk pewaris laki-laki");
      }
      if (istriList.length !== 1) {
        errors.push("Harus ada 1 istri untuk kondisi 3");
      }
      if (anakHidup.length === 0 && anakMeninggalList.length === 0) {
        errors.push("Minimal 1 anak untuk kondisi 3");
      }
      if (anakMeninggalList.length === 0) {
        errors.push("Harus ada anak yang meninggal untuk kondisi 3");
      }
      if (cucuList.length === 0) {
        errors.push("Harus ada cucu untuk kondisi 3");
      }
      break;

    case "kondisi4":
      // Menikah 2 kali
      if (dataPewaris.jenisKelamin !== "LAKI-LAKI") {
        errors.push("Kondisi 4 hanya untuk pewaris laki-laki");
      }
      if (istriList.length !== 2) {
        errors.push("Harus ada 2 istri untuk kondisi 4");
      }
      if (anakList.length === 0) {
        errors.push("Minimal 1 anak untuk kondisi 4");
      }
      break;

    case "kondisi5":
      // Suami pewaris masih hidup (pewaris perempuan)
      if (dataPewaris.jenisKelamin !== "PEREMPUAN") {
        errors.push("Kondisi 5 hanya untuk pewaris perempuan");
      }
      if (suamiList.length !== 1) {
        errors.push("Harus ada 1 suami untuk kondisi 5");
      }
      if (anakList.length === 0) {
        errors.push("Minimal 1 anak untuk kondisi 5");
      }
      break;

    case "kondisi6":
      // Tidak memiliki keturunan (meninggalkan orang tua dan saudara)
      if (anakList.length > 0 || cucuList.length > 0) {
        errors.push("Tidak boleh ada anak atau cucu untuk kondisi 6");
      }
      if (istriList.length > 0 || suamiList.length > 0) {
        errors.push("Tidak boleh ada istri/suami untuk kondisi 6");
      }
      break;

    case "kondisi7":
      // Tidak memiliki keturunan, hanya saudara kandung
      if (anakList.length > 0 || cucuList.length > 0) {
        errors.push("Tidak boleh ada anak atau cucu untuk kondisi 7");
      }
      if (istriList.length > 0 || suamiList.length > 0) {
        errors.push("Tidak boleh ada istri/suami untuk kondisi 7");
      }
      if (saudaraList.length === 0) {
        errors.push("Minimal 1 saudara kandung untuk kondisi 7");
      }
      break;
  }

  return errors;
};

/* =======================
   FUNGSI INISIALISASI FORM BERDASARKAN KONDISI
======================= */

export function initializeFormForCondition(
  kondisi: KondisiType,
): FormValues {
  const baseForm: FormValues = {
    kondisi,
    dataPewaris: { ...defaultDataPewaris },
    ahliWaris: [],
    anakMeninggal: [],
    tambahanKeterangan: "",
  };

  // Set default untuk data pewaris berdasarkan kondisi
  switch (kondisi) {
    case "kondisi1":
    case "kondisi2":
    case "kondisi3":
    case "kondisi4":
      baseForm.dataPewaris.jenisKelamin = "LAKI-LAKI";
      baseForm.dataPewaris.statusPernikahan = "MENIKAH";
      // Tambah 1 istri default
      baseForm.ahliWaris.push({
        ...defaultDataKeluarga,
        hubungan: "ISTRI",
        nama: "",
        jenisKelamin: "PEREMPUAN",
      });
      break;

    case "kondisi5":
      baseForm.dataPewaris.jenisKelamin = "PEREMPUAN";
      baseForm.dataPewaris.statusPernikahan = "MENIKAH";
      // Tambah 1 suami default
      baseForm.ahliWaris.push({
        ...defaultDataKeluarga,
        hubungan: "SUAMI",
        nama: "",
        jenisKelamin: "LAKI-LAKI",
      });
      break;

    case "kondisi4":
      // Tambah 2 istri untuk kondisi 4
      baseForm.ahliWaris.push(
        {
          ...defaultDataKeluarga,
          hubungan: "ISTRI",
          nama: "",
          jenisKelamin: "PEREMPUAN",
          urutan: 1,
          asalIstri: "PERTAMA",
        },
        {
          ...defaultDataKeluarga,
          hubungan: "ISTRI",
          nama: "",
          jenisKelamin: "PEREMPUAN",
          urutan: 2,
          asalIstri: "KEDUA",
        }
      );
      break;

    case "kondisi7":
      // Tambah 1 saudara default untuk kondisi 7
      baseForm.ahliWaris.push({
        ...defaultDataKeluarga,
        hubungan: "SAUDARA",
        nama: "",
      });
      break;
  }

  return baseForm;
}

/* =======================
   HELPER FUNCTIONS UNTUK UI
======================= */

export function getKondisiLabel(kondisi: string): string {
  const kondisiMap: Record<string, string> = {
    kondisi1: "Pewaris memiliki 1 istri dan semua anak masih hidup",
    kondisi2: "Pewaris memiliki 1 istri dan ada anak yang meninggal",
    kondisi3: "Pewaris memiliki 1 istri, ada anak yang meninggal dan memiliki cucu",
    kondisi4: "Pewaris menikah 2 kali",
    kondisi5: "Suami pewaris masih hidup",
    kondisi6: "Pewaris tidak memiliki keturunan",
    kondisi7: "Pewaris tidak memiliki keturunan dan hanya memiliki saudara kandung",
  };
  return kondisiMap[kondisi] || kondisi;
}

export function getHubunganLabel(hubungan: HubunganType): string {
  const hubunganMap: Record<HubunganType, string> = {
    ISTRI: "Istri",
    SUAMI: "Suami",
    ANAK: "Anak",
    CUCU: "Cucu",
    SAUDARA: "Saudara Kandung",
    ORANG_TUA: "Orang Tua",
    LAINNYA: "Lainnya",
  };
  return hubunganMap[hubungan] || hubungan;
}

export function formatDateForDisplay(dateString?: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${day} ${bulan[month]} ${year}`;
  } catch {
    return dateString;
  }
}

/* =======================
   FUNGSI UNTUK MAPPING KE DATABASE
======================= */

export interface DatabaseSubmissionData {
  nomorSurat: string;
  userId: string;
  kondisi: string;
  dataPewaris: DataPewarisType;
  ahliWaris: DataKeluargaType[];
  anakMeninggal?: AnakMeninggalType[];
  tambahanKeterangan?: string;
  status: string;
}

export function prepareDatabaseData(
  formData: FormValues,
  userId: string,
  nomorSurat: string,
): DatabaseSubmissionData {
  // Normalize defaults and ensure output types
  const parsed = formSchema.parse(formData);
  // Validasi
  const validationErrors = validateBasedOnKondisi(parsed);
  if (validationErrors.length > 0) {
    throw new Error(`Validasi gagal: ${validationErrors.join(", ")}`);
  }

  // Hitung jumlah
  const jumlah = getJumlahAhliWaris(parsed.ahliWaris);

  // Update data pewaris dengan jumlah
  const dataPewarisDenganJumlah = {
    ...parsed.dataPewaris,
    jumlahAnak: jumlah.jumlahAnak,
    jumlahIstri: jumlah.jumlahIstri,
    jumlahSaudara: jumlah.jumlahSaudara,
    jumlahCucu: jumlah.jumlahCucu,
  };

  return {
    nomorSurat,
    userId,
    kondisi: parsed.kondisi,
    dataPewaris: dataPewarisDenganJumlah,
    ahliWaris: parsed.ahliWaris,
    anakMeninggal: parsed.anakMeninggal,
    tambahanKeterangan: parsed.tambahanKeterangan,
    status: "DRAFT",
  };
}
