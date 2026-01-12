import { DataKeluargaType } from "../types";

/**
 * Helper untuk mengelompokkan istri dengan anak-anaknya
 */
export const kelompokkanKeluarga = (ahliWaris: DataKeluargaType[]): {
  kelompokIstri: Array<{
    istriIndex: number;
    istriData: DataKeluargaType;
    anakIndices: number[];
  }>;
  kelompokLain: number[];
} => {
  const istriIndices: number[] = [];
  const anakIndices: number[] = [];
  const kelompokLain: number[] = [];

  // Identifikasi indeks berdasarkan hubungan
  ahliWaris.forEach((data, index) => {
    if (data.hubungan === "ISTRI") {
      istriIndices.push(index);
    } else if (data.hubungan === "ANAK") {
      anakIndices.push(index);
    } else {
      kelompokLain.push(index);
    }
  });

  // Untuk setiap istri, cari anak-anak yang terkait berdasarkan keterangan
  const kelompokIstri = istriIndices.map((istriIndex, istriNumber) => {
    const istriData = ahliWaris[istriIndex];
    const anakIstri = anakIndices.filter(anakIndex => {
      const anakData = ahliWaris[anakIndex];
      // Logika: jika keterangan mengandung "Istri {X}" atau berdasarkan urutan
      if (anakData.keterangan?.includes(`Istri ${istriNumber + 1}`)) {
        return true;
      }
      // Fallback: jika tidak ada keterangan, bagi anak secara merata
      return false;
    });

    return {
      istriIndex,
      istriData,
      anakIndices: anakIstri,
    };
  });

  return {
    kelompokIstri,
    kelompokLain,
  };
};

/**
 * Mendapatkan total anak per istri untuk kondisi 4 (pernikahan 2 kali)
 */
export const getAnakPerIstri = (totalAnak: number): number[] => {
  // Default: bagi rata anak ke setiap istri
  const anakPerIstri1 = Math.ceil(totalAnak / 2);
  const anakPerIstri2 = totalAnak - anakPerIstri1;
  return [anakPerIstri1, anakPerIstri2];
};

/**
 * Update keterangan anak berdasarkan istri
 */
export const updateKeteranganAnak = (
  ahliWaris: DataKeluargaType[],
  istriNumber: number,
  anakNumber: number,
  anakIndex: number
): DataKeluargaType[] => {
  const updated = [...ahliWaris];
  if (updated[anakIndex]) {
    updated[anakIndex] = {
      ...updated[anakIndex],
      keterangan: `Anak dari Istri ${istriNumber} - Anak ${anakNumber}`,
    };
  }
  return updated;
};