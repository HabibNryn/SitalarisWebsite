// app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/auth/auth-validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validasi input dengan Zod
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      // Ambil pesan error pertama (bisa juga kirim semua error)
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // 2. Data sudah lolos validasi
    const { name, email, password } = result.data;

    // 3. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan user ke database
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: hashedPassword,
        role: "user", // default
      },
    });

    // 6. Kembalikan response (tanpa password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { message: "Registrasi berhasil", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}