import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth-options";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    const file = body.file as File | Blob | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Invalid file payload" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Pakai nama asli tapi bisa rawan bentrok. Tambahkan suffix aman.
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext);
    const uniqueName = `${base}-${Date.now()}${ext}`;

    const filePath = path.resolve(UPLOAD_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);

    // filePath yang disimpan -> hanya path relative untuk dipakai di admin (url)
    const relativePath = `/uploads/${uniqueName}`;

    const created = await prisma.uploadFile.create({
      data: {
        filename: uniqueName,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
        filePath: relativePath,
        uploadedBy: userId,
        userId,
        metadata: {
          originalName: file.name,
        },
      },
      select: {
        id: true,
        filename: true,
        fileType: true,
        filePath: true,
        fileSize: true,
      },
    });

    return NextResponse.json({
      success: true,
      uploadFile: created,
      url: created.filePath,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[uploadFile/route]", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
};
