// app/components/surat-templates/SuratPernyataanKondisi1.tsx
"use client";

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FormValues, DataKeluargaType } from "@/app/dashboard/SuratPernyataan/types";
import React from "react";

// Tipe untuk fontWeight
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;

const styles = StyleSheet.create({
  page: {
    padding: 60,
    paddingTop: 50,
    fontSize: 11,
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 14,
    fontWeight: "bold" as FontWeight,
    textDecoration: "underline" as const,
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 11,
    textAlign: "justify" as const,
    marginBottom: 12,
    lineHeight: 1.6,
  },
  boldText: {
    fontWeight: "bold" as FontWeight,
  },
  underlineText: {
    textDecoration: "underline" as const,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: "row" as const,
    marginBottom: 4,
  },
  dataLabel: {
    width: 140,
  },
  dataValue: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 50,
    marginBottom: 30,
  },
  signatureRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: {
    width: "30%",
    alignItems: "center" as const,
  },
  signatureLine: {
    width: "100%",
    borderBottom: "1 solid #000",
    marginTop: 50,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold" as FontWeight,
  },
  tableContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minHeight: 24,
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: "bold" as FontWeight,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  indent: {
    marginLeft: 40,
  },
  // Untuk format seperti di Word dengan spasi khusus
  numberedList: {
    marginLeft: 10,
    marginBottom: 8,
  },
  numberedItem: {
    flexDirection: "row" as const,
    marginBottom: 6,
  },
  number: {
    width: 20,
    fontWeight: "bold" as FontWeight,
  },
  // Untuk bagian "Mengetahui" dengan tabel
  mengetahuiSection: {
    marginTop: 40,
  },
  mengetahuiTable: {
    width: "100%",
    marginTop: 10,
  },
  mengetahuiRow: {
    flexDirection: "row" as const,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    borderBottomWidth: 0,
  },
  mengetahuiCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    flex: 1,
    fontSize: 10,
  },
  mengetahuiHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: "bold" as FontWeight,
    textAlign: "center" as const,
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

// Helper untuk format tanggal pendek (DD-MM-YYYY)
const formatDateShort = (dateString: string): string => {
  if (!dateString || typeof dateString !== "string") return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch {
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

// Helper untuk mendapatkan tahun sekarang
const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

// Helper untuk memisahkan nama dan bin/binti
const parseNama = (nama: string): { nama: string; binBinti?: string } => {
  if (!nama) return { nama: "-" };
  
  const parts = nama.split(' ');
  if (parts.length > 1) {
    // Ambil kata terakhir sebagai bin/binti
    const binBinti = parts[parts.length - 1];
    const namaTanpaBin = parts.slice(0, -1).join(' ');
    return { nama: namaTanpaBin, binBinti };
  }
  
  return { nama };
};

// Helper untuk mengurai alamat menjadi RT/RW
const parseAlamat = (alamat: string): { jalan: string; rt?: string; rw?: string } => {
  if (!alamat) return { jalan: "-" };
  
  const rtMatch = alamat.match(/RT\.?\s*(\d+)/i);
  const rwMatch = alamat.match(/RW\.?\s*(\d+)/i);
  
  const rt = rtMatch ? rtMatch[1] : undefined;
  const rw = rwMatch ? rwMatch[1] : undefined;
  
  // Hapus RT/RW dari alamat untuk mendapatkan jalan saja
  let jalan = alamat;
  if (rtMatch) jalan = jalan.replace(rtMatch[0], '').trim();
  if (rwMatch) jalan = jalan.replace(rwMatch[0], '').trim();
  
  // Bersihkan koma atau titik ganda
  jalan = jalan.replace(/[.,]\s*$/g, '').trim();
  
  return { jalan, rt, rw };
};

const SuratPernyataanKondisi1: React.FC<SuratPernyataanKondisi1Props> = ({ data }) => {
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
  
  // Format tanggal
  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });
  const currentYear = getCurrentYear();
  
  // Parse data pewaris
  const pewarisNama = parseNama(dataPewaris.nama || "-");
  const alamatPewaris = parseAlamat(dataPewaris.alamat || "-");
  
  // Temukan istri dan anak-anak
  const istri = findIstri(ahliWaris);
  const anakAnak = findAnakAnak(ahliWaris);
  
  // Parse nama istri jika ada
  const istriNama = istri ? parseNama(istri.nama || "-") : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header dengan underline */}
        <View style={styles.header}>
          <Text style={styles.title}>SURAT PERNYATAAN AHLI WARIS</Text>
        </View>

        {/* Paragraf 1 */}
        <View style={[styles.bodyText, { marginBottom: 15 }]}>
          <Text>
            Kami yang bertandatangan di bawah ini para ahli waris dari Almarhum{" "}
            <Text style={styles.boldText}>{pewarisNama.nama}</Text> BIN{" "}
            <Text style={styles.boldText}>{pewarisNama.binBinti || "..................."}</Text>
          </Text>
        </View>

        {/* Paragraf 2 */}
        <View style={[styles.bodyText, { marginBottom: 15 }]}>
          <Text>
            Dengan ini menyatakan dengan sesungguhnya dan sanggup diangkat sumpah, bahwa Almarhum{" "}
            <Text style={styles.boldText}>{pewarisNama.nama}</Text> BIN{" "}
            <Text style={styles.boldText}>{pewarisNama.binBinti || "..................."}</Text> Lahir di{" "}
            {dataPewaris.tempatLahir || "................"} tanggal{" "}
            {formatDateShort(dataPewaris.tanggalLahir || "")} Bulan{" "}
            {dataPewaris.tanggalLahir ? format(new Date(dataPewaris.tanggalLahir), "MMMM", { locale: id }) : ".............."} Tahun{" "}
            {dataPewaris.tanggalLahir ? format(new Date(dataPewaris.tanggalLahir), "yyyy", { locale: id }) : "............"} bertempat tinggal terakhir di{" "}
            {alamatPewaris.jalan || "Jl. ...................."} RT {alamatPewaris.rt || "......"} RW {alamatPewaris.rw || "......"} Kelurahan Grogol, Kecamatan Grogol Petamburan Kota Administrasi Jakarta Barat, telah meninggal dunia di{" "}
            {dataPewaris.tempatMeninggal || "..........."} pada tanggal{" "}
            {formatDateShort(dataPewaris.tanggalMeninggal || "")} bulan{" "}
            {dataPewaris.tanggalMeninggal ? format(new Date(dataPewaris.tanggalMeninggal), "MMMM", { locale: id }) : "................."} Tahun{" "}
            {dataPewaris.tanggalMeninggal ? format(new Date(dataPewaris.tanggalMeninggal), "yyyy", { locale: id }) : "..........."} sesuai dengan Akte Kematian dari Dinas Dukcapil Provinsi DKI Jakarta Nomor{" "}
            <Text style={styles.boldText}>{dataPewaris.nomorAkteKematian || "3173-KM-................."}</Text> tanggal{" "}
            {formatDateShort(dataPewaris.tanggalMeninggal || "..........")} bulan{" "}
            {dataPewaris.tanggalMeninggal ? format(new Date(dataPewaris.tanggalMeninggal), "MMMM", { locale: id }) : "............"} Tahun{" "}
            {dataPewaris.tanggalMeninggal ? format(new Date(dataPewaris.tanggalMeninggal), "yyyy", { locale: id }) : "..........."}.
          </Text>
        </View>

        {/* Paragraf 3 */}
        <View style={[styles.bodyText, { marginBottom: 15 }]}>
          <Text>
            Semasa hidupnya Almarhum <Text style={styles.boldText}>{pewarisNama.nama}</Text> BIN{" "}
            <Text style={styles.boldText}>{pewarisNama.binBinti || "..................."}</Text> menikah hanya 1 (satu) kali dengan{" "}
            {istriNama ? (
              <>
                <Text style={styles.boldText}>{istriNama.nama}</Text> BINTI{" "}
                <Text style={styles.boldText}>{istriNama.binBinti || "...................."}</Text>
              </>
            ) : (
              "........................ BINTI ...................."
            )}{" "}
            Sesuai Surat Nikah Nomor ...................... tanggal ..... Bulan ............... Tahun ............ dari KUA/Dukcapil ..................., dari perkawinannya dikaruniai {anakAnak.length} ({"("}{anakAnak.length}{")"}) orang anak yang kini masih hidup, yaitu :
          </Text>
        </View>

        {/* Daftar Anak */}
        <View style={styles.tableContainer}>
          {anakAnak.map((anak, index) => {
            const anakNama = parseNama(anak.nama || "-");
            return (
              <View key={anak.nik || `anak-${index}`} style={styles.numberedItem}>
                <Text style={styles.number}>{index + 1}.</Text>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Text style={styles.boldText}>
                    Nama : {anakNama.nama} (Anak)
                  </Text>
                  <View style={styles.dataRow}>
                    <Text>Tempat Tgl. Lahir : {anak.tempatLahir || "..........................."}, {formatDateShort(anak.tanggalLahir || "")}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Text>Pekerjaan : {anak.pekerjaan || "..........................."}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Text>Agama : {anak.agama || "..........................."}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Text>Alamat : {anak.alamat || "..........................."}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Text style={{ marginLeft: 20 }}>{anak.alamat ? "" : "..........................."}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Text>No. KTP : {anak.nik || "..........................."}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Paragraf penutup */}
        <View style={[styles.bodyText, { marginTop: 20 }]}>
          <Text>
            Demikian surat pernyataan ini kami buat dengan sebenar-benarnya dan dalam keadaan sehat jasmani dan rohani, serta tidak ada tekanan atau paksaan dari siapapun/pihak manapun untuk dipergunakan sebagaimana mestinya, dan apabila tidak benar atau dikemudian hari ada ahli waris lainnya selain dari kami dan mempunyai bukti-bukti yang dianggap sah secara hukum atau belum tercantum dalam surat pernyataan ini, maka kami selaku ahli waris yang menandatangani surat pernyataan ini, bertanggung jawab sepenuhnya sesuai hukum yang berlaku dengan tidak melibatkan aparat kelurahan dan kecamatan, surat pernyataan ahli waris ini batal secara otomatis.
          </Text>
        </View>

        {/* Tanda Tangan */}
        <View style={styles.signatureSection}>
          <Text style={[styles.bodyText, { textAlign: "right" as const }]}>
            Jakarta, {currentYear}
          </Text>
          
          <Text style={[styles.bodyText, { marginTop: 25, marginBottom: 15 }]}>
            Kami para Ahli Waris
          </Text>

          {/* Daftar penandatangan */}
          {istri && (
            <View style={{ marginBottom: 20 }}>
              <Text>
                1. <Text style={styles.boldText}>{istri.nama || "..............................."}</Text> (Istri)
              </Text>
              <Text style={{ marginTop: 5 }}>Meterai 10.000</Text>
            </View>
          )}

          {anakAnak.map((anak, index) => (
            <View key={`tanda-${index}`} style={{ marginBottom: 15 }}>
              <Text>
                {istri ? index + 2 : index + 1}.{" "}
                <Text style={styles.boldText}>{anak.nama || "..............................."}</Text> (Anak)
              </Text>
            </View>
          ))}

          {/* Saksi-saksi */}
          <Text style={[styles.bodyText, { marginTop: 30, marginBottom: 10 }]}>
            Saksi-saksi:
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text>1. Nama : ............................ ( ................ )</Text>
            <Text>   NIK : ............................</Text>
            <Text>   Tempat/Tgl. Lahir : ............................</Text>
            <Text>   Alamat : ............................</Text>
            <Text>   Pekerjaan : ............................</Text>
          </View>

          <View style={{ marginBottom: 30 }}>
            <Text>2. Nama : ............................ ( ................ )</Text>
            <Text>   NIK : ............................</Text>
            <Text>   Tempat/Tgl. Lahir : ............................</Text>
            <Text>   Alamat : ............................</Text>
            <Text>   Pekerjaan : ............................</Text>
          </View>

          {/* Bagian Mengetahui */}
          <View style={styles.mengetahuiSection}>
            <Text style={[styles.boldText, { textAlign: "center" as const, marginBottom: 10 }]}>
              Mengetahui
            </Text>
            
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={{ marginBottom: 5 }}>Ketua RW ......</Text>
                <Text>Kelurahan Grogol</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>.................................</Text>
              </View>

              <View style={styles.signatureBox}>
                <Text style={{ marginBottom: 5 }}>Ketua RT .......</Text>
                <Text>Kelurahan Grogol</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>.................................</Text>
              </View>

              <View style={styles.signatureBox}>
                <Text style={{ marginBottom: 5 }}>Lurah Kelurahan Grogol</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Ady Saputro, S.IP., M.A</Text>
                <Text style={{ fontSize: 9 }}>NIP 199109092015071001</Text>
              </View>
            </View>
          </View>

          {/* Tabel catatan */}
          <View style={[styles.mengetahuiSection, { marginTop: 40 }]}>
            <View style={styles.mengetahuiTable}>
              <View style={styles.mengetahuiRow}>
                <View style={[styles.mengetahuiCell, { flex: 2 }]}>
                  <Text>Berdasarkan data/dokumen yang Disampaikan dan atas permintaan yang bersangkutan dicatatkan dalam register Kelurahan Grogol</Text>
                </View>
                <View style={[styles.mengetahuiCell, { flex: 1 }]}>
                  <Text>Nomor :</Text>
                  <Text>Tanggal :</Text>
                </View>
              </View>
              <View style={[styles.mengetahuiRow, { borderBottomWidth: 1 }]}>
                <View style={[styles.mengetahuiCell, { flex: 2 }]}>
                  <Text>dicatatkan dalam register Kecamatan Grogol Petamburan</Text>
                  <Text>Nomor :</Text>
                  <Text>Tanggal :</Text>
                </View>
                <View style={[styles.mengetahuiCell, { flex: 1 }]}>
                  <Text>Lurah Kelurahan Grogol</Text>
                  <Text>Ady Saputro, S.IP., M.A</Text>
                  <Text>NIP 199109092015071001</Text>
                </View>
              </View>
              <View style={[styles.mengetahuiRow, { borderBottomWidth: 1 }]}>
                <View style={[styles.mengetahuiCell, { flex: 2 }]}>
                  <Text>Camat Grogol Petamburan</Text>
                </View>
                <View style={[styles.mengetahuiCell, { flex: 1 }]}>
                  <Text> </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SuratPernyataanKondisi1;