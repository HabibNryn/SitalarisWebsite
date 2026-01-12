import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FormValues } from "@/app/dashboard/SuratPernyataan/types";

// Styles untuk PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1pt solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    width: "60%",
    fontSize: 10,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#000",
    flex: 1,
  },
});

interface SuratPernyataanPDFProps {
  data: FormValues;
}

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Helper untuk format jenis kelamin
const formatJenisKelamin = (value: string) => {
  return value === "LAKI-LAKI" ? "Laki-laki" : "Perempuan";
};

// Helper untuk format status pernikahan
const formatStatusPernikahan = (value: string) => {
  const statusMap: Record<string, string> = {
    MENIKAH: "Menikah",
    BELUM_MENIKAH: "Belum Menikah",
    CERAI_HIDUP: "Cerai Hidup",
    CERAI_MATI: "Cerai Mati",
  };
  return statusMap[value] || value;
};

// Helper untuk format hubungan
const formatHubungan = (value: string) => {
  const hubunganMap: Record<string, string> = {
    SUAMI: "Suami",
    ISTRI: "Istri",
    ANAK: "Anak",
    CUCU: "Cucu",
    SAUDARA: "Saudara Kandung",
    ORANG_TUA: "Orang Tua",
  };
  return hubunganMap[value] || value;
};

// Komponen PDF yang sederhana tanpa dependency router
export default function SuratPernyataanPDF({ data }: SuratPernyataanPDFProps) {
  const { kondisi, dataPewaris, ahliWaris, tambahanKeterangan } = data;

  // Dapatkan kondisi label
  const kondisiLabel = getKondisiLabel(kondisi);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SURAT PERNYATAAN AHLI WARIS</Text>
          <Text style={styles.subtitle}>
            Berdasarkan Surat Keterangan Kematian No: {dataPewaris.nomorAkteKematian || "-"}
          </Text>
        </View>

        {/* Informasi Kondisi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kondisi Ahli Waris</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Kondisi:</Text>
            <Text style={styles.value}>{kondisiLabel}</Text>
          </View>
        </View>

        {/* Data Pewaris */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Pewaris</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Lengkap:</Text>
            <Text style={styles.value}>{dataPewaris.nama || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tempat/Tanggal Lahir:</Text>
            <Text style={styles.value}>
              {dataPewaris.tempatLahir || "-"}, {formatDate(dataPewaris.tanggalLahir)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tempat/Tanggal Meninggal:</Text>
            <Text style={styles.value}>
              {dataPewaris.tempatMeninggal || "-"}, {formatDate(dataPewaris.tanggalMeninggal)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alamat:</Text>
            <Text style={styles.value}>{dataPewaris.alamat || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jenis Kelamin:</Text>
            <Text style={styles.value}>{formatJenisKelamin(dataPewaris.jenisKelamin)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status Pernikahan:</Text>
            <Text style={styles.value}>{formatStatusPernikahan(dataPewaris.statusPernikahan)}</Text>
          </View>
        </View>

        {/* Data Ahli Waris */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Data Ahli Waris ({ahliWaris.length} orang)
          </Text>
          
          {ahliWaris.length > 0 ? (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>No</Text>
                <Text style={styles.tableCell}>Nama</Text>
                <Text style={styles.tableCell}>Hubungan</Text>
                <Text style={styles.tableCell}>NIK</Text>
                <Text style={styles.tableCell}>TTL</Text>
                <Text style={styles.tableCell}>Alamat</Text>
              </View>
              
              {/* Table Rows */}
              {ahliWaris.map((ahli, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                  <Text style={styles.tableCell}>{ahli.nama || "-"}</Text>
                  <Text style={styles.tableCell}>{formatHubungan(ahli.hubungan)}</Text>
                  <Text style={styles.tableCell}>{ahli.nik || "-"}</Text>
                  <Text style={styles.tableCell}>
                    {ahli.tempatLahir || "-"}, {formatDate(ahli.tanggalLahir)}
                  </Text>
                  <Text style={styles.tableCell}>{ahli.alamat || "-"}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text>Tidak ada ahli waris</Text>
          )}
        </View>

        {/* Pengelompokan berdasarkan Istri (khusus kondisi 4) */}
        {kondisi === "kondisi4" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pengelompokan Ahli Waris</Text>
            {/* Logika pengelompokan untuk kondisi 4 */}
            {renderPengelompokanIstri(data)}
          </View>
        )}

        {/* Keterangan Tambahan */}
        {tambahanKeterangan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keterangan Tambahan</Text>
            <Text style={{ fontSize: 10 }}>{tambahanKeterangan}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={{ marginTop: 50 }}>
          <Text style={{ fontSize: 10, textAlign: "center", marginTop: 30 }}>
            Dibuat otomatis melalui Sistem Administrasi Lurah (SITALARIS)
          </Text>
          <Text style={{ fontSize: 8, textAlign: "center", color: "#666", marginTop: 5 }}>
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// Helper function untuk mendapatkan label kondisi
function getKondisiLabel(kondisiId: string): string {
  const kondisiMap: Record<string, string> = {
    kondisi1: "Pewaris memiliki 1 istri dan semua anak masih hidup",
    kondisi2: "Pewaris memiliki 1 istri dan ada anak yang meninggal",
    kondisi3: "Pewaris memiliki 1 istri, ada anak yang meninggal dan memiliki cucu",
    kondisi4: "Pewaris menikah 2 kali",
    kondisi5: "Suami pewaris masih hidup",
    kondisi6: "Pewaris tidak memiliki keturunan",
    kondisi7: "Pewaris tidak memiliki keturunan dan hanya memiliki saudara kandung",
  };
  return kondisiMap[kondisiId] || kondisiId;
}

// Helper untuk render pengelompokan istri
function renderPengelompokanIstri(data: FormValues) {
  const { ahliWaris } = data;
  
  const istri1 = ahliWaris.filter(ahli => 
    ahli.keterangan?.includes("Istri 1") || ahli.hubungan === "ISTRI"
  );
  
  const istri2 = ahliWaris.filter(ahli => 
    ahli.keterangan?.includes("Istri 2")
  );
  
  const anakIstri1 = ahliWaris.filter(ahli => 
    ahli.hubungan === "ANAK" && ahli.keterangan?.includes("Istri 1")
  );
  
  const anakIstri2 = ahliWaris.filter(ahli => 
    ahli.hubungan === "ANAK" && ahli.keterangan?.includes("Istri 2")
  );
  
  return (
    <View>
      <Text style={{ fontSize: 10, marginBottom: 5 }}>
        • Istri Pertama: {istri1.length > 0 ? istri1[0].nama : "-"} ({anakIstri1.length} anak)
      </Text>
      <Text style={{ fontSize: 10, marginBottom: 5 }}>
        • Istri Kedua: {istri2.length > 0 ? istri2[0].nama : "-"} ({anakIstri2.length} anak)
      </Text>
    </View>
  );
}