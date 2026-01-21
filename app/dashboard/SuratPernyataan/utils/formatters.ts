// app/dashboard/SuratPernyataan/utils/formatters.ts

// Format date untuk input HTML5 date
export function formatDateForInput(dateString?: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

// Format date Indonesia
export function formatDateIndonesian(dateString?: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return `${day} ${bulan[month]} ${year}`;
  } catch {
    return dateString;
  }
}

// Format untuk BIN/BINTI
export function formatNamaLengkap(
  nama: string, 
  namaAyah: string, 
  jenisKelamin: string
): string {
  const namaText = nama || "";
  const namaAyahText = namaAyah || "";
  
  if (jenisKelamin === "PEREMPUAN") {
    return `${namaText} BINTI ${namaAyahText}`;
  } else {
    return `${namaText} BIN ${namaAyahText}`;
  }
}