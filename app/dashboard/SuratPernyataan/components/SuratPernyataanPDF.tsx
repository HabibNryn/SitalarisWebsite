import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { FormValues, DataKeluargaType } from '../types';

// Register font jika perlu
Font.register({
  family: 'Arial',
  src: 'https://fonts.gstatic.com/s/arial/v12/arial.ttf',
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Arial',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecoration: 'underline',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#000',
    marginTop: 40,
    marginBottom: 5,
  },
});

interface SuratPernyataanPDFProps {
  data: FormValues;
}

export default function SuratPernyataanPDF({ data }: SuratPernyataanPDFProps) {
  // Filter ahli waris berdasarkan hubungan
  const ahliWaris = data.ahliWaris || [];
  const istri = ahliWaris.filter(item => item.hubungan === 'ISTRI');
  const anak = ahliWaris.filter(item => item.hubungan === 'ANAK');
  const suami = ahliWaris.filter(item => item.hubungan === 'SUAMI');
  const saudara = ahliWaris.filter(item => item.hubungan === 'SAUDARA');

  // Format tanggal
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format tempat tanggal lahir
  const formatTempatTglLahir = (tempat?: string, tanggal?: string) => {
    return `${tempat || ''}, ${formatDate(tanggal)}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Judul */}
        <Text style={styles.title}>SURAT PERNYATAAN AHLI WARIS</Text>

        {/* Pembukaan */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Kami yang bertandatangan di bawah ini para ahli waris dari Almarhum{' '}
            <Text style={styles.bold}>{data.pewaris.nama}</Text> BIN{' '}
            <Text style={styles.bold}>{data.pewaris.namaAyah}</Text>
          </Text>

          <Text style={styles.paragraph}>
            Dengan ini menyatakan dengan sesungguhnya dan sanggup diangkat sumpah, bahwa Almarhum{' '}
            <Text style={styles.bold}>{data.pewaris.nama}</Text> BIN{' '}
            <Text style={styles.bold}>{data.pewaris.namaAyah}</Text> Lahir di{' '}
            {data.pewaris.tempatLahir} tanggal {formatDate(data.pewaris.tanggalLahir)} bertempat tinggal terakhir di{' '}
            {data.pewaris.alamat}, RT {data.pewaris.rt || '__'}, RW {data.pewaris.rw || '__'}, 
            Kelurahan Grogol, Kecamatan Grogol Petamburan Kota Administrasi Jakarta Barat, 
            telah meninggal dunia di {data.pewaris.tempatMeninggal} pada tanggal{' '}
            {formatDate(data.pewaris.tanggalMeninggal)} sesuai dengan Akta Kematian dari 
            Dinas Dukcapil Provinsi DKI Jakarta Nomor{' '}
            <Text style={styles.bold}>{data.pewaris.noAkteKematian || '__________'}</Text> tanggal{' '}
            {formatDate(data.pewaris.tanggalAkteKematian)}.
          </Text>
        </View>

        {/* Informasi Pernikahan */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Semasa hidupnya Almarhum <Text style={styles.bold}>{data.pewaris.nama}</Text> BIN{' '}
            <Text style={styles.bold}>{data.pewaris.namaAyah}</Text> menikah hanya{' '}
            {istri.length} ({istri.length === 1 ? 'satu' : 'dua'}) kali dengan{istri.length === 2 ? ':' : ''}
          </Text>

          {istri.map((istriData, index) => (
            <Text key={index} style={styles.paragraph}>
              {istri.length === 2 && index === 1 ? 'dan ' : ''}
              Almarhumah <Text style={styles.bold}>{istriData.nama}</Text> BINTI{' '}
              <Text style={styles.bold}>{istriData.namaAyah}</Text>
              {data.pewaris.noSuratNikah ? ` Sesuai Surat Nikah Nomor ${data.pewaris.noSuratNikah} 
              tanggal ${formatDate(data.pewaris.tanggalNikah)} dari KUA/Dukcapil ${data.pewaris.kuaNikah || '__________'},` : ','}
              dari perkawinannya dikaruniai {anak.filter(a => a.keterangan?.includes(`Istri ${index + 1}`)).length} 
              orang anak yang kini masih hidup, yaitu :
            </Text>
          ))}
        </View>

        {/* Daftar Anak */}
        {anak.length > 0 && (
          <View style={styles.section}>
            {anak.map((anakData, index) => (
              <View key={index} style={{ marginBottom: 15 }}>
                <Text style={styles.paragraph}>
                  {index + 1}. Nama : <Text style={styles.bold}>{anakData.nama}</Text> (Anak)
                </Text>
                <Text style={styles.paragraph}>
                  Tempat Tgl. Lahir : {formatTempatTglLahir(anakData.tempatLahir, anakData.tanggalLahir)}
                </Text>
                <Text style={styles.paragraph}>
                  Pekerjaan : {anakData.pekerjaan}
                </Text>
                <Text style={styles.paragraph}>
                  Agama : {anakData.agama}
                </Text>
                <Text style={styles.paragraph}>
                  Alamat : {anakData.alamat}
                </Text>
                <Text style={styles.paragraph}>
                  No. KTP : {anakData.nik}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Penutup */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Demikian surat pernyataan ini kami buat dengan sebenar-benarnya dan dalam keadaan sehat jasmani dan rohani, 
            serta tidak ada tekanan atau paksaan dari siapapun/pihak manapun untuk dipergunakan sebagaimana mestinya, 
            dan apabila tidak benar atau dikemudian hari ada ahli waris lainnya selain dari kami dan mempunyai bukti-bukti 
            yang dianggap sah secara hukum atau belum tercantum dalam surat pernyataan ini, maka kami selaku ahli waris 
            yang menandatangani surat pernyataan ini, bertanggung jawab sepenuhnya sesuai hukum yang berlaku dengan tidak 
            melibatkan aparat kelurahan dan kecamatan, surat pernyataan ahli waris ini batal secara otomatis.
          </Text>
        </View>

        {/* Tanda Tangan */}
        <View style={styles.section}>
          <Text style={{ textAlign: 'right', marginBottom: 30 }}>
            Jakarta, {formatDate(new Date().toISOString())}
          </Text>

          <Text style={styles.paragraph}>Kami para Ahli Waris</Text>

          {/* Tanda tangan ahli waris */}
          {ahliWaris
            .filter(item => ['ISTRI', 'SUAMI', 'ANAK', 'SAUDARA'].includes(item.hubungan))
            .map((ahliWarisData, index) => (
              <View key={index} style={{ marginTop: 20 }}>
                <Text style={styles.paragraph}>
                  {index + 1}. <Text style={styles.bold}>{ahliWarisData.nama}</Text>{' '}
                  ({ahliWarisData.hubungan})
                </Text>
                <View style={styles.signatureLine} />
              </View>
            ))}

          {/* Saksi-saksi */}
          <View style={{ marginTop: 40 }}>
            <Text style={styles.paragraph}>Saksi-saksi:</Text>
            {[1, 2].map((_, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                <Text style={styles.paragraph}>
                  {index + 1}. Nama : ________________ ( _________ )
                </Text>
                <Text style={styles.paragraph}>
                  NIK : ________________
                </Text>
                <Text style={styles.paragraph}>
                  Tempat/Tgl. Lahir : ________________
                </Text>
                <Text style={styles.paragraph}>
                  Alamat : ________________
                </Text>
                <Text style={styles.paragraph}>
                  Pekerjaan : ________________
                </Text>
              </View>
            ))}
          </View>

          {/* Mengetahui */}
          <View style={[styles.signatureSection, { marginTop: 40 }]}>
            <View style={styles.signatureBox}>
              <Text style={styles.paragraph}>Ketua RW ......</Text>
              <Text style={styles.paragraph}>Kelurahan Grogol</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.paragraph}>( ________________ )</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.paragraph}>Ketua RT ......</Text>
              <Text style={styles.paragraph}>Kelurahan Grogol</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.paragraph}>( ________________ )</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}