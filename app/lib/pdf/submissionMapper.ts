import { FormValues } from "@/app/dashboard/user/SuratPernyataan/types";

type RawSubmission = {
  kondisi: string;
  dataPewaris: unknown;
  ahliWaris: unknown;
  anakMeninggal?: unknown;
  tambahanKeterangan?: string | null;
  nomorSurat?: string | null;
};

const parseJsonField = <T>(value: unknown, fallback: T): T => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (value == null) return fallback;
  return value as T;
};

export function buildSuratPernyataanFormValues(
  submission: RawSubmission,
): FormValues {
  const dataPewaris = parseJsonField<Record<string, unknown>>(
    submission.dataPewaris,
    {},
  );
  const ahliWaris = parseJsonField<unknown[]>(submission.ahliWaris, []);
  const anakMeninggal = parseJsonField<unknown[] | undefined>(
    submission.anakMeninggal,
    undefined,
  );

  return {
    kondisi: submission.kondisi as FormValues["kondisi"],
    dataPewaris: dataPewaris as FormValues["dataPewaris"],
    ahliWaris: ahliWaris as FormValues["ahliWaris"],
    anakMeninggal: anakMeninggal as FormValues["anakMeninggal"],
    tambahanKeterangan: submission.tambahanKeterangan ?? "",
  };
}

export function getSuratPernyataanPdfFilename(submission: RawSubmission) {
  const pewaris = parseJsonField<Record<string, unknown>>(
    submission.dataPewaris,
    {},
  );
  const nama = String(pewaris.nama ?? "tanpa-nama");
  const nomorSurat = submission.nomorSurat || "surat";
  return `surat-pernyataan-${nomorSurat}-${nama}.pdf`;
}

export function isSuratPernyataanPdfDataValid(data: FormValues): boolean {
  if (!data?.dataPewaris) return false;
  if (!data.dataPewaris.nama) return false;
  if (!data.dataPewaris.tempatLahir) return false;
  if (!data.dataPewaris.tanggalLahir) return false;
  if (!data.dataPewaris.alamat) return false;
  if (data.kondisi !== "kondisi6" && (!data.ahliWaris || data.ahliWaris.length === 0)) {
    return false;
  }
  return true;
}
