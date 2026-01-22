// lib/pdf-generator.ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FormValues } from "@/app/dashboard/user/SuratPernyataan/types";

export async function generateSuratPernyataanPDF(
  data: FormValues,
  nomorSurat: string,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Register fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add page
  let page = pdfDoc.addPage([595, 842]); // A4 in points

  let { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  // Helper function to add text with newline
  const addText = (
    text: string,
    size: number = 12,
    bold: boolean = false,
    x: number = margin,
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
    y -= size + 4;
  };

  // Add new page if needed
  const checkNewPage = () => {
    if (y < 100) {
      page = pdfDoc.addPage([595, 842]); // ✅ aman
      const size = page.getSize();
      width = size.width;
      height = size.height;
      y = height - margin;
      return true;
    }
    return false;
  };

  // Header
  addText("SURAT PERNYATAAN AHLI WARIS", 16, true, width / 2 - 100);
  y -= 20;

  // Nomor Surat
  addText(`Nomor: ${nomorSurat}`, 12, false, width / 2 - 40);
  y -= 20;

  // Pembukaan
  addText("Kami yang bertandatangan di bawah ini para ahli waris dari:", 12);
  addText(
    `Almarhum ${data.dataPewaris.nama} BIN ${data.dataPewaris.namaAyah || "__________"}`,
    12,
    true,
  );
  y -= 10;

  addText(
    "Dengan ini menyatakan dengan sesungguhnya dan sanggup diangkat sumpah, bahwa:",
    12,
  );
  y -= 10;

  // Data Pewaris
  const tempatTglLahir = `${data.dataPewaris.tempatLahir}, ${formatDate(data.dataPewaris.tanggalLahir)}`;
  const tempatTglMeninggal = `${data.dataPewaris.tempatMeninggal}, ${formatDate(data.dataPewaris.tanggalMeninggal)}`;

  addText(
    `1. Almarhum ${data.dataPewaris.nama} BIN ${data.dataPewaris.namaAyah || "__________"}`,
    12,
  );
  addText(`   Lahir di ${tempatTglLahir}`, 12);
  addText(`   Bertempat tinggal terakhir di ${data.dataPewaris.alamat}`, 12);
  addText(`   Telah meninggal dunia di ${tempatTglMeninggal}`, 12);
  addText(
    `   Sesuai Akta Kematian No: ${data.dataPewaris.nomorAkteKematian || "__________"}`,
    12,
  );
  y -= 10;

  // Data Pernikahan
  const ahliWaris = data.ahliWaris || [];
  const istriList = ahliWaris.filter((item) => item.hubungan === "ISTRI");
  const suamiList = ahliWaris.filter((item) => item.hubungan === "SUAMI");

  addText("2. Semasa hidupnya:", 12);
  if (istriList.length > 0) {
    istriList.forEach((istri, index) => {
      addText(
        `   Menikah dengan ${istri.nama} BINTI ${istri.namaAyah || "__________"}`,
        12,
      );
    });
  } else if (suamiList.length > 0) {
    suamiList.forEach((suami, index) => {
      addText(
        `   Menikah dengan ${suami.nama} BIN ${suami.namaAyah || "__________"}`,
        12,
      );
    });
  }
  y -= 10;

  // Data Anak
  const anakList = ahliWaris.filter((item) => item.hubungan === "ANAK");
  if (anakList.length > 0) {
    addText(
      "3. Dari perkawinan tersebut dikaruniai anak yang masih hidup:",
      12,
    );
    anakList.forEach((anak, index) => {
      checkNewPage();
      addText(`   ${index + 1}. ${anak.nama}`, 12);
      addText(
        `      Tempat/Tgl Lahir: ${anak.tempatLahir}, ${formatDate(anak.tanggalLahir)}`,
        12,
      );
      addText(`      Pekerjaan: ${anak.pekerjaan || "__________"}`, 12);
      addText(`      Agama: ${anak.agama || "__________"}`, 12);
      addText(`      Alamat: ${anak.alamat || "__________"}`, 12);
      addText(`      No. KTP: ${anak.nik || "__________"}`, 12);
      y -= 5;
    });
  }
  y -= 20;

  // Penutup
  addText(
    "Demikian surat pernyataan ini kami buat dengan sebenar-benarnya dan dalam",
    12,
  );
  addText(
    "keadaan sehat jasmani dan rohani, serta tidak ada tekanan atau paksaan",
    12,
  );
  addText(
    "dari siapapun/pihak manapun untuk dipergunakan sebagaimana mestinya.",
    12,
  );
  y -= 10;

  addText(
    "Apabila tidak benar atau dikemudian hari ada ahli waris lainnya selain",
    12,
  );
  addText(
    "dari kami dan mempunyai bukti-bukti yang dianggap sah secara hukum atau",
    12,
  );
  addText(
    "belum tercantum dalam surat pernyataan ini, maka kami selaku ahli waris",
    12,
  );
  addText(
    "yang menandatangani surat pernyataan ini, bertanggung jawab sepenuhnya",
    12,
  );
  addText("sesuai hukum yang berlaku.", 12);
  y -= 20;

  // Tanda Tangan
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate.toISOString());
  addText(`Jakarta, ${formattedDate}`, 12, false, width - 150);
  y -= 20;

  addText("Kami para Ahli Waris,", 12);
  y -= 20;

  // Tanda tangan ahli waris
  const signatories = ahliWaris.filter((item) =>
    ["ISTRI", "SUAMI", "ANAK", "SAUDARA"].includes(item.hubungan),
  );

  signatories.forEach((ahli, index) => {
    checkNewPage();
    addText(`${index + 1}. ${ahli.nama}`, 12);
    addText(`   (${getHubunganLabel(ahli.hubungan)})`, 12);
    y -= 15;
  });

  // Save PDF
  return await pdfDoc.save();
}

// Helper functions
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "__________";
  }
}

function getHubunganLabel(hubungan: string): string {
  const labels: Record<string, string> = {
    ISTRI: "Istri",
    SUAMI: "Suami",
    ANAK: "Anak",
    SAUDARA: "Saudara Kandung",
    CUCU: "Cucu",
  };
  return labels[hubungan] || hubungan;
}
