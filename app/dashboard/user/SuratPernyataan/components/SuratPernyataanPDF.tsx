// app/dashboard/SuratPernyataan/components/SuratPernyataanPDF.tsx
"use client";

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { FormValues } from "../types";

// Styles dengan font built-in Times-Roman
const styles = StyleSheet.create({
  // === PAGE STYLES ===
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.5,
  },

  page2: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.5,
  },

  // === TYPOGRAPHY ===
  title: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    textAlign: "center",
    marginBottom: 20,
    textDecoration: "underline",
  },

  paragraph: {
    fontSize: 11,
    textAlign: "justify",
    marginBottom: 12,
    lineHeight: 1.5,
  },

  paragraphNoIndent: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.5,
  },

  bold: {
    fontFamily: "Times-Bold",
  },

  underline: {
    textDecoration: "underline",
  },

  // === FORM ELEMENTS ===
  formSection: {
    marginBottom: 15,
  },

  formRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  formLabel: {
    width: "35%",
    fontSize: 11,
  },

  formValue: {
    width: "65%",
    fontSize: 11,
    fontFamily: "Times-Bold",
  },

  formValueRegular: {
    width: "65%",
    fontSize: 11,
  },

  // === LIST STYLES ===
  listItem: {
    marginBottom: 15,
  },

  // === SIGNATURE SECTION ===
  signatureContainer: {
    position: "absolute",
    right: 40,
    top: 600,
    width: "50%",
  },

  // === SIGNATURE SECTION STYLES ===
signatureSection: {
  marginTop: 30,
},

signatureRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

signatureBox: {
  width: "45%",
  alignItems: "center",
},

signatureLabel: {
  fontSize: 11,
  marginBottom: 10,
  textAlign: "center",
  lineHeight: 1.5,
},

signatureName: {
  fontSize: 11,
  textAlign: "center",
  marginTop: 5,
},

  signatureRightContainer: {
    marginTop: 30,
    alignSelf: "flex-end",
    width: "50%",
    alignItems: "flex-end",
  },

  dateContainer: {
    marginBottom: 20,
    alignItems: "flex-end",
  },

  ahliWarisContainer: {
    marginBottom: 10,
  },

  ahliWarisList: {
    marginTop: 10,
    width: "100%",
  },

  ahliWarisItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "flex-start",
  },

  ahliWarisNumber: {
    fontSize: 11,
    width: 20,
  },

  ahliWarisName: {
    fontSize: 11,
    flex: 1,
    marginLeft: 5,
    marginRight: 20,
  },

  meteraiContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 80,
    alignItems: "center",
  },


  meteraiText: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },

  // === TABLE STYLES ===
  table: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 5,
  },

  tableCell: {
    fontSize: 11,
    paddingHorizontal: 5,
  },

  // === UTILITY CLASSES ===
  textCenter: {
    textAlign: "center",
  },

  textRight: {
    textAlign: "right",
  },

  textLeft: {
    textAlign: "left",
  },

  textBold: {
    fontFamily: "Times-Bold",
  },

  textItalic: {
    fontFamily: "Times-Italic",
  },

  mb5: {
    marginBottom: 5,
  },

  mb10: {
    marginBottom: 10,
  },

  mb15: {
    marginBottom: 15,
  },

  mb20: {
    marginBottom: 20,
  },

  mb30: {
    marginBottom: 30,
  },

  mt5: {
    marginTop: 5,
  },

  mt10: {
    marginTop: 10,
  },

  mt15: {
    marginTop: 15,
  },

  mt20: {
    marginTop: 20,
  },

  mt30: {
    marginTop: 30,
  },

  mt40: {
    marginTop: 40,
  },

  ml10: {
    marginLeft: 10,
  },

  ml20: {
    marginLeft: 20,
  },

  mr10: {
    marginRight: 10,
  },

  // === LAYOUT ===
  flexRow: {
    flexDirection: "row",
  },

  flexCol: {
    flexDirection: "column",
  },

  justifyBetween: {
    justifyContent: "space-between",
  },

  itemsStart: {
    alignItems: "flex-start",
  },

  itemsCenter: {
    alignItems: "center",
  },

  // === STAMP SECTION ===
  stampContainer: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 10,
  },

  stampRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  stampCol: {
    width: "48%",
  },
});

interface SuratPernyataanPDFProps {
  data: FormValues;
}

export default function SuratPernyataanPDF({ data }: SuratPernyataanPDFProps) {
  // === VALIDATION ===
  if (!data || !data.dataPewaris) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={[styles.textCenter, styles.mt30]}>
            Data tidak lengkap untuk membuat surat pernyataan.
          </Text>
          <Text style={[styles.textCenter, styles.mt10]}>
            Harap lengkapi semua data terlebih dahulu.
          </Text>
        </Page>
      </Document>
    );
  }

  const pewaris = data.dataPewaris;
  const ahliWaris = data.ahliWaris ?? [];

  // Filter berdasarkan hubungan
  const istri = ahliWaris.filter((item) => item.hubungan === "ISTRI");
  const anak = ahliWaris.filter((item) => item.hubungan === "ANAK");
  
  // Gabungkan istri dan anak untuk tanda tangan
  const ahliWarisTandatangan = [...istri, ...anak].slice(0, 4); // Max 4 untuk tanda tangan

  // === HELPER FUNCTIONS ===
  const formatDate = (dateString?: string): string => {
    if (!dateString || dateString.trim() === "") return "__________";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "__________";

      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      return `${day} ${bulan[month]} ${year}`;
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "__________";
    }
  };

  const formatTTL = (tempat?: string, tanggal?: string): string => {
    const tempatText = tempat?.trim() || "__________";
    const tanggalText = formatDate(tanggal);
    return `${tempatText}, ${tanggalText}`;
  };

  const formatAlamat = (alamat?: string): string => {
    return alamat || "__________";
  };

  const formatNamaLengkap = (
    nama?: string,
    namaAyah?: string,
    jenisKelamin?: string,
  ): string => {
    const namaText = nama || "__________";
    const namaAyahText = namaAyah || "__________";

    if (jenisKelamin === "PEREMPUAN") {
      return `${namaText} BINTI ${namaAyahText}`;
    } else {
      return `${namaText} BIN ${namaAyahText}`;
    }
  };

  const formatAkteKematian = (nomor?: string): string => {
    if (!nomor || nomor.trim() === "") return "3173-KM-__________";
    return nomor;
  };


  // Format tanggal lengkap untuk surat
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const tanggalSuratLengkap = `${currentDay} ${bulan[currentMonth]} ${currentYear}`;

  return (
    <Document>
      {/* ========== HALAMAN 1 ========== */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.textCenter, styles.mb20]}>
          <Text style={styles.title}>SURAT PERNYATAAN AHLI WARIS</Text>
        </View>

        {/* Pembukaan */}
        <View style={styles.formSection}>
          <Text style={styles.paragraph}>
            Kami yang bertandatangan di bawah ini para ahli waris dari Almarhum{" "}
            <Text style={styles.bold}>
              {formatNamaLengkap(
                pewaris.nama,
                pewaris.namaAyah,
                pewaris.jenisKelamin,
              )}
            </Text>
          </Text>

          <Text style={styles.paragraph}>
            Dengan ini menyatakan dengan sesungguhnya dan sanggup diangkat
            sumpah, bahwa Almarhum{" "}
            <Text style={styles.bold}>
              {formatNamaLengkap(
                pewaris.nama,
                pewaris.namaAyah,
                pewaris.jenisKelamin,
              )}
            </Text>{" "}
            Lahir di{" "}
            <Text style={styles.bold}>
              {formatTTL(pewaris.tempatLahir, pewaris.tanggalLahir)}
            </Text>{" "}
            bertempat tinggal terakhir di{" "}
            <Text style={styles.bold}>
              {pewaris.alamat || "__________"}, RT {pewaris.rt || "______"} RW{" "}
              {pewaris.rw || "______"} Kelurahan Grogol, Kecamatan Grogol
              Petamburan Kota Administrasi Jakarta Barat
            </Text>
            , telah meninggal dunia di{" "}
            <Text style={styles.bold}>
              {pewaris.tempatMeninggal || "__________"}
            </Text>{" "}
            pada tanggal{" "}
            <Text style={styles.bold}>
              {formatDate(pewaris.tanggalMeninggal)}
            </Text>{" "}
            sesuai dengan Akte Kematian dari Dinas Dukcapil Provinsi DKI Jakarta
            Nomor{" "}
            <Text style={styles.bold}>
              {formatAkteKematian(pewaris.nomorAkteKematian)}
            </Text>{" "}
            tanggal{" "}
            <Text style={styles.bold}>
              {formatDate(pewaris.tanggalAkteKematian)}
            </Text>
            .
          </Text>

          <Text style={styles.paragraph}>
            Semasa hidupnya Almarhum{" "}
            <Text style={styles.bold}>
              {formatNamaLengkap(
                pewaris.nama,
                pewaris.namaAyah,
                pewaris.jenisKelamin,
              )}
            </Text>{" "}
            menikah hanya {istri.length} (
            {istri.length === 1
              ? "satu"
              : istri.length === 0
                ? "tidak"
                : istri.length}
            ) kali{" "}
            {istri.length > 0 ? (
              <>
                dengan Almarhumah{" "}
                <Text style={styles.bold}>
                  {formatNamaLengkap(
                    istri[0]?.nama,
                    istri[0]?.namaAyah,
                    istri[0]?.jenisKelamin,
                  )}
                </Text>{" "}
              </>
            ) : (
              "tidak memiliki istri"
            )}
            Sesuai Surat Nikah Nomor{" "}
            <Text style={styles.bold}>
              {pewaris.noSuratNikah || "__________"}
            </Text>{" "}
            tanggal{" "}
            <Text style={styles.bold}>{formatDate(pewaris.tanggalNikah)}</Text>{" "}
            dari KUA/Dukcapil{" "}
            <Text style={styles.bold}>{pewaris.kuaNikah || "__________"}</Text>,
            dari perkawinannya dikaruniai {anak.length} (tiga) orang yang kini
            masih hidup, yaitu :
          </Text>
        </View>

        {/* Daftar Anak */}
        <View style={[styles.formSection, styles.mt10]}>
          {anak.slice(0, 3).map((anakItem, index) => (
            <View key={index} style={styles.listItem}>

              {/* BARIS NAMA (SEJAJAR DENGAN FIELD LAIN) */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>
                  {index + 1}. Nama :
                </Text>
                <Text style={styles.formValue}>
                  {anakItem.nama || "__________"} (Anak)
                </Text>
              </View>

              {/* TEMPAT / TGL LAHIR */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Tempat Tgl. Lahir :</Text>
                <Text style={styles.formValue}>
                  {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}
                </Text>
              </View>

              {/* PEKERJAAN */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Pekerjaan :</Text>
                <Text style={styles.formValue}>
                  {anakItem.pekerjaan || "__________"}
                </Text>
              </View>

              {/* AGAMA */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Agama :</Text>
                <Text style={styles.formValue}>
                  {anakItem.agama || "__________"}
                </Text>
              </View>

              {/* ALAMAT */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Alamat :</Text>
                <Text style={styles.formValue}>
                  {formatAlamat(anakItem.alamat)}
                </Text>
              </View>

              {/* NIK */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>No. KTP :</Text>
                <Text style={styles.formValue}>
                  {anakItem.nik || "__________"}
                </Text>
              </View>

            </View>
          ))}
        </View>

        {/* Penutup */}
        <View style={[styles.formSection, styles.mt20]}>
          <Text style={styles.paragraph}>
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

        {/* Titik untuk pemisah */}
        <View style={[styles.textCenter, styles.mt10]}>
          <Text>.</Text>
        </View>

        {/* Container utama untuk tanda tangan di kanan */}
        <View style={styles.signatureRightContainer}>
          {/* Tempat dan Tanggal */}
          <View style={styles.dateContainer}>
            <Text style={[styles.paragraphNoIndent, styles.textRight]}>
              Jakarta, {tanggalSuratLengkap}
            </Text>
          </View>

          {/* "Kami para Ahli Waris" */}
          <View style={styles.ahliWarisContainer}>
            <Text style={[styles.paragraphNoIndent, styles.textBold, styles.mb10]}>
              Kami para Ahli Waris
            </Text>
          </View>

          {/* Container untuk list dan meterai */}
          <View style={[styles.flexRow, { position: "relative" }]}>
            {/* List ahli waris */}
            <View style={[styles.ahliWarisList, { marginRight: 85 }]}>
              {ahliWarisTandatangan.map((ahli, index) => (
                <View key={index} style={styles.ahliWarisItem}>
                  <Text style={styles.ahliWarisNumber}>{index + 1}.</Text>
                  <Text style={styles.ahliWarisName}>
                    {ahli.nama || "__________"}
                  </Text>
                </View>
              ))}
            </View>

            {/* Meterai di sebelah kanan */}
            <View style={styles.meteraiContainer}>
              <Text style={styles.meteraiText}>
                Meterai{"\n"}10.000
              </Text>
            </View>
          </View>
        </View>
      </Page>


      {/* ========== HALAMAN 2 ========== */}
      <Page size="A4" style={styles.page2}>
        {/* Saksi-saksi */}
        <View style={[styles.formSection, styles.mt30]}>
          <Text
            style={[styles.paragraphNoIndent, styles.textBold, styles.mb15]}
          >
            Saksi-saksi:
          </Text>

          {[1, 2].map((saksiNum) => (
            <View key={saksiNum} style={[styles.mb20]}>
              <Text style={[styles.paragraphNoIndent, styles.mb5]}>
                {saksiNum === 1 ? "1." : "2."} Nama :{" "}
                <Text style={styles.bold}>__________ (__________)</Text>
              </Text>
              
              <View style={styles.ml10}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>NIK :</Text>
                  <Text style={styles.formValueRegular}>__________</Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat/Tgl. Lahir :</Text>
                  <Text style={styles.formValueRegular}>__________</Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat :</Text>
                  <Text style={styles.formValueRegular}>__________</Text>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan :</Text>
                  <Text style={styles.formValueRegular}>__________</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Mengetahui RT/RW */}
        <View style={[styles.signatureSection, styles.mt40]}>
          <Text
            style={[styles.paragraphNoIndent, styles.textBold, styles.mb20]}
          >
            Mengetahui
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                Ketua RW __________
                {"\n"}
                Kelurahan Grogol
              </Text>
              <Text style={[styles.signatureName, styles.mt30]}>
                (__________)
              </Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                Ketua RT __________
                {"\n"}
                Kelurahan Grogol
              </Text>
              <Text style={[styles.signatureName, styles.mt30]}>
                (__________)
              </Text>
            </View>
          </View>
        </View>

        {/* Cap dan Tanda Tangan Lurah */}
        <View style={[styles.stampContainer, styles.mt40]}>
          <View style={[styles.textCenter, styles.mb15]}>
            <Text style={[styles.paragraphNoIndent, styles.textBold]}>
              Berdasarkan data/dokumen yang Disampaikan dan atas permintaan yang
              bersangkutan dicatatkan dalam register Kelurahan Grogol
            </Text>
          </View>

          <View style={styles.stampRow}>
            <View style={styles.stampCol}>
              <Text style={[styles.paragraphNoIndent, styles.mb5]}>
                dicatatkan dalam register
              </Text>
              <Text
                style={[styles.paragraphNoIndent, styles.textBold, styles.mb10]}
              >
                Kecamatan Grogol Petamburan
              </Text>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Nomor :</Text>
                <Text style={styles.formValueRegular}>__________</Text>
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Tanggal :</Text>
                <Text style={styles.formValueRegular}>__________</Text>
              </View>

              <Text style={[styles.paragraphNoIndent, styles.mt10]}>
                Camat Grogol Petamburan
              </Text>
            </View>

            <View style={styles.stampCol}>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Nomor :</Text>
                <Text style={styles.formValueRegular}>__________</Text>
              </View>

              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Tanggal :</Text>
                <Text style={styles.formValueRegular}>__________</Text>
              </View>

              <Text
                style={[styles.paragraphNoIndent, styles.textBold, styles.mt10]}
              >
                Lurah Kelurahan Grogol
              </Text>

              <Text style={[styles.paragraphNoIndent, styles.mt5]}>
                Ady Saputro, S.IP., M.A
              </Text>

              <Text style={styles.paragraphNoIndent}>
                NIP 199109092015071001
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}