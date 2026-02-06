import { renderToBuffer } from "@react-pdf/renderer";
import SuratPernyataanPDF from "@/app/dashboard/user/SuratPernyataan/components/SuratPernyataanPDF";
import { FormValues } from "@/app/dashboard/user/SuratPernyataan/types";

export async function renderSuratPernyataanPdfBuffer(
  data: FormValues,
  kondisiId?: string,
): Promise<Buffer> {
  // Single source of truth for PDF rendering in server context.
  const document = (
    <SuratPernyataanPDF data={data} kondisiId={kondisiId ?? data.kondisi} />
  );

  return renderToBuffer(document);
}
