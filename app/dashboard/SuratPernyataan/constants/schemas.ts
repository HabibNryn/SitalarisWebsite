// app/dashboard/SuratPernyataan/constants/schemas.ts
import { z } from "zod";

/* =======================
   ENUM DEFINITIONS
======================= */
export const JenisKelaminEnum = z.enum(["LAKI-LAKI", "PEREMPUAN"]);
export const StatusPernikahanEnum = z.enum(["MENIKAH", "BELUM_MENIKAH", "CERAI_HIDUP", "CERAI_MATI"]);
export const HubunganEnum = z.enum(["ISTRI", "SUAMI", "ANAK", "CUCU", "SAUDARA", "ORANG_TUA", "LAINNYA"]);
export const KondisiEnum = z.enum([
  "kondisi1", 
  "kondisi2", 
  "kondisi3", 
  "kondisi4", 
  "kondisi5", 
  "kondisi6", 
  "kondisi7"
]);

/* =======================
   DATA KELUARGA (Ahli Waris)
======================= */
export const dataKeluargaSchema = z.object({
  id: z.string().optional(),
  // Data Diri - WAJIB
  nama: z.string().min(1, "Nama harus diisi"),
  hubungan: HubunganEnum,
  
  // Data Diri - OPSIONAL
  namaAyah: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  jenisKelamin: JenisKelaminEnum.default("LAKI-LAKI"),
  nik: z.string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK harus angka")
    .optional(),
  
  // Informasi Lain - OPSIONAL
  pekerjaan: z.string().optional(),
  agama: z.string().optional(),
  alamat: z.string().optional(),
  statusPernikahan: StatusPernikahanEnum.optional(),
  
  // Hubungan dengan Pewaris - WAJIB
  masihHidup: z.boolean().default(true),
  memilikiKeturunan: z.boolean().optional().default(false),
  keterangan: z.string().optional(),
});

/* =======================
   DATA PEWARIS
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
  
  // ==== DATA PERNIKAHAN - WAJIB ====
  statusPernikahan: StatusPernikahanEnum,
  
  // ==== DATA PERNIKAHAN - OPSIONAL (untuk yang sudah menikah) ====
  noSuratNikah: z.string().optional(),
  tanggalNikah: z.string().optional(),
  kuaNikah: z.string().optional(),
  
  // ==== INFORMASI TAMBAHAN - OPSIONAL ====
  pekerjaan: z.string().optional(),
  agama: z.string().optional(),
  nik: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
});

/* =======================
   FORM UTAMA
======================= */
export const formSchema = z.object({
  kondisi: KondisiEnum,
  dataPewaris: dataPewarisSchema,
  ahliWaris: z.array(dataKeluargaSchema).min(0, "Data ahli waris diperlukan"),
  tambahanKeterangan: z.string().optional(),
});

/* =======================
   VALIDASI KONDISI KHUSUS
======================= */
export const validateBasedOnKondisi = (data: z.infer<typeof formSchema>) => {
  const errors: string[] = [];
  const { kondisi, ahliWaris, dataPewaris } = data;

  const istriList = ahliWaris.filter(item => item.hubungan === "ISTRI");
  const suamiList = ahliWaris.filter(item => item.hubungan === "SUAMI");
  const anakList = ahliWaris.filter(item => item.hubungan === "ANAK");
  const saudaraList = ahliWaris.filter(item => item.hubungan === "SAUDARA");
  const cucuList = ahliWaris.filter(item => item.hubungan === "CUCU");

  switch (kondisi) {
    case "kondisi1":
    case "kondisi2":
    case "kondisi3":
      if (dataPewaris.jenisKelamin === "PEREMPUAN") {
        errors.push("Kondisi ini hanya untuk pewaris laki-laki");
      }
      if (dataPewaris.statusPernikahan !== "MENIKAH") {
        errors.push("Status pernikahan harus 'Menikah' untuk kondisi ini");
      }
      if (istriList.length !== 1) {
        errors.push("Harus ada 1 istri");
      }
      if (kondisi === "kondisi1" && anakList.length === 0) {
        errors.push("Kondisi 1 memerlukan minimal 1 anak");
      }
      if (kondisi === "kondisi3" && cucuList.length === 0) {
        errors.push("Kondisi 3 memerlukan minimal 1 cucu");
      }
      break;

    case "kondisi4":
      if (dataPewaris.jenisKelamin === "PEREMPUAN") {
        errors.push("Kondisi 2 istri hanya untuk pewaris laki-laki");
      }
      if (dataPewaris.statusPernikahan !== "MENIKAH") {
        errors.push("Status pernikahan harus 'Menikah' untuk kondisi ini");
      }
      if (istriList.length !== 2) {
        errors.push("Harus ada 2 istri");
      }
      if (anakList.length === 0) {
        errors.push("Minimal harus ada 1 anak");
      }
      break;

    case "kondisi5":
      if (dataPewaris.jenisKelamin !== "PEREMPUAN") {
        errors.push("Kondisi suami hidup hanya untuk pewaris perempuan");
      }
      if (dataPewaris.statusPernikahan !== "MENIKAH") {
        errors.push("Status pernikahan harus 'Menikah' untuk kondisi ini");
      }
      if (suamiList.length !== 1) {
        errors.push("Harus ada 1 suami");
      }
      if (anakList.length === 0) {
        errors.push("Minimal harus ada 1 anak");
      }
      break;

    case "kondisi6":
      if (istriList.length > 0 || suamiList.length > 0 || anakList.length > 0 || cucuList.length > 0) {
        errors.push("Tidak boleh ada istri/suami/anak/cucu untuk kondisi ini");
      }
      if (saudaraList.length > 0) {
        errors.push("Tidak boleh ada saudara untuk kondisi ini");
      }
      break;

    case "kondisi7":
      if (saudaraList.length === 0) {
        errors.push("Minimal harus ada 1 saudara kandung");
      }
      if (istriList.length > 0 || suamiList.length > 0 || anakList.length > 0 || cucuList.length > 0) {
        errors.push("Tidak boleh ada istri/suami/anak/cucu untuk kondisi ini");
      }
      break;
  }

  return errors;
};

