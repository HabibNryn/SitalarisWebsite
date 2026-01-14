// app/components/surat-templates/SuratPernyataanKondisi1.tsx
"use client";

import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FormValues, DataKeluargaType } from "@/app/dashboard/SuratPernyataan/types";
import React from "react";

// Register font jika diperlukan (opsional)
// Font.register({
//   family: 'Helvetica',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/helvetica/v15/J7ajnpV-B1p7r2FFKeq6sE0.woff2', fontWeight: 'normal' },
//     { src: 'https://fonts.gstatic.com/s/helvetica/v15/J7ajnpV-B1p7r2FFKeq6sE0.woff2', fontWeight: 'bold' },
//   ],
// });

// Tipe yang tepat untuk fontWeight pada @react-pdf/renderer
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 30,
    borderBottom: "2 solid #000",
    paddingBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold" as FontWeight,
    marginBottom: 5,
    textDecoration: "underline" as const,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 3,
  },
  bodyText: {
    fontSize: 10,
    textAlign: "justify" as const,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold" as FontWeight,
  },
  underlineText: {
    textDecoration: "underline" as const,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: "row" as const,
    marginBottom: 4,
  },
  dataLabel: {
    width: 150,
    fontWeight: "bold" as FontWeight,
  },
  dataValue: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 60,
    marginBottom: 40,
  },
  signatureRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  signatureBox: {
    width: "30%",
    alignItems: "center" as const,
  },
  signatureLine: {
    width: "100%",
    borderBottom: "1 solid #000",
    marginTop: 60,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold" as FontWeight,
  },
  footer: {
    marginTop: 40,
    fontSize: 9,
    color: "#666",
    textAlign: "center" as const,
  },
  table: {
    width: "100%",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row" as const,
    borderBottom: "1 solid #ddd",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold" as FontWeight,
  },
  tableCell: {
    paddingHorizontal: 5,
    flex: 1,
  },
  numberCell: {
    width: 30,
    textAlign: "center" as const,
  },
  stampSection: {
    marginTop: 30,
    padding: 10,
    border: "1 solid #000",
    borderRadius: 5,
  },
});

interface SuratPernyataanKondisi1Props {
  data: FormValues;
}

// Helper untuk format tanggal dengan error handling
const formatDate = (dateString: string): string => {
  if (!dateString || typeof dateString !== "string") return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return dateString;
    }
    return format(date, "dd MMMM yyyy", { locale: id });
  } catch (error: unknown) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Helper untuk menemukan istri
const findIstri = (ahliWaris: DataKeluargaType[]): DataKeluargaType | undefined => {
  return ahliWaris.find(ahli => ahli.hubungan === "ISTRI");
};

// Helper untuk menemukan anak-anak
const findAnakAnak = (ahliWaris: DataKeluargaType[]): DataKeluargaType[] => {
  return ahliWaris.filter(ahli => ahli.hubungan === "ANAK");
};

// Komponen utama - HANYA default export
const SuratPernyataanKondisi1: React.FC<SuratPernyataanKondisi1Props> = ({ 
  data 
}) => {
  // Type guard inline
  const isValidFormData = (data: unknown): data is FormValues => {
    return (
      typeof data === "object" &&
      data !== null &&
      "dataPewaris" in data &&
      "ahliWaris" in data &&
      Array.isArray((data as FormValues).ahliWaris)
    );
  };

  // Validasi data
  if (!isValidFormData(data)) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error: Data tidak valid untuk membuat surat</Text>
        </Page>
      </Document>
    );
  }

  const { dataPewaris, ahliWaris } = data;
  
  // Format tanggal sekarang
  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });

  // Temukan istri dan anak-anak dengan type safety
  const istri = findIstri(ahliWaris);
  const anakAnak = findAnakAnak(ahliWaris);

  // Validasi data yang diperlukan
  if (!dataPewaris.nama || !dataPewaris.nomorAkteKematian) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error: Data pewaris tidak lengkap</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SURAT PERNYATAAN AHLI WARIS</Text>
        </View>

        {/* Isi Surat */}
        <View style={styles.section}>
          <Text style={styles.bodyText}>
            Kami yang bertandatangan di bawah ini para ahli waris dari Almarhum{" "}
            <Text style={styles.boldText}>{dataPewaris.nama}</Text>
          </Text>

          <Text style={styles.bodyText}>
            Dengan ini menyatakan dengan sesungguhnya dan sanggup diangkat
            sumpah, bahwa Almarhum <Text style={styles.boldText}>{dataPewaris.nama}</Text> Lahir di{" "}
            {dataPewaris.tempatLahir || "-"} tanggal{" "}
            {formatDate(dataPewaris.tanggalLahir)} bertempat tinggal
            terakhir di {dataPewaris.alamat || "-"}, telah meninggal dunia di{" "}
            {dataPewaris.tempatMeninggal || "-"} pada tanggal{" "}
            {formatDate(dataPewaris.tanggalMeninggal)} sesuai dengan Akte
            Kematian dari Dinas Dukcapil Provinsi DKI Jakarta Nomor{" "}
            {dataPewaris.nomorAkteKematian} tanggal{" "}
            {formatDate(dataPewaris.tanggalMeninggal)}.
          </Text>

          <Text style={styles.bodyText}>
            Semasa hidupnya Almarhum <Text style={styles.boldText}>{dataPewaris.nama}</Text> menikah hanya 1
            (satu) kali dengan <Text style={styles.boldText}>{istri?.nama || "-"}</Text> sesuai Surat Nikah Nomor [Nomor
            Surat Nikah] tanggal [Tanggal Nikah] dari KUA/Dukcapil [Instansi],
            dari perkawinannya dikaruniai {anakAnak.length} orang anak yang kini
            masih hidup, yaitu :
          </Text>
        </View>

        {/* Data Anak */}
        <View style={styles.section}>
          {anakAnak.map((anak, index) => (
            <View key={anak.nik || `anak-${index}`} style={styles.listItem}>
              <Text style={styles.boldText}>
                {index + 1}. Nama : {anak.nama || "-"} (Anak)
              </Text>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Tempat Tgl. Lahir</Text>
                <Text style={styles.dataValue}>
                  : {anak.tempatLahir || "-"}, {formatDate(anak.tanggalLahir)}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Pekerjaan</Text>
                <Text style={styles.dataValue}>: {anak.pekerjaan || "-"}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Agama</Text>
                <Text style={styles.dataValue}>: {anak.agama || "-"}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Alamat</Text>
                <Text style={styles.dataValue}>: {anak.alamat || "-"}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>No. KTP</Text>
                <Text style={styles.dataValue}>: {anak.nik || "-"}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Data Istri */}
        {istri && (
          <View style={styles.section}>
            <Text style={styles.bodyText}>
              Istri dari Almarhum yang masih hidup:
            </Text>
            <View style={styles.listItem}>
              <Text style={styles.boldText}>Nama : {istri.nama || "-"} (Istri)</Text>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Tempat Tgl. Lahir</Text>
                <Text style={styles.dataValue}>
                  : {istri.tempatLahir || "-"}, {formatDate(istri.tanggalLahir)}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Pekerjaan</Text>
                <Text style={styles.dataValue}>: {istri.pekerjaan || "-"}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Agama</Text>
                <Text style={styles.dataValue}>: {istri.agama || "-"}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Alamat</Text>
                <Text style={styles.dataValue}>: {istri.alamat || "-"}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>No. KTP</Text>
                <Text style={styles.dataValue}>: {istri.nik || "-"}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Pernyataan penutup */}
        <View style={styles.section}>
          <Text style={styles.bodyText}>
            Demikian surat pernyataan ini kami buat dengan sebenar-benarnya dan
            dalam keadaan sehat jasmani dan rohani, serta tidak ada tekanan atau
            paksaan dari siapapun/pihak manapun untuk dipergunakan sebagaimana
            mestinya, dan apabila tidak benar atau dikemudian hari ada ahli
            waris lainnya selain dari kami dan mempunyai bukti-bukti yang
            dianggap sah secara hukum atau belum tercantum dalam surat
            pernyataan ini, maka kami selaku ahli waris yang menandatangani
            surat pernyataan ini, bertanggung jawab sepenuhnya sesuai hukum yang
            berlaku dengan tidak melibatkan aparat kelurahan dan kecamatan,
            surat pernyataan ahli waris ini batal secara otomatis.
          </Text>
        </View>

        {/* Tanda tangan */}
        <View style={styles.signatureSection}>
          <Text style={[styles.bodyText, { textAlign: "right" as const }]}>
            Jakarta, {currentDate}
          </Text>
          <Text style={[styles.bodyText, { marginTop: 20, marginBottom: 10 }]}>
            Kami para Ahli Waris
          </Text>

          {/* Tanda tangan istri */}
          {istri && (
            <View style={{ marginBottom: 30 }}>
              <Text>
                1. <Text style={styles.boldText}>{istri.nama || "-"}</Text> (Istri)
              </Text>
              <Text style={{ marginTop: 5 }}>Meterai 10.000</Text>
            </View>
          )}

          {/* Tanda tangan anak-anak */}
          {anakAnak.map((anak, index) => (
            <View key={anak.nik || `anak-${index}`} style={{ marginBottom: 20 }}>
              <Text>
                {istri ? index + 2 : index + 1}.{" "}
                <Text style={styles.boldText}>{anak.nama || "-"}</Text> (Anak)
              </Text>
            </View>
          ))}

          {/* Saksi-saksi */}
          <Text style={[styles.bodyText, { marginTop: 40, marginBottom: 10 }]}>
            Saksi-saksi:
          </Text>

          {/* Saksi 1 */}
          <View style={{ marginBottom: 20 }}>
            <Text>1. Nama : [Nama Saksi 1] (Hubungan)</Text>
            <Text> NIK : [NIK Saksi 1]</Text>
            <Text> Tempat/Tgl. Lahir : [Tempat], [Tanggal Lahir]</Text>
            <Text> Alamat : [Alamat Saksi 1]</Text>
            <Text> Pekerjaan : [Pekerjaan Saksi 1]</Text>
          </View>

          {/* Saksi 2 */}
          <View style={{ marginBottom: 30 }}>
            <Text>2. Nama : [Nama Saksi 2] (Hubungan)</Text>
            <Text> NIK : [NIK Saksi 2]</Text>
            <Text> Tempat/Tgl. Lahir : [Tempat], [Tanggal Lahir]</Text>
            <Text> Alamat : [Alamat Saksi 2]</Text>
            <Text> Pekerjaan : [Pekerjaan Saksi 2]</Text>
          </View>

          {/* Mengetahui */}
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={{ marginBottom: 5 }}>Mengetahui</Text>
              <Text>Ketua RW [Nomor RW]</Text>
              <Text>Kelurahan Grogol</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>[Nama Ketua RW]</Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={{ marginBottom: 5 }}>Mengetahui</Text>
              <Text>Ketua RT [Nomor RT]</Text>
              <Text>Kelurahan Grogol</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>[Nama Ketua RT]</Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={{ marginBottom: 5 }}>Mengetahui</Text>
              <Text>Lurah Kelurahan Grogol</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>Ady Saputro, S.IP., M.A</Text>
              <Text>NIP 199109092015071001</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Template Kondisi 1: Pewaris memiliki 1 istri dan semua anak masih hidup
          </Text>
          <Text>Dicetak pada: {currentDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

// HANYA default export, tidak ada named export
export default SuratPernyataanKondisi1;