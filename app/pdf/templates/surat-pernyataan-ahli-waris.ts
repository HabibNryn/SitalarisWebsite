import { FormDataPernyataan } from '@/types/pernyataan-warisan';

export function renderSuratPernyataanHTML(data: FormDataPernyataan) {
  const { dataPewaris, ahliWaris } = data;

  const anak = ahliWaris.filter(a => a.hubungan === 'ANAK' && a.masihHidup);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: "Times New Roman";
      font-size: 12pt;
      line-height: 1.6;
      margin: 40px;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .underline { text-decoration: underline; }
    .mt { margin-top: 20px; }
    .indent { text-indent: 40px; }
  </style>
</head>
<body>

  <p class="center bold underline">SURAT PERNYATAAN AHLI WARIS</p>

  <p class="indent">
    Kami yang bertanda tangan di bawah ini para ahli waris dari
    <b>${dataPewaris.jenisKelamin === 'LAKI-LAKI' ? 'Almarhum' : 'Almarhumah'}</b>
    <b>${dataPewaris.nama}</b>, lahir di ${dataPewaris.tempatLahir} tanggal
    ${dataPewaris.tanggalLahir}, bertempat tinggal terakhir di
    ${dataPewaris.alamat}, telah meninggal dunia di
    ${dataPewaris.tempatMeninggal} pada tanggal
    ${dataPewaris.tanggalMeninggal}.
  </p>

  <p class="indent">
    Dari perkawinannya dikaruniai ${anak.length} orang anak yang masih hidup,
    yaitu:
  </p>

  ${anak.map((a, i) => `
    <p class="indent">
      ${i + 1}. ${a.nama}, lahir di ${a.tempatLahir} tanggal ${a.tanggalLahir},
      pekerjaan ${a.pekerjaan}, agama ${a.agama},
      bertempat tinggal di ${a.alamat}, NIK ${a.nik}.
    </p>
  `).join('')}

  <p class="indent">
    Demikian surat pernyataan ini kami buat dengan sebenar-benarnya tanpa
    paksaan dari pihak manapun.
  </p>

  <br><br>

  <p class="center">
    Jakarta, ____________ <br>
    Para Ahli Waris
  </p>

  <br><br>

  ${ahliWaris.map((a, i) => `
    <p>${i + 1}. ${a.nama}</p>
    ${i === 0 ? '<p>Materai 10.000</p>' : ''}
    <br>
  `).join('')}

</body>
</html>
`;
}
