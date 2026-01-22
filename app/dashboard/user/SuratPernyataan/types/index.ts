import { z } from "zod";
import { 
  dataKeluargaSchema, 
  dataPewarisSchema, 
  formSchema 
} from "../constants/schemas";

export type DataKeluargaType = z.infer<typeof dataKeluargaSchema>;
export type DataPewarisType = z.infer<typeof dataPewarisSchema>;
export type FormValues = z.infer<typeof formSchema>;

export interface KondisiAhliWaris {
  id: string;
  label: string;
  description: string;
}

// Interface untuk kelompok istri dan anak-anaknya
export interface KeluargaKelompok {
  istriId: string;
  istriIndex: number;
  anakIndices: number[];
  istriData: DataKeluargaType;
}

// Interface untuk render form
export interface KelompokRendering {
  istriIndex: number;
  istriNumber: number;
  anakIndices: number[];
  totalAnak: number;
}