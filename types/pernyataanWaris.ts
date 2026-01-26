// types/pernyataan-warisan.ts
export type JenisKelamin = 'LAKI-LAKI' | 'PEREMPUAN';
export type StatusPernikahan = 'MENIKAH' | 'BELUM_MENIKAH' | 'CERAI_HIDUP' | 'CERAI_MATI';
export type HubunganKeluarga = 'SUAMI' | 'ISTRI' | 'ANAK' | 'CUCU' | 'SAUDARA' | 'ORANG_TUA';

export interface DataKeluarga {
  nama: string;
  namaAyah: string;
  tempatLahir: string;
  tanggalLahir: string;
  pekerjaan: string;
  agama: string;
  alamat: string;
  nik: string;
  jenisKelamin: JenisKelamin;
  statusPernikahan: StatusPernikahan;
  hubungan: HubunganKeluarga;
  masihHidup: boolean;
  memilikiKeturunan: boolean;
}

export interface DataPewaris {
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  tempatMeninggal: string;
  tanggalMeninggal: string;
  nomorAkteKematian: string;
  alamat: string;
  statusPernikahan: StatusPernikahan;
  jenisKelamin: JenisKelamin;
  rtPewaris: string;
  rwPewaris: string;
  namaAyah: string;
  noSuratNikah: string;
  tanggalNikah: string;
  instansiNikah: string;
}

export interface FormDataPernyataan {
  dataPewaris: DataPewaris;
  kondisi: string;
  ahliWaris: DataKeluarga[];
  tambahanKeterangan?: string;
}