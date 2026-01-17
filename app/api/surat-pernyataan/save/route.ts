// app/api/surat-pernyataan/save/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Simpan ke database di sini
    // Untuk sementara, kembalikan sukses
    return NextResponse.json({
      success: true,
      message: 'Data berhasil disimpan',
      timestamp: new Date().toISOString(),
      dataId: Date.now().toString() // ID sementara
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}