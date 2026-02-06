// app/dashboard/SuratPernyataan/types/index.ts
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { 
  dataKeluargaSchema, 
  dataPewarisSchema, 
  formSchema,
  JenisKelaminEnum,
  StatusPernikahanEnum,
  HubunganEnum,
  KondisiEnum,
  StatusHidupEnum
} from "../constants/schemas";

// Export semua enum types
export type JenisKelaminType = z.infer<typeof JenisKelaminEnum>;
export type StatusPernikahanType = z.infer<typeof StatusPernikahanEnum>;
export type HubunganType = z.infer<typeof HubunganEnum>;
export type KondisiType = z.infer<typeof KondisiEnum>;
export type StatusHidupType = z.infer<typeof StatusHidupEnum>;

// Main schema types
export type DataKeluargaType = z.infer<typeof dataKeluargaSchema>;
export type DataPewarisType = z.infer<typeof dataPewarisSchema>;
// For react-hook-form, use input type (Zod defaults make some fields optional on input)
export type FormValues = z.input<typeof formSchema>;

// Extended interface dengan semua properti
export interface DataKeluargaExtended extends DataKeluargaType {
  id?: string;
  nama: string;
  hubungan: HubunganType;
  jenisKelamin: JenisKelaminType;
  statusPernikahan?: StatusPernikahanType;
  namaAyah: string;
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  pekerjaan: string;
  agama: string;
  alamat: string;
  keterangan?: string;
  statusHidup: StatusHidupType;
  memilikiKeturunan: boolean;
  urutan?: number;
  asalIstri?: "PERTAMA" | "KEDUA";
}

export interface DataPewarisExtended extends DataPewarisType {
  nama: string;
  namaAyah: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelaminType;
  tempatMeninggal: string;
  tanggalMeninggal: string;
  nomorAkteKematian: string;
  tanggalAkteKematian: string;
  alamat: string;
  rt: string;
  rw: string;
  statusPernikahan: StatusPernikahanType;
  noSuratNikah: string;
  tanggalNikah: string;
  instansiNikah: string;
  noSuratNikahKedua: string;
  tanggalNikahKedua: string;
  instansiNikahKedua: string;
  pekerjaan?: string;
  agama: string;
  nik: string;
}

export interface FormValuesExtended extends FormValues {
  kondisi: KondisiType;
  dataPewaris: DataPewarisExtended;
  ahliWaris: DataKeluargaExtended[];
  tambahanKeterangan?: string;
}

// Interface untuk kondisi ahli waris
export interface KondisiAhliWaris {
  id: KondisiType;
  label: string;
  description: string;
  pewarisGender?: "LAKI-LAKI" | "PEREMPUAN";
  requiresMarried?: boolean;
  minAnak?: number;
  maxIstri?: number;
  allowsCucu?: boolean;
}

// Interface untuk kelompok keluarga (khusus kondisi 4)
export interface KeluargaKelompok {
  istriId?: string;
  istriIndex: number;
  anakIndices: number[];
  istriData: DataKeluargaExtended;
  asalIstri: "PERTAMA" | "KEDUA";
}

// Interface untuk rendering kelompok form
export interface KelompokRendering {
  istriIndex: number;
  istriNumber: number;
  anakIndices: number[];
  totalAnak: number;
  asalIstri: "PERTAMA" | "KEDUA";
}

// Interface untuk form props
export interface FormKeluargaProps {
  form: UseFormReturn<FormValues>;
  index: number;
  hubunganDefault: HubunganType;
  showKeterangan?: boolean;
  isReadOnly?: boolean;
}

// Interface untuk AhliWarisForm props
export interface AhliWarisFormProps {
  form: UseFormReturn<FormValues>;
  onAdd?: (hubungan: HubunganType) => void;
  onRemove?: (index: number) => void;
  maxItems?: number;
}

// Interface untuk status hidup toggle
export interface StatusHidupToggleProps {
  index: number;
  isAlive: boolean;
  onChange: (index: number, isAlive: boolean) => void;
}

// Interface untuk keturunan toggle
export interface KeturunanToggleProps {
  index: number;
  hasDescendants: boolean;
  onChange: (index: number, hasDescendants: boolean) => void;
}

// Interface untuk validasi hasil
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Interface untuk summary statistik
export interface AhliWarisSummary {
  total: number;
  istri: number;
  suami: number;
  anak: number;
  anakHidup: number;
  anakMeninggal: number;
  cucu: number;
  saudara: number;
  orangTua: number;
}

// Helper function untuk mendapatkan summary
export function getAhliWarisSummary(ahliWaris: DataKeluargaExtended[]): AhliWarisSummary {
  const istri = ahliWaris.filter(a => a.hubungan === "ISTRI");
  const suami = ahliWaris.filter(a => a.hubungan === "SUAMI");
  const anak = ahliWaris.filter(a => a.hubungan === "ANAK");
  const cucu = ahliWaris.filter(a => a.hubungan === "CUCU");
  const saudara = ahliWaris.filter(a => a.hubungan === "SAUDARA");
  const orangTua = ahliWaris.filter(a => a.hubungan === "ORANG_TUA");

  return {
    total: ahliWaris.length,
    istri: istri.length,
    suami: suami.length,
    anak: anak.length,
    anakHidup: anak.filter(a => a.statusHidup === "HIDUP").length,
    anakMeninggal: anak.filter(a => a.statusHidup === "MENINGGAL").length,
    cucu: cucu.length,
    saudara: saudara.length,
    orangTua: orangTua.length,
  };
}

// Type untuk action form
export type FormAction = 
  | { type: 'ADD_AHLI_WARIS'; payload: DataKeluargaExtended }
  | { type: 'REMOVE_AHLI_WARIS'; payload: number }
  | { type: 'UPDATE_AHLI_WARIS'; payload: { index: number; data: Partial<DataKeluargaExtended> } }
  | { type: 'UPDATE_PEWARIS'; payload: Partial<DataPewarisExtended> }
  | { type: 'SET_KONDISI'; payload: KondisiType }
  | { type: 'RESET_FORM' };

// Type untuk database submission
export interface DatabaseSubmission {
  id?: string;
  nomorSurat: string;
  userId: string;
  kondisi: KondisiType;
  dataPewaris: DataPewarisExtended;
  ahliWaris: DataKeluargaExtended[];
  tambahanKeterangan?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
  pdfUrl?: string;
  isGenerated?: boolean;
}

// Type untuk PDF generation data
export interface PDFGenerationData {
  dataPewaris: DataPewarisExtended;
  ahliWaris: DataKeluargaExtended[];
  kondisi: KondisiType;
  tanggalSurat: string;
  nomorSurat?: string;
}

// Type untuk filter dan sort
export interface AhliWarisFilter {
  hubungan?: HubunganType[];
  statusHidup?: boolean;
  memilikiKeturunan?: boolean;
  search?: string;
}

// Constants untuk hubungan labels
export const HUBUNGAN_LABELS: Record<HubunganType, string> = {
  ISTRI: "Istri",
  SUAMI: "Suami",
  ANAK: "Anak",
  CUCU: "Cucu",
  SAUDARA: "Saudara Kandung",
  ORANG_TUA: "Orang Tua",
  LAINNYA: "Lainnya",
};

// Constants untuk kondisi labels
export const KONDISI_LABELS: Record<KondisiType, string> = {
  kondisi1: "Pewaris memiliki 1 istri dan semua anak masih hidup",
  kondisi2: "Pewaris memiliki 1 istri dan ada anak yang meninggal",
  kondisi3: "Pewaris memiliki 1 istri, ada anak yang meninggal dan memiliki cucu",
  kondisi4: "Pewaris menikah 2 kali",
  kondisi5: "Suami pewaris masih hidup",
  kondisi6: "Pewaris tidak memiliki keturunan",
  kondisi7: "Pewaris tidak memiliki keturunan dan hanya memiliki saudara kandung",
};

// Utility types untuk form handling
export type FormFieldName = 
  | `ahliWaris.${number}.nama`
  | `ahliWaris.${number}.namaAyah`
  | `ahliWaris.${number}.nik`
  | `ahliWaris.${number}.tempatLahir`
  | `ahliWaris.${number}.tanggalLahir`
  | `ahliWaris.${number}.pekerjaan`
  | `ahliWaris.${number}.agama`
  | `ahliWaris.${number}.jenisKelamin`
  | `ahliWaris.${number}.statusPernikahan`
  | `ahliWaris.${number}.hubungan`
  | `ahliWaris.${number}.alamat`
  | `ahliWaris.${number}.keterangan`
  | `ahliWaris.${number}.status`
  | `ahliWaris.${number}.memilikiKeturunan`
  | `ahliWaris.${number}.urutan`
  | `ahliWaris.${number}.asalIstri`;

// Export semua type untuk digunakan di seluruh aplikasi
export {
  // Re-export dari schemas untuk kemudahan
  dataKeluargaSchema,
  dataPewarisSchema,
  formSchema,
  JenisKelaminEnum,
  StatusPernikahanEnum,
  HubunganEnum,
  KondisiEnum,
  StatusHidupEnum,
};
