// app/components/surat-templates/SuratPernyataanKondisi1.tsx
"use client";

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
    textAlign: "center",
    marginBottom: 30,
    borderBottom: "2 solid #000",
    paddingBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textDecoration: "underline",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 3,
  },
  bodyText: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  underlineText: {
    textDecoration: "underline",
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dataLabel: {
    width: 150,
    fontWeight: "bold",
  },
  dataValue: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 60,
    marginBottom: 40,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  signatureBox: {
    width: "30%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottom: "1 solid #000",
    marginTop: 60,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ddd",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    paddingHorizontal: 5,
    flex: 1,
  },
  numberCell: {
    width: 30,
    textAlign: "center",
  },
  stampSection: {
    marginTop: 30,
    padding: 10,
    border: "1 solid #000",
    borderRadius: 5,
  },
});

interface SuratPernyataanKondisi1Props {
  data: any;
}

export function SuratPernyataanKondisi1({
  data,
}: SuratPernyataanKondisi1Props) {
  // Template khusus untuk kondisi 1: Pewaris memiliki 1 istri dan semua anak masih hidup
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy", { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });

  // Get istri
  const istri = data.ahliWaris.find((ahli: any) => ahli.hubungan === "ISTRI");
  // Get anak-anak
  const anakAnak = data.ahliWaris.filter(
    (ahli: any) => ahli.hubungan === "ANAK"
  );

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
            {data.dataPewaris.nama}
          </Text>

          <Text style={styles.bodyText}>
            Dengan ini menyatakan dengan sesungguhnya dan sanggup diangkat
            sumpah, bahwa Almarhum {data.dataPewaris.nama} Lahir di{" "}
            {data.dataPewaris.tempatLahir} tanggal{" "}
            {formatDate(data.dataPewaris.tanggalLahir)} bertempat tinggal
            terakhir di {data.dataPewaris.alamat}, telah meninggal dunia di{" "}
            {data.dataPewaris.tempatMeninggal} pada tanggal{" "}
            {formatDate(data.dataPewaris.tanggalMeninggal)} sesuai dengan Akte
            Kematian dari Dinas Dukcapil Provinsi DKI Jakarta Nomor{" "}
            {data.dataPewaris.nomorAkteKematian} tanggal{" "}
            {formatDate(data.dataPewaris.tanggalMeninggal)}.
          </Text>

          <Text style={styles.bodyText}>
            Semasa hidupnya Almarhum {data.dataPewaris.nama} menikah hanya 1
            (satu) kali dengan {istri?.nama} sesuai Surat Nikah Nomor [Nomor
            Surat Nikah] tanggal [Tanggal Nikah] dari KUA/Dukcapil [Instansi],
            dari perkawinannya dikaruniai {anakAnak.length} orang anak yang kini
            masih hidup, yaitu :
          </Text>
        </View>

        {/* Data Anak */}
        <View style={styles.section}>
          {anakAnak.map((anak: any, index: number) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.boldText}>
                {index + 1}. Nama : {anak.nama} (Anak)
              </Text>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Tempat Tgl. Lahir</Text>
                <Text style={styles.dataValue}>
                  : {anak.tempatLahir}, {formatDate(anak.tanggalLahir)}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Pekerjaan</Text>
                <Text style={styles.dataValue}>: {anak.pekerjaan}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Agama</Text>
                <Text style={styles.dataValue}>: {anak.agama}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Alamat</Text>
                <Text style={styles.dataValue}>: {anak.alamat}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>No. KTP</Text>
                <Text style={styles.dataValue}>: {anak.nik}</Text>
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
              <Text style={styles.boldText}>Nama : {istri.nama} (Istri)</Text>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Tempat Tgl. Lahir</Text>
                <Text style={styles.dataValue}>
                  : {istri.tempatLahir}, {formatDate(istri.tanggalLahir)}
                </Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Pekerjaan</Text>
                <Text style={styles.dataValue}>: {istri.pekerjaan}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Agama</Text>
                <Text style={styles.dataValue}>: {istri.agama}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Alamat</Text>
                <Text style={styles.dataValue}>: {istri.alamat}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>No. KTP</Text>
                <Text style={styles.dataValue}>: {istri.nik}</Text>
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
          <Text style={[styles.bodyText, { textAlign: "right" }]}>
            Jakarta, {currentDate}
          </Text>
          <Text style={[styles.bodyText, { marginTop: 20, marginBottom: 10 }]}>
            Kami para Ahli Waris
          </Text>

          {/* Tanda tangan istri */}
          {istri && (
            <View style={{ marginBottom: 30 }}>
              <Text>
                1. <Text style={styles.boldText}>{istri.nama}</Text> (Istri)
              </Text>
              <Text style={{ marginTop: 5 }}>Meterai 10.000</Text>
            </View>
          )}

          {/* Tanda tangan anak-anak */}
          {anakAnak.map((anak: any, index: number) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text>
                {istri ? index + 2 : index + 1}.{" "}
                <Text style={styles.boldText}>{anak.nama}</Text> (Anak)
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
            Template Kondisi 1: Pewaris memiliki 1 istri dan semua anak masih
            hidup
          </Text>
          <Text>Dicetak pada: {currentDate}</Text>
        </View>
      </Page>
    </Document>
  );
}
