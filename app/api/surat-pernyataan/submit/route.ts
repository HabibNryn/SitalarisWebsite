// app/api/surat-pernyataan/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { randomUUID } from "crypto";

/* =========================
   ZOD SCHEMA
========================= */

const AhliWarisSchema = z.object({
  nama: z.string().min(1),
  hubungan: z.enum(["ISTRI", "ANAK", "SAUDARA", "CUCU"]),
  jenisKelamin: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
  masihHidup: z.boolean(),
  memilikiKeturunan: z.boolean().optional().default(false),
  namaAyah: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  agama: z.string().optional(),
  pekerjaan: z.string().optional(),
  kewarganegaraan: z.string().optional(),
  alamat: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  kecamatan: z.string().optional(),
  kelurahan: z.string().optional(),
  keterangan: z.string().optional(),
});

const DataPewarisSchema = z.object({
  nama: z.string().min(1),
  namaAyah: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().min(1),
  alamat: z.string().optional(),
  tempatMeninggal: z.string().optional(),
  tanggalMeninggal: z.string().min(1),
  rtPewaris: z.string().optional(),
  rwPewaris: z.string().optional(),
  nomorAkteKematian: z.string().optional(),
  tanggalAkteKematian: z.string().optional(),
  statusPernikahan: z
    .enum(["MENIKAH", "BELUM_MENIKAH", "CERAI_HIDUP", "CERAI_MATI"])
    .optional(),
  noSuratNikah: z.string().optional(),
  tanggalNikah: z.string().optional(),
  instansiNikah: z.string().optional(),
});

const FormSchema = z.object({
  kondisi: z.string().min(1),
  dataPewaris: DataPewarisSchema,
  ahliWaris: z.array(AhliWarisSchema).min(1),
  tambahanKeterangan: z.string().optional(),
});

/* =========================
   HELPERS
========================= */

const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

/* =========================
   POST HANDLER
========================= */

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json();
    const data = FormSchema.parse(rawBody);

    const tanggalLahir = parseDate(data.dataPewaris.tanggalLahir);
    const tanggalMeninggal = parseDate(data.dataPewaris.tanggalMeninggal);

    if (!tanggalLahir || !tanggalMeninggal) {
      return NextResponse.json(
        { error: "Format tanggal tidak valid" },
        { status: 400 }
      );
    }

    const nomorSurat = `SP-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${randomUUID().slice(0, 6).toUpperCase()}`;

    const jumlah = data.ahliWaris.reduce(
      (acc, item) => {
        if (item.hubungan === "ISTRI") acc.istri++;
        if (item.hubungan === "ANAK") acc.anak++;
        if (item.hubungan === "SAUDARA") acc.saudara++;
        if (item.hubungan === "CUCU") acc.cucu++;
        return acc;
      },
      { istri: 0, anak: 0, saudara: 0, cucu: 0 }
    );

    const surat = await prisma.$transaction(async (tx) => {
      const created = await tx.suratPernyataan.create({
        data: {
          nomorSurat,
          userId: session.user.id,
          kondisi: data.kondisi,

          namaPewaris: data.dataPewaris.nama,
          namaAyahPewaris: data.dataPewaris.namaAyah || "",
          tempatLahirPewaris: data.dataPewaris.tempatLahir || "",
          tanggalLahirPewaris: tanggalLahir,
          alamatPewaris: data.dataPewaris.alamat || "",

          tempatMeninggal: data.dataPewaris.tempatMeninggal || "",
          tanggalMeninggal,

          rtPewaris: data.dataPewaris.rtPewaris,
          rwPewaris: data.dataPewaris.rwPewaris,

          noAkteKematian: data.dataPewaris.nomorAkteKematian,
          tanggalAkteKematian: parseDate(
            data.dataPewaris.tanggalAkteKematian
          ),

          statusPernikahan:
            data.dataPewaris.statusPernikahan || "MENIKAH_1",
          noSuratNikah: data.dataPewaris.noSuratNikah,
          tanggalNikah: parseDate(data.dataPewaris.tanggalNikah),
          instansiNikah: data.dataPewaris.instansiNikah,

          // 🔑 INTI PERBAIKAN
          ahliWaris: data.ahliWaris,

          jumlahIstri: jumlah.istri,
          jumlahAnak: jumlah.anak,
          jumlahSaudara: jumlah.saudara,
          jumlahCucu: jumlah.cucu,

          status: "SUBMITTED",
          catatan: data.tambahanKeterangan || "",
        },
      });

      await tx.documentLog.create({
        data: {
          suratPernyataanId: created.id,
          userId: session.user.id,
          action: "CREATE",
          details: `Surat pernyataan dibuat (${nomorSurat})`,
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Surat pernyataan berhasil diajukan",
        data: surat,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
  // Zod validation error
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validasi gagal",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma unique constraint
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return NextResponse.json(
      { error: "Nomor surat sudah ada" },
      { status: 409 }
    );
  }

  // Error standar JavaScript
  if (error instanceof Error) {
    console.error("Submit error:", error.message);
    return NextResponse.json(
      {
        error: "Gagal menyimpan surat pernyataan",
        details: error.message,
      },
      { status: 500 }
    );
  }

  // Fallback aman (tidak pernah pakai any)
  console.error("Unknown error:", error);
  return NextResponse.json(
    { error: "Terjadi kesalahan tidak terduga" },
    { status: 500 }
  );
}
}