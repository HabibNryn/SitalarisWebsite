// app/api/surat-pernyataan/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

/* =========================
   ZOD SCHEMA
========================= */

const JenisKelaminSchema = z.enum(["LAKI-LAKI", "PEREMPUAN"]);
const StatusPernikahanSchema = z.enum([
  "MENIKAH",
  "BELUM_MENIKAH",
  "CERAI_HIDUP",
  "CERAI_MATI",
]);
const HubunganSchema = z.enum([
  "ISTRI",
  "SUAMI",
  "ANAK",
  "CUCU",
  "SAUDARA",
  "ORANG_TUA",
  "LAINNYA",
]);
const KondisiSchema = z.enum([
  "kondisi1",
  "kondisi2",
  "kondisi3",
  "kondisi4",
  "kondisi5",
  "kondisi6",
  "kondisi7",
]);
const StatusHidupSchema = z.enum(["HIDUP", "MENINGGAL"]);

const AhliWarisSchema = z.object({
  id: z.string().optional(),
  nama: z.string().min(1),
  hubungan: HubunganSchema,
  jenisKelamin: JenisKelaminSchema,
  namaAyah: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  pekerjaan: z.string().optional(),
  agama: z.string().optional(),
  alamat: z.string().optional(),
  nik: z.string().optional(),
  statusHidup: StatusHidupSchema.optional(),
  statusPernikahan: StatusPernikahanSchema.optional(),
  memilikiKeturunan: z.boolean().optional().default(false),
  urutan: z.number().optional(),
  asalIstri: z.enum(["PERTAMA", "KEDUA"]).optional(),
  nomorSuratNikah: z.string().optional(),
  keterangan: z.string().optional(),
  status: z.boolean().optional(),
});

const DataPewarisSchema = z.object({
  nama: z.string().min(1),
  namaAyah: z.string().min(1),
  tempatLahir: z.string().min(1),
  tanggalLahir: z.string().min(1),
  jenisKelamin: JenisKelaminSchema,
  tempatMeninggal: z.string().min(1),
  tanggalMeninggal: z.string().min(1),
  nomorAkteKematian: z.string().min(1),
  tanggalAkteKematian: z.string().min(1),
  alamat: z.string().min(1),
  rt: z.string().min(1),
  rw: z.string().min(1),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  statusPernikahan: StatusPernikahanSchema,
  noSuratNikah: z.string().optional(),
  tanggalNikah: z.string().optional(),
  instansiNikah: z.string().optional(),
  noSuratNikahKedua: z.string().optional(),
  tanggalNikahKedua: z.string().optional(),
  instansiNikahKedua: z.string().optional(),
  pekerjaan: z.string().optional(),
  agama: z.string().min(1),
  nik: z.string().optional(),
  jumlahAnak: z.number().optional(),
  jumlahCucu: z.number().optional(),
  jumlahSaudara: z.number().optional(),
  jumlahIstri: z.number().optional(),
});

const AnakMeninggalSchema = z.object({
  id: z.string().optional(),
  nama: z.string().min(1),
  tanggalLahir: z.string().min(1),
  tanggalMeninggal: z.string().min(1),
  nomorAkteKematian: z.string().min(1),
  tanggalAkteKematian: z.string().min(1),
  memilikiKeturunan: z.boolean().optional().default(false),
  sudahMenikah: z.boolean().optional().default(false),
  namaPasangan: z.string().optional(),
  nomorSuratNikah: z.string().optional(),
  tanggalNikah: z.string().optional(),
  instansiNikah: z.string().optional(),
});

const FormSchema = z.object({
  kondisi: KondisiSchema,
  dataPewaris: DataPewarisSchema,
  ahliWaris: z
    .array(AhliWarisSchema)
    .default([])
    .transform((items) =>
      items.map((item) => ({
        ...item,
        status:
          typeof item.status === "boolean"
            ? item.status
            : item.statusHidup === "HIDUP",
      }))
    ),
  anakMeninggal: z.array(AnakMeninggalSchema).optional(),
  tambahanKeterangan: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.kondisi !== "kondisi6" && data.ahliWaris.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ahliWaris"],
      message: "Minimal 1 ahli waris diperlukan",
    });
  }
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

    // Parse tanggal
    const tanggalLahir = parseDate(data.dataPewaris.tanggalLahir);
    const tanggalMeninggal = parseDate(data.dataPewaris.tanggalMeninggal);

    if (!tanggalLahir || !tanggalMeninggal) {
      return NextResponse.json(
        { error: "Format tanggal tidak valid" },
        { status: 400 }
      );
    }

    // Generate nomor surat
    const nomorSurat = `SP-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${randomUUID().slice(0, 6).toUpperCase()}`;

    // Hitung jumlah ahli waris
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

    const dataPewarisWithCounts = {
      ...data.dataPewaris,
      jumlahAnak: data.dataPewaris.jumlahAnak ?? jumlah.anak,
      jumlahCucu: data.dataPewaris.jumlahCucu ?? jumlah.cucu,
      jumlahSaudara: data.dataPewaris.jumlahSaudara ?? jumlah.saudara,
      jumlahIstri: data.dataPewaris.jumlahIstri ?? jumlah.istri,
    };

    // Simpan ke database
    const surat = await prisma.$transaction(async (tx) => {
      const created = await tx.suratPernyataan.create({
        data: {
          nomorSurat,
          userId: session.user.id,
          kondisi: data.kondisi,

          // JSON fields
          dataPewaris: dataPewarisWithCounts as Prisma.InputJsonValue,
          ahliWaris: data.ahliWaris as Prisma.InputJsonValue,
          anakMeninggal: data.anakMeninggal
            ? (data.anakMeninggal as Prisma.InputJsonValue)
            : undefined,

          // Informasi tambahan
          tambahanKeterangan: data.tambahanKeterangan || "",
          noSuratNikahKedua: data.dataPewaris.noSuratNikahKedua || null,
          tanggalNikahKedua: parseDate(data.dataPewaris.tanggalNikahKedua) || null,
          instansiNikahKedua: data.dataPewaris.instansiNikahKedua || null,

          status: "SUBMITTED",
          submittedAt: new Date(),
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
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Nomor surat sudah ada" },
        { status: 409 }
      );
    }

    // Generic error
    if (error instanceof Error) {
      console.error("Submit error:", error.message);
      return NextResponse.json(
        { error: "Gagal menyimpan surat pernyataan", details: error.message },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan tidak terduga" },
      { status: 500 }
    );
  }
}