/* =======================
   SCHEMA UNTUK DATABASE SUBMISSION
   (Simplified version for Prisma JSON storage)
======================= */
export const databaseSubmissionSchema = z.object({
  id: z.string().optional(),
  nomorSurat: z.string(),
  userId: z.string(),
  kondisi: z.string(),
  
  // Data Pewaris sebagai JSON
  dataPewaris: dataPewarisSchema,
  
  // Data Ahli Waris sebagai JSON array
  ahliWaris: z.array(dataKeluargaSchema),
  
  // Tambahan Keterangan
  tambahanKeterangan: z.string().optional(),
  
  // Status
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "COMPLETED"]),
  
  // Review Info
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewNotes: z.string().optional(),
  
  // PDF Info
  pdfUrl: z.string().optional(),
  pdfGenerated: z.boolean().default(false),
  
  // Timestamps
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/* =======================
   TYPES
======================= */
export type DataKeluargaType = z.infer<typeof dataKeluargaSchema>;
export type DataPewarisType = z.infer<typeof dataPewarisSchema>;
export type FormValues = z.infer<typeof formSchema>;
export type DatabaseSubmissionType = z.infer<typeof databaseSubmissionSchema>;
export type JenisKelaminType = z.infer<typeof JenisKelaminEnum>;
export type StatusPernikahanType = z.infer<typeof StatusPernikahanEnum>;
export type HubunganType = z.infer<typeof HubunganEnum>;
export type KondisiType = z.infer<typeof KondisiEnum>;

/* =======================
   DEFAULT VALUES
======================= */

export const defaultDataPewaris: DataPewarisType = {
  // Data Diri Pewaris - WAJIB
  nama: "",
  namaAyah: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "LAKI-LAKI",
  
  // Data Kematian - WAJIB
  tempatMeninggal: "",
  tanggalMeninggal: "",
  nomorAkteKematian: "",
  tanggalAkteKematian: "",
  
  // Alamat - WAJIB
  alamat: "",
  
  // Data Pernikahan - WAJIB
  statusPernikahan: "MENIKAH",
  
  // Data Pernikahan - OPSIONAL
  noSuratNikah: "",
  tanggalNikah: "",
  kuaNikah: "",
  
  // Informasi Tambahan - OPSIONAL
  pekerjaan: "",
  agama: "",
  nik: "",
  rt: "",
  rw: "",
};

export const defaultDataKeluarga: DataKeluargaType = {
  // Data Diri - WAJIB
  nama: "",
  hubungan: "ANAK",
  masihHidup: true,
  
  // Data Diri - OPSIONAL
  namaAyah: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "LAKI-LAKI",
  nik: "",
  
  // Informasi Lain - OPSIONAL
  pekerjaan: "",
  agama: "",
  alamat: "",
  statusPernikahan: undefined,
  memilikiKeturunan: false,
  keterangan: "",
};

export const defaultFormValues: FormValues = {
  kondisi: "kondisi1",
  dataPewaris: defaultDataPewaris,
  ahliWaris: [],
  tambahanKeterangan: "",
};

/* =======================
   TRANSFORM FUNCTIONS
======================= */
export function transformToDatabaseFormat(
  formData: FormValues,
  userId: string,
  nomorSurat: string
): DatabaseSubmissionType {
  // Validasi data sebelum transform
  const validationErrors = validateBasedOnKondisi(formData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(", "));
  }

  return {
    nomorSurat,
    userId,
    kondisi: formData.kondisi,
    dataPewaris: formData.dataPewaris,
    ahliWaris: formData.ahliWaris,
    tambahanKeterangan: formData.tambahanKeterangan || undefined,
    status: "PENDING",
    pdfGenerated: false,
  };
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

/* =======================
   VALIDATION RULES FOR EACH CONDITION
======================= */
export const kondisiFieldRequirements: Record<KondisiType, {
  requiredRelationships: DataKeluargaType["hubungan"][];
  optionalRelationships: DataKeluargaType["hubungan"][];
  minIstri?: number;
  minAnak?: number;
  minCucu?: number;
  minSaudara?: number;
  requiresMarried: boolean;
  pewarisGender: JenisKelaminType;
}> = {
  kondisi1: {
    requiredRelationships: ["ISTRI"],
    optionalRelationships: ["ANAK"],
    minAnak: 1,
    requiresMarried: true,
    pewarisGender: "LAKI-LAKI",
  },
  kondisi2: {
    requiredRelationships: ["ISTRI"],
    optionalRelationships: ["ANAK"],
    minAnak: 1,
    requiresMarried: true,
    pewarisGender: "LAKI-LAKI",
  },
  kondisi3: {
    requiredRelationships: ["ISTRI"],
    optionalRelationships: ["ANAK", "CUCU"],
    minAnak: 1,
    minCucu: 1,
    requiresMarried: true,
    pewarisGender: "LAKI-LAKI",
  },
  kondisi4: {
    requiredRelationships: ["ISTRI"],
    optionalRelationships: ["ANAK"],
    minIstri: 2,
    minAnak: 1,
    requiresMarried: true,
    pewarisGender: "LAKI-LAKI",
  },
  kondisi5: {
    requiredRelationships: ["SUAMI"],
    optionalRelationships: ["ANAK"],
    minAnak: 1,
    requiresMarried: true,
    pewarisGender: "PEREMPUAN",
  },
  kondisi6: {
    requiredRelationships: [],
    optionalRelationships: [],
    requiresMarried: false,
    pewarisGender: "LAKI-LAKI", // Bisa laki-laki atau perempuan
  },
  kondisi7: {
    requiredRelationships: ["SAUDARA"],
    optionalRelationships: [],
    minSaudara: 1,
    requiresMarried: false,
    pewarisGender: "LAKI-LAKI", // Bisa laki-laki atau perempuan
  },
};

/* =======================
   HELPER UNTUK FORM VALIDATION
======================= */
export const validateFormData = (formData: FormValues): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    // 1. Validasi schema dasar
    formSchema.parse(formData);
    
    // 2. Validasi kondisi khusus
    const conditionErrors = validateBasedOnKondisi(formData);
    errors.push(...conditionErrors);
    
    // 3. Validasi tambahan berdasarkan kondisi requirements
    const kondisi = formData.kondisi as KondisiType;
    const requirements = kondisiFieldRequirements[kondisi];
    
    if (requirements) {
      // Validasi gender pewaris
      if (formData.dataPewaris.jenisKelamin !== requirements.pewarisGender) {
        if (requirements.pewarisGender === "LAKI-LAKI") {
          errors.push(`Kondisi ${kondisi} hanya untuk pewaris laki-laki`);
        } else {
          errors.push(`Kondisi ${kondisi} hanya untuk pewaris perempuan`);
        }
      }
      
      // Validasi status pernikahan
      if (requirements.requiresMarried && formData.dataPewaris.statusPernikahan !== "MENIKAH") {
        errors.push(`Kondisi ${kondisi} memerlukan status pernikahan 'Menikah'`);
      }
      
      // Hitung jumlah berdasarkan hubungan
      const ahliWaris = formData.ahliWaris || [];
      const anakCount = ahliWaris.filter(a => a.hubungan === "ANAK").length;
      const istriCount = ahliWaris.filter(a => a.hubungan === "ISTRI").length;
      const suamiCount = ahliWaris.filter(a => a.hubungan === "SUAMI").length;
      const cucuCount = ahliWaris.filter(a => a.hubungan === "CUCU").length;
      const saudaraCount = ahliWaris.filter(a => a.hubungan === "SAUDARA").length;
      
      // Validasi jumlah minimal
      if (requirements.minAnak && anakCount < requirements.minAnak) {
        errors.push(`Kondisi ${kondisi} memerlukan minimal ${requirements.minAnak} anak`);
      }
      
      if (requirements.minCucu && cucuCount < requirements.minCucu) {
        errors.push(`Kondisi ${kondisi} memerlukan minimal ${requirements.minCucu} cucu`);
      }
      
      if (requirements.minSaudara && saudaraCount < requirements.minSaudara) {
        errors.push(`Kondisi ${kondisi} memerlukan minimal ${requirements.minSaudara} saudara`);
      }
      
      // Validasi jumlah istri/suami
      if (kondisi === "kondisi4" && istriCount !== 2) {
        errors.push("Kondisi 4 memerlukan tepat 2 istri");
      }
      
      if (kondisi === "kondisi5" && suamiCount !== 1) {
        errors.push("Kondisi 5 memerlukan tepat 1 suami");
      }
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.issues.map(err => `${err.path.join('.')}: ${err.message}`));
    } else if (error instanceof Error) {
      errors.push(error.message);
    } else {
      errors.push("Terjadi kesalahan validasi");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/* =======================
   HELPER UNTUK FORM SUBMISSION
======================= */
export const prepareFormDataForSubmit = (
  formData: FormValues,
  userId: string
): DatabaseSubmissionType => {
  // Generate nomor surat
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  const nomorSurat = `SP/${year}${month}${day}/${random}`;
  
  return transformToDatabaseFormat(formData, userId, nomorSurat);
};

/* =======================
   UTILITY FUNCTIONS
======================= */
export function formatDateForDisplay(dateString?: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return `${day} ${bulan[month]} ${year}`;
  } catch {
    return dateString;
  }
}

export function calculateUsia(tanggalLahir: string, tanggalMeninggal: string): number {
  try {
    const birthDate = new Date(tanggalLahir);
    const deathDate = new Date(tanggalMeninggal);
    
    if (isNaN(birthDate.getTime()) || isNaN(deathDate.getTime())) {
      return 0;
    }
    
    let usia = deathDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
      usia--;
    }
    
    return Math.max(0, usia);
  } catch {
    return 0;
  }
}

/* =======================
   FORM INITIALIZATION BASED ON CONDITION
======================= */
export function initializeFormForCondition(
  kondisi: KondisiType,
  existingData?: Partial<FormValues>
): FormValues {
  const baseForm: FormValues = {
    kondisi,
    dataPewaris: defaultDataPewaris,
    ahliWaris: [],
    tambahanKeterangan: "",
  };
  
  // Merge dengan existing data jika ada
  if (existingData) {
    baseForm.dataPewaris = { ...defaultDataPewaris, ...existingData.dataPewaris };
    baseForm.ahliWaris = existingData.ahliWaris || [];
    baseForm.tambahanKeterangan = existingData.tambahanKeterangan || "";
  }
  
  // Set data pewaris berdasarkan kondisi
  switch (kondisi) {
    case "kondisi1":
    case "kondisi2":
    case "kondisi3":
    case "kondisi4":
      baseForm.dataPewaris.jenisKelamin = "LAKI-LAKI";
      baseForm.dataPewaris.statusPernikahan = "MENIKAH";
      break;
      
    case "kondisi5":
      baseForm.dataPewaris.jenisKelamin = "PEREMPUAN";
      baseForm.dataPewaris.statusPernikahan = "MENIKAH";
      break;
      
    case "kondisi6":
    case "kondisi7":
      // Tidak ada set default untuk kondisi 6 dan 7
      break;
  }
  
  // Initialize ahli waris berdasarkan kondisi
  switch (kondisi) {
    case "kondisi1":
    case "kondisi2":
    case "kondisi3":
      baseForm.ahliWaris.push({
        ...defaultDataKeluarga,
        hubungan: "ISTRI",
        nama: "",
      });
      break;
      
    case "kondisi4":
      // 2 istri untuk kondisi 4
      baseForm.ahliWaris.push(
        { ...defaultDataKeluarga, hubungan: "ISTRI", nama: "" },
        { ...defaultDataKeluarga, hubungan: "ISTRI", nama: "" }
      );
      break;
      
    case "kondisi5":
      baseForm.ahliWaris.push({
        ...defaultDataKeluarga,
        hubungan: "SUAMI",
        nama: "",
      });
      break;
      
    case "kondisi7":
      baseForm.ahliWaris.push({
        ...defaultDataKeluarga,
        hubungan: "SAUDARA",
        nama: "",
      });
      break;
  }
  
  return baseForm;
}