// app/api/admin/submissions/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const preview = request.nextUrl.searchParams.get('preview');
    
    if (preview === 'true') {
      // Redirect ke endpoint preview
      return NextResponse.redirect(
        new URL(`/api/admin/submissions/${id}/pdf/preview`, request.url)
      );
    }
    
    // Default ke download
    return NextResponse.redirect(
      new URL(`/api/admin/submissions/${id}/pdf/download`, request.url)
    );
    
  } catch (error) {
    console.error("PDF route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
