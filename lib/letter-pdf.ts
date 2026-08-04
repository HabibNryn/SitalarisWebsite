// lib/letter-pdf.ts
// Helper untuk membaca buffer PDF surat yang tersimpan di server.
// Mendukung storage lokal (public/uploads/pdfs) dan path dari field pdfUrl/pdfFileName.

import fs from "fs/promises";
import path from "path";

export interface ResolvedPdf {
  buffer: Buffer;
  filename: string;
}

/**
 * Ekstrak nama file dari pdfUrl / pdfFileName.
 * Menangani berbagai format: "/uploads/pdfs/abc.pdf", "uploads/abc.pdf",
 * "public/uploads/abc.pdf", atau nama file polos "abc.pdf".
 */
export function extractPdfFilename(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const normalized = value.replace(/\\/g, "/").trim();
  const basename = normalized.split("/").pop();
  return basename && basename.length > 0 ? basename : null;
}

/**
 * Coba membaca file PDF dari penyimpanan lokal.
 * Mengembalikan { buffer, filename } jika ditemukan, null jika tidak.
 */
export async function readPdfFromDisk(
  pdfUrl: string | null | undefined,
  pdfFileName: string | null | undefined,
): Promise<ResolvedPdf | null> {
  const filename =
    extractPdfFilename(pdfFileName) || extractPdfFilename(pdfUrl);

  if (!filename) return null;

  // Kandidat lokasi file
  const candidates = [
    path.join(process.cwd(), "public", "uploads", "pdfs", filename),
    path.join(process.cwd(), "public", "uploads", filename),
    path.join(process.cwd(), "storage", "pdf", filename),
  ];

  for (const candidate of candidates) {
    try {
      const buffer = await fs.readFile(candidate);
      return { buffer, filename };
    } catch {
      // file tidak ditemukan di lokasi ini, coba lokasi berikutnya
    }
  }

  return null;
}
