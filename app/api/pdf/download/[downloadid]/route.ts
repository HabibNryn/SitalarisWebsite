import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'storage/pdf', params.id);

  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${params.id}"`
    }
  });
}
