export const defaultAhliWaris = {
  nama: "",
  namaAyah: "",
  tempatLahir: "",
  tanggalLahir: "",
  pekerjaan: "",
  agama: "",
  alamat: "",
  nik: "",
  jenisKelamin: "LAKI-LAKI" as const,
  statusPernikahan: "BELUM_MENIKAH" as const,
  hubungan: "ANAK" as const,
  masihHidup: true,
  memilikiKeturunan: false,
  keterangan: "",
};

export const defaultDataPewaris = {
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  tempatMeninggal: "",
  tanggalMeninggal: "",
  nomorAkteKematian: "",
  alamat: "",
  statusPernikahan: "MENIKAH" as const,
  jenisKelamin: "LAKI-LAKI" as const,
};

// Template untuk istri dengan identifier
export const templateIstri = (istriNumber: number = 1) => ({
  ...defaultAhliWaris,
  hubungan: "ISTRI" as const,
  jenisKelamin: "PEREMPUAN" as const,
  statusPernikahan: "MENIKAH" as const,
  keterangan: `Istri ${istriNumber} Pewaris`,
});

// Template untuk anak dengan identifier istri
export const templateAnakDariIstri = (istriNumber: number = 1, anakNumber: number = 1) => ({
  ...defaultAhliWaris,
  hubungan: "ANAK" as const,
  keterangan: `Anak dari Istri ${istriNumber} - Anak ${anakNumber}`,
});