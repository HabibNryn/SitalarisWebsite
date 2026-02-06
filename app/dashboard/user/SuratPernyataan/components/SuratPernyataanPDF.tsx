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
  kondisiId?: string; // ID kondisi dari array yang Anda berikan
}

export default function SuratPernyataanPDF({ data, kondisiId = data.kondisi }: SuratPernyataanPDFProps) {
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
  const dataAnakMeninggal = data.anakMeninggal ?? [];

  // Filter berdasarkan hubungan
  const istri = ahliWaris.filter((item) => item.hubungan === "ISTRI");
  const suami = ahliWaris.filter((item) => item.hubungan === "SUAMI");
  const anak = ahliWaris.filter((item) => item.hubungan === "ANAK");
  const cucu = ahliWaris.filter((item) => item.hubungan === "CUCU");
  const orangTua = ahliWaris.filter((item) => 
    item.hubungan === "ORANG_TUA"
  );
  const saudara = ahliWaris.filter((item) => item.hubungan === "SAUDARA");

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

  // === HELPER FUNCTIONS ===
  const formatDate = (dateString?: string): string => {
    if (!dateString || dateString.trim() === "") return "__________";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "__________";

      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

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

  // Fungsi untuk menentukan judul berdasarkan jenis kelamin pewaris
  const getJudulPewaris = () => {
    if (pewaris.jenisKelamin === "PEREMPUAN") {
      return "Almarhumah";
    }
    return "Almarhum";
  };

  // Fungsi untuk menentukan apakah menikah 1 atau 2 kali
  const getStatusPernikahan = () => {
    if (kondisiId === "kondisi4") {
      return "menikah 2 (dua) kali";
    }
    return `menikah hanya ${istri.length > 0 ? "1 (satu)" : "tidak pernah"} kali`;
  };

  // Fungsi untuk render daftar ahli waris berdasarkan kondisi
  const renderDaftarAhliWaris = () => {
    switch (kondisiId) {
      case "kondisi1": // 1 istri, semua anak hidup
        return (
          <>
            {istri.length > 0 && (
              <View style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>1. Nama</Text>
                  <Text style={styles.formValue}>: {istri[0].nama || "__________"} (Istri)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(istri[0].tempatLahir, istri[0].tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {istri[0].pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {istri[0].agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(istri[0].alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {istri[0].nik || "__________"}</Text>
                </View>
              </View>
            )}

            {anak.map((anakItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{istri.length > 0 ? index + 2 : index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {anakItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {anakItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(anakItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {anakItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}
          </>
        );

      case "kondisi2": // 1 istri, ada anak yang meninggal (tanpa keturunan)
        const semuaAnak = ahliWaris.filter((item) => item.hubungan === "ANAK");
        const anakHidupK2 = semuaAnak.filter((item) => item.statusHidup === "HIDUP");
        const anakMeninggalTanpaKeturunan = semuaAnak.filter(
          (item) => item.statusHidup === "MENINGGAL" && item.memilikiKeturunan === false
        );
        
        const totalAnakK2 = anakHidupK2.length + anakMeninggalTanpaKeturunan.length;
        
        return (
          <>
            <Text style={[styles.paragraph, styles.mb10]}>
              Semasa hidupnya {getJudulPewaris()}{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(pewaris.nama, pewaris.namaAyah, pewaris.jenisKelamin)}
              </Text>{" "}
              {getStatusPernikahan()}{" "}
              {istri.length > 0 && (
                <>
                  dengan {istri[0].statusHidup === "MENINGGAL" ? "Almarhumah " : ""}
                  <Text style={styles.bold}>
                    {formatNamaLengkap(istri[0].nama, istri[0].namaAyah, istri[0].jenisKelamin)}
                  </Text>{" "}
                </>
              )}
              sesuai Surat Nikah Nomor{" "}
              <Text style={styles.bold}>{pewaris.noSuratNikah || "__________"}</Text> tanggal{" "}
              <Text style={styles.bold}>{formatDate(pewaris.tanggalNikah)}</Text> dari{" "}
              <Text style={styles.bold}>{pewaris.instansiNikah || "__________"}</Text>, dari perkawinannya dikaruniai{" "}
              <Text style={styles.bold}>
                {totalAnakK2} ({totalAnakK2 === 1 ? "satu" : totalAnakK2 === 2 ? "dua" : totalAnakK2 === 3 ? "tiga" : "empat"})
              </Text> orang anak,{" "}
              <Text style={styles.bold}>
                {anakHidupK2.length} ({anakHidupK2.length === 1 ? "satu" : anakHidupK2.length === 2 ? "dua" : "tiga"})
              </Text> orang yang kini masih hidup, yaitu :
            </Text>

            {/* Anak yang masih hidup */}
            {anakHidupK2.map((anakItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {anakItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {anakItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(anakItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {anakItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}

            {/* Anak yang meninggal tanpa keturunan */}
            {anakMeninggalTanpaKeturunan.map((anakItem, index) => {
              const startNumber = anakHidupK2.length + 1;
              const dataKematianAnak = dataAnakMeninggal?.find(
                (data) => data.nama === anakItem.nama
              ) || dataAnakMeninggal?.[index];
              
              return (
                <View key={`meninggal-${index}`} style={styles.listItem}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>{startNumber}. Nama</Text>
                    <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak)</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                    <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                  </View>
                  <Text style={[styles.paragraph, styles.ml10]}>
                    Telah meninggal dunia di Jakarta pada tanggal{" "}
                    <Text style={styles.bold}>
                      {formatDate(dataKematianAnak?.tanggalMeninggal) || "__________"}
                    </Text>{" "}
                    sesuai dengan Akte Kematian dari Dinas Dukcapil Provinsi DKI Jakarta Nomor :{" "}
                    <Text style={styles.bold}>
                      {formatAkteKematian(dataKematianAnak?.nomorAkteKematian) || "3173-KM-__________"}
                    </Text>{" "}
                    tanggal{" "}
                    <Text style={styles.bold}>
                      {formatDate(dataKematianAnak?.tanggalAkteKematian) || "__________"}
                    </Text>{" "}
                    Bulan{" "}. Semasa hidupnya almarhum/almarhumah{" "}
                    <Text style={styles.bold}>{anakItem.nama || "__________"}</Text> belum pernah menikah dan tidak memiliki keturunan (Anak).
                  </Text>
                </View>
              );
            })}
          </>
        );

      case "kondisi3": // 1 istri, ada anak yang meninggal (dengan keturunan)
        // Mengambil data dari form
        const anakList = ahliWaris.filter((item) => item.hubungan === "ANAK");
        const anakMeninggalDenganKeturunan = anakList.filter(
          (item) => item.statusHidup === "MENINGGAL" && item.memilikiKeturunan === true
        );
        const anakHidupList = anakList.filter((item) => item.statusHidup === "HIDUP");
        const cucuList = ahliWaris.filter((item) => item.hubungan === "CUCU");
        
        // Total anak = anak hidup + anak meninggal dengan keturunan
        const totalAnak = anakHidupList.length + anakMeninggalDenganKeturunan.length;
        
        return (
          <>
            <Text style={[styles.paragraph, styles.mb10]}>
              Semasa hidupnya {getJudulPewaris()}{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(pewaris.nama, pewaris.namaAyah, pewaris.jenisKelamin)}
              </Text>{" "}
              {getStatusPernikahan()}{" "}
              {istri.length > 0 && (
                <>
                  dengan {istri[0].statusHidup === "MENINGGAL" ? "Almarhumah " : ""}
                  <Text style={styles.bold}>
                    {formatNamaLengkap(istri[0].nama, istri[0].namaAyah, istri[0].jenisKelamin)}
                  </Text>{" "}
                </>
              )}
              sesuai Surat Nikah Nomor{" "}
              <Text style={styles.bold}>{pewaris.noSuratNikah || "__________"}</Text> tanggal{" "}
              <Text style={styles.bold}>{formatDate(pewaris.tanggalNikah)}</Text> dari{" "}
              <Text style={styles.bold}>{pewaris.instansiNikah || "__________"}</Text>, dari perkawinannya dikaruniai{" "}
              <Text style={styles.bold}>
                {totalAnak} ({totalAnak === 1 ? "satu" : totalAnak === 2 ? "dua" : totalAnak === 3 ? "tiga" : "empat"})
              </Text> orang anak,{" "}
              <Text style={styles.bold}>
                {anakHidupList.length} ({anakHidupList.length === 1 ? "satu" : anakHidupList.length === 2 ? "dua" : "tiga"})
              </Text> orang yang kini masih hidup, yaitu :
            </Text>

            {/* Anak yang masih hidup */}
            {anakHidupList.map((anakItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {anakItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {anakItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(anakItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {anakItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}

            {/* Anak yang meninggal dengan keturunan */}
            {anakMeninggalDenganKeturunan.map((anakItem, index) => {
              const startNumber = anakHidupList.length + 1;
              
              // Mencari data kematian anak dari form dataAnakMeninggal
              const dataKematianAnak = dataAnakMeninggal?.find(
                (data) => data.nama === anakItem.nama
              ) || dataAnakMeninggal?.[index];
              
              return (
                <View key={`meninggal-${index}`} style={styles.listItem}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>{startNumber}. Nama</Text>
                    <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak)</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                    <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                  </View>
                  <Text style={[styles.paragraph, styles.ml10]}>
                    Telah meninggal dunia di Jakarta pada tanggal{" "}
                    <Text style={styles.bold}>
                      {formatDate(dataKematianAnak?.tanggalMeninggal) || "__________"}
                    </Text>{" "}
                    sesuai dengan Akte Kematian dari Dinas Dukcapil Provinsi DKI Jakarta Nomor :{" "}
                    <Text style={styles.bold}>
                      {formatAkteKematian(dataKematianAnak?.nomorAkteKematian) || "3173-KM-__________"}
                    </Text>{" "}
                    tanggal{" "}
                    <Text style={styles.bold}>
                      {formatDate(dataKematianAnak?.tanggalAkteKematian) || "__________"}
                    </Text>{" "}
                    . Semasa hidupnya{" "}
                    {anakItem.jenisKelamin === "PEREMPUAN" ? "almarhumah" : "almarhum"}{" "}
                    <Text style={styles.bold}>{anakItem.nama || "__________"}</Text> menikah dengan{" "}
                    <Text style={styles.bold}>
                      {dataKematianAnak?.namaPasangan || "__________"}
                    </Text>{" "}
                    sesuai dengan surat nikah nomor :{" "}
                    <Text style={styles.bold}>
                      {dataKematianAnak?.nomorSuratNikah || "__________"}
                    </Text>{" "}
                    tanggal{" "}
                    <Text style={styles.bold}>
                      {formatDate(dataKematianAnak?.tanggalNikah) || "__________"}
                    </Text>{" "}
                    dan memiliki{" "}
                    <Text style={styles.bold}>
                      {cucuList.length} ({cucuList.length === 1 ? "satu" : "dua"})
                    </Text> orang anak yaitu :
                  </Text>

                  {/* Cucu-cucu */}
                  {cucuList.map((cucuItem, cucuIndex) => (
                    <View key={cucuIndex} style={[styles.listItem, styles.ml20]}>
                      <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                          {cucuIndex === 0 ? "A." : "B."} Nama
                        </Text>
                        <Text style={styles.formValue}>: {cucuItem.nama || "__________"} (cucu)</Text>
                      </View>
                      <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                        <Text style={styles.formValue}>: {formatTTL(cucuItem.tempatLahir, cucuItem.tanggalLahir)}</Text>
                      </View>
                      <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Pekerjaan</Text>
                        <Text style={styles.formValue}>: {cucuItem.pekerjaan || "__________"}</Text>
                      </View>
                      <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Agama</Text>
                        <Text style={styles.formValue}>: {cucuItem.agama || "__________"}</Text>
                      </View>
                      <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Alamat</Text>
                        <Text style={styles.formValue}>: {formatAlamat(cucuItem.alamat)}</Text>
                      </View>
                      <View style={styles.formRow}>
                        <Text style={styles.formLabel}>No. KTP</Text>
                        <Text style={styles.formValue}>: {cucuItem.nik || "__________"}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })}
          </>
        );

      case "kondisi4": // Menikah 2 kali
        const istriPertama = istri.find((item) => item.keterangan?.includes("PERTAMA") || item.urutan === 1);
        const istriKedua = istri.find((item) => item.keterangan?.includes("KEDUA") || item.urutan === 2);
        const anakIstriPertama = anak.filter((item) => item.keterangan?.includes("PERTAMA") || item.asalIstri === "PERTAMA");
        const anakIstriKedua = anak.filter((item) => item.keterangan?.includes("KEDUA") || item.asalIstri === "KEDUA");

        return (
          <>
            <Text style={[styles.paragraph, styles.mb10]}>
              Semasa hidupnya {getJudulPewaris()}{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(pewaris.nama, pewaris.namaAyah, pewaris.jenisKelamin)}
              </Text>{" "}
              {getStatusPernikahan()}. Pernikahan ke 1 (satu) dengan{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(istriPertama?.nama, istriPertama?.namaAyah, istriPertama?.jenisKelamin)}
              </Text>{" "}
              sesuai Surat Nikah Nomor{" "}
              <Text style={styles.bold}>{pewaris.noSuratNikah || "__________"}</Text> tanggal{" "}
              <Text style={styles.bold}>{formatDate(pewaris.tanggalNikah)}</Text> dari{" "}
              <Text style={styles.bold}>{pewaris.instansiNikah || "__________"}</Text>, dari perkawinannya dikaruniai{" "}
              <Text style={styles.bold}>{anakIstriPertama.length} ({anakIstriPertama.length === 1 ? "satu" : "dua"})</Text> orang anak yang kini masih hidup, yaitu :
            </Text>

            {/* Istri pertama */}
            {istriPertama && (
              <View style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>1. Nama</Text>
                  <Text style={styles.formValue}>: {istriPertama.nama || "__________"} (Istri Pertama)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(istriPertama.tempatLahir, istriPertama.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {istriPertama.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {istriPertama.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(istriPertama.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {istriPertama.nik || "__________"}</Text>
                </View>
              </View>
            )}

            {/* Anak dari istri pertama */}
            {anakIstriPertama.map((anakItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{index + 2}. Nama</Text>
                  <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak dari Istri Pertama)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {anakItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {anakItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(anakItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {anakItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.paragraph, styles.mt20, styles.mb10]}>
              Pernikahan ke 2 (dua) dengan{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(istriKedua?.nama, istriKedua?.namaAyah, istriKedua?.jenisKelamin)}
              </Text>{" "}
              sesuai Surat Nikah Nomor{" "}
              <Text style={styles.bold}>{pewaris.noSuratNikahKedua || "__________"}</Text> tanggal{" "}
              <Text style={styles.bold}>{formatDate(pewaris.tanggalNikahKedua)}</Text> dari{" "}
              <Text style={styles.bold}>{pewaris.instansiNikahKedua || "__________"}</Text>, dari perkawinannya dikaruniai{" "}
              <Text style={styles.bold}>{anakIstriKedua.length} ({anakIstriKedua.length === 1 ? "satu" : "dua"})</Text> orang anak yang kini masih hidup, yaitu :
            </Text>

            {/* Istri kedua */}
            {istriKedua && (
              <View style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{anakIstriPertama.length + 2}. Nama</Text>
                  <Text style={styles.formValue}>: {istriKedua.nama || "__________"} (Istri Kedua)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(istriKedua.tempatLahir, istriKedua.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {istriKedua.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {istriKedua.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(istriKedua.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {istriKedua.nik || "__________"}</Text>
                </View>
              </View>
            )}

            {/* Anak dari istri kedua */}
            {anakIstriKedua.map((anakItem, index) => {
              const startNumber = anakIstriPertama.length + (istriKedua ? 3 : 2);
              return (
                <View key={index} style={styles.listItem}>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>{startNumber + index}. Nama</Text>
                    <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak dari Istri Kedua)</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                    <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Pekerjaan</Text>
                    <Text style={styles.formValue}>: {anakItem.pekerjaan || "__________"}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Agama</Text>
                    <Text style={styles.formValue}>: {anakItem.agama || "__________"}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Alamat</Text>
                    <Text style={styles.formValue}>: {formatAlamat(anakItem.alamat)}</Text>
                  </View>
                  <View style={styles.formRow}>
                    <Text style={styles.formLabel}>No. KTP</Text>
                    <Text style={styles.formValue}>: {anakItem.nik || "__________"}</Text>
                  </View>
                </View>
              );
            })}
          </>
        );

      case "kondisi5": // Suami pewaris masih hidup (pewaris perempuan)
        return (
          <>
            <Text style={[styles.paragraph, styles.mb10]}>
              Semasa hidupnya {getJudulPewaris()}{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(pewaris.nama, pewaris.namaAyah, pewaris.jenisKelamin)}
              </Text>{" "}
              {getStatusPernikahan()}{" "}
              {suami.length > 0 && (
                <>
                  dengan{" "}
                  <Text style={styles.bold}>
                    {formatNamaLengkap(suami[0].nama, suami[0].namaAyah, suami[0].jenisKelamin)}
                  </Text>{" "}
                </>
              )}
              sesuai Surat Nikah Nomor{" "}
              <Text style={styles.bold}>{pewaris.noSuratNikah || "__________"}</Text> tanggal{" "}
              <Text style={styles.bold}>{formatDate(pewaris.tanggalNikah)}</Text> dari{" "}
              <Text style={styles.bold}>{pewaris.instansiNikah || "__________"}</Text>, dari perkawinannya dikaruniai{" "}
              <Text style={styles.bold}>{anak.length} ({anak.length === 1 ? "satu" : "dua"})</Text> orang anak yang kini masih hidup, yaitu :
            </Text>

            {/* Suami */}
            {suami.length > 0 && (
              <View style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>1. Nama</Text>
                  <Text style={styles.formValue}>: {suami[0].nama || "__________"} (Suami)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(suami[0].tempatLahir, suami[0].tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {suami[0].pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {suami[0].agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(suami[0].alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {suami[0].nik || "__________"}</Text>
                </View>
              </View>
            )}

            {/* Anak-anak */}
            {anak.map((anakItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{suami.length > 0 ? index + 2 : index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {anakItem.nama || "__________"} (Anak)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(anakItem.tempatLahir, anakItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {anakItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {anakItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(anakItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {anakItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}
          </>
        );

      case "kondisi6": // Tidak memiliki keturunan (meninggalkan orang tua dan saudara)
        return (
          <>
            <Text style={[styles.paragraph, styles.mb10]}>
              Semasa hidupnya {getJudulPewaris()}{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(pewaris.nama, pewaris.namaAyah, pewaris.jenisKelamin)}
              </Text>{" "}
              belum pernah menikah secara Peraturan Perundang-Undangan Pernikahan yang berlaku (kawin tidak tercatat) hanya meninggalkan kedua orang tua kandung dan{" "}
              <Text style={styles.bold}>{saudara.length} ({saudara.length === 1 ? "satu" : "dua"})</Text> orang saudara kandung yang kini masih hidup, yaitu :
            </Text>

            {/* Orang tua */}
            {orangTua.map((orangtuaItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {orangtuaItem.nama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(orangtuaItem.tempatLahir, orangtuaItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {orangtuaItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {orangtuaItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(orangtuaItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {orangtuaItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}

            {/* Saudara kandung */}
            {saudara.map((saudaraItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{orangTua.length + index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {saudaraItem.nama || "__________"} (Saudara Kandung)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(saudaraItem.tempatLahir, saudaraItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {saudaraItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {saudaraItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(saudaraItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {saudaraItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}
          </>
        );

      case "kondisi7": // Tidak memiliki keturunan, hanya saudara kandung
        return (
          <>
            <Text style={[styles.paragraph, styles.mb10]}>
              Semasa hidupnya {getJudulPewaris()}{" "}
              <Text style={styles.bold}>
                {formatNamaLengkap(pewaris.nama, pewaris.namaAyah, pewaris.jenisKelamin)}
              </Text>{" "}
              belum pernah menikah dan tidak memiliki keturunan, hanya meninggalkan{" "}
              <Text style={styles.bold}>{saudara.length} ({saudara.length === 1 ? "satu" : "dua"})</Text> orang saudara kandung yang kini masih hidup, yaitu :
            </Text>

            {/* Saudara kandung */}
            {saudara.map((saudaraItem, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>{index + 1}. Nama</Text>
                  <Text style={styles.formValue}>: {saudaraItem.nama || "__________"} (Saudara Kandung)</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Tempat Tgl. Lahir</Text>
                  <Text style={styles.formValue}>: {formatTTL(saudaraItem.tempatLahir, saudaraItem.tanggalLahir)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Pekerjaan</Text>
                  <Text style={styles.formValue}>: {saudaraItem.pekerjaan || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Agama</Text>
                  <Text style={styles.formValue}>: {saudaraItem.agama || "__________"}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Alamat</Text>
                  <Text style={styles.formValue}>: {formatAlamat(saudaraItem.alamat)}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>No. KTP</Text>
                  <Text style={styles.formValue}>: {saudaraItem.nik || "__________"}</Text>
                </View>
              </View>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  // Fungsi untuk mendapatkan ahli waris yang akan tanda tangan
  const getAhliWarisTandatangan = () => {
    switch (kondisiId) {
      case "kondisi1": // Istri + anak
        return [...istri, ...anak].slice(0, 6);
      case "kondisi2": // Istri + anak hidup
      case "kondisi3": // Istri + anak hidup + cucu
        const anakHidup = anak.filter((item) => item.statusHidup === "HIDUP");
        const cucuList = ahliWaris.filter((item) => item.hubungan === "CUCU");
        if (kondisiId === "kondisi3") {
          return [...istri, ...anakHidup, ...cucuList].slice(0, 6);
        }
        return [...istri, ...anakHidup].slice(0, 6);
      case "kondisi4": // Dua istri + anak-anak
        const istriPertama = istri.find((item) => item.keterangan?.includes("PERTAMA") || item.urutan === 1);
        const istriKedua = istri.find((item) => item.keterangan?.includes("KEDUA") || item.urutan === 2);
        const semuaAhliWaris = [];
        if (istriPertama) semuaAhliWaris.push(istriPertama);
        if (istriKedua) semuaAhliWaris.push(istriKedua);
        semuaAhliWaris.push(...anak);
        return semuaAhliWaris.slice(0, 6);
      case "kondisi5": // Suami + anak
        return [...suami, ...anak].slice(0, 6);
      case "kondisi6": // Orang tua + saudara
        return [...orangTua, ...saudara].slice(0, 6);
      case "kondisi7": // Saudara saja
        return saudara.slice(0, 6);
      default:
        return [...istri, ...anak].slice(0, 6);
    }
  };

  const ahliWarisTandatangan = getAhliWarisTandatangan();

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
            Kami yang bertandatangan di bawah ini para ahli waris dari {getJudulPewaris()}{" "}
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
            sumpah, bahwa {getJudulPewaris()}{" "}
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
            sesuai dengan Akte Kematian dari {pewaris.instansiNikah || "__________" } Provinsi DKI Jakarta
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

          {/* Konten dinamis berdasarkan kondisi */}
          {renderDaftarAhliWaris()}
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
