"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import DownloadPDFButton from "@/app/components/DownloadPDFButton";
import { FormDataPernyataan } from "@/types/pernyataanWaris";

// Schema Validasi
const dataKeluargaSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  namaAyah: z.string().min(1, "Nama ayah harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  pekerjaan: z.string().min(1, "Pekerjaan harus diisi"),
  agama: z.string().min(1, "Agama harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK harus angka"),
  jenisKelamin: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
  statusPernikahan: z.enum([
    "MENIKAH",
    "BELUM_MENIKAH",
    "CERAI_HIDUP",
    "CERAI_MATI",
  ]),
  hubungan: z.enum(["SUAMI", "ISTRI", "ANAK", "CUCU", "SAUDARA", "ORANG_TUA"]),
  masihHidup: z.boolean().default(true),
  memilikiKeturunan: z.boolean().default(false),
  keterangan: z.string().optional(),
});

const dataPewarisSchema = z.object({
  nama: z.string().min(1, "Nama pewaris harus diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir pewaris harus diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir pewaris harus diisi"),
  tempatMeninggal: z.string().min(1, "Tempat meninggal pewaris harus diisi"),
  tanggalMeninggal: z.string().min(1, "Tanggal meninggal pewaris harus diisi"),
  nomorAkteKematian: z.string().min(1, "Nomor akte kematian harus diisi"),
  alamat: z.string().min(1, "Alamat pewaris harus diisi"),
  statusPernikahan: z.enum([
    "MENIKAH",
    "BELUM_MENIKAH",
    "CERAI_HIDUP",
    "CERAI_MATI",
  ]),
  jenisKelamin: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
});

const formSchema = z.object({
  kondisi: z.string().min(1, "Pilih kondisi ahli waris"),
  dataPewaris: dataPewarisSchema,
  ahliWaris: z.array(dataKeluargaSchema),
  tambahanKeterangan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Daftar kondisi ahli waris
const kondisiAhliWaris = [
  {
    id: "kondisi1",
    label: "Pewaris memiliki 1 istri dan semua anak masih hidup",
    description: "Semua anak dari pernikahan pertama masih hidup",
  },
  {
    id: "kondisi2",
    label: "Pewaris memiliki 1 istri dan ada anak yang meninggal",
    description: "Salah satu anak dari pernikahan pertama telah meninggal",
  },
  {
    id: "kondisi3",
    label:
      "Pewaris memiliki 1 istri, ada anak yang meninggal dan memiliki cucu",
    description: "Anak yang meninggal memiliki keturunan (cucu)",
  },
  {
    id: "kondisi4",
    label: "Pewaris menikah 2 kali",
    description: "Pewaris memiliki istri dari pernikahan pertama dan kedua",
  },
  {
    id: "kondisi5",
    label: "Suami pewaris masih hidup",
    description: "Pewaris perempuan dan suaminya masih hidup",
  },
  {
    id: "kondisi6",
    label: "Pewaris tidak memiliki keturunan",
    description: "Pewaris tidak memiliki anak",
  },
  {
    id: "kondisi7",
    label:
      "Pewaris tidak memiliki keturunan dan hanya memiliki saudara kandung",
    description: "Ahli waris adalah saudara kandung pewaris",
  },
];

// Default values yang komprehensif
const defaultAhliWaris = {
  nama: "",
  namaAyah: "",
  tempatLahir: "",
  tanggalLahir: "",
  pekerjaan: "",
  agama: "",
  alamat: "",
  nik: "",
  jenisKelamin: "LAKI-LAKI" as const,
  statusPernikahan: "BELUM_MENIKAH" as const,
  hubungan: "ANAK" as const,
  masihHidup: true,
  memilikiKeturunan: false,
  keterangan: "",
};

const defaultDataPewaris = {
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  tempatMeninggal: "",
  tanggalMeninggal: "",
  nomorAkteKematian: "",
  alamat: "",
  statusPernikahan: "MENIKAH" as const,
  jenisKelamin: "LAKI-LAKI" as const,
};

export default function FormPernyataanWarisan() {
  const router = useRouter();
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [jumlahCucu, setJumlahCucu] = useState(0);
  const [jumlahSaudara, setJumlahSaudara] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedKondisi, setSelectedKondisi] = useState("");
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kondisi: "",
      dataPewaris: defaultDataPewaris,
      ahliWaris: [],
      tambahanKeterangan: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ahliWaris",
  });

  // Fungsi untuk menambah form anak
  const tambahAnak = () => {
    append({
      ...defaultAhliWaris,
      hubungan: "ANAK" as const,
      keterangan: "Anak Pewaris",
    });
    setJumlahAnak((prev) => prev + 1);
  };

  // Fungsi untuk menambah form cucu
  const tambahCucu = () => {
    append({
      ...defaultAhliWaris,
      hubungan: "CUCU" as const,
      keterangan: "Cucu Pewaris",
    });
    setJumlahCucu((prev) => prev + 1);
  };

  // Fungsi untuk menambah form saudara
  const tambahSaudara = () => {
    append({
      ...defaultAhliWaris,
      hubungan: "SAUDARA" as const,
      keterangan: "Saudara Kandung Pewaris",
    });
    setJumlahSaudara((prev) => prev + 1);
  };

  // Fungsi untuk menambah form istri
  const tambahIstri = () => {
    append({
      ...defaultAhliWaris,
      hubungan: "ISTRI" as const,
      jenisKelamin: "PEREMPUAN" as const,
      statusPernikahan: "MENIKAH" as const,
      keterangan: "Istri Pewaris",
    });
  };

  // Fungsi untuk menambah form suami
  const tambahSuami = () => {
    append({
      ...defaultAhliWaris,
      hubungan: "SUAMI" as const,
      jenisKelamin: "LAKI-LAKI" as const,
      statusPernikahan: "MENIKAH" as const,
      keterangan: "Suami Pewaris",
    });
  };

  // Logika berdasarkan kondisi yang dipilih - DIPERBAIKI
  useEffect(() => {
    const kondisi = form.watch("kondisi");
    setSelectedKondisi(kondisi);

    if (!kondisi) {
      setJumlahAnak(0);
      setJumlahCucu(0);
      setJumlahSaudara(0);
      return;
    }

    // Reset semua fields
    const resetFields = () => {
      remove();
      setJumlahAnak(0);
      setJumlahCucu(0);
      setJumlahSaudara(0);
    };

    resetFields();

    if (kondisi === "kondisi1" || kondisi === "kondisi2") {
      // Kondisi 1 & 2: 1 istri + 1 anak
      setJumlahAnak(1);

      // Tambah 1 anak
      append({
        ...defaultAhliWaris,
        hubungan: "ANAK" as const,
        keterangan: "Anak Pewaris",
      });

      // Tambah istri
      append({
        ...defaultAhliWaris,
        hubungan: "ISTRI" as const,
        jenisKelamin: "PEREMPUAN" as const,
        statusPernikahan: "MENIKAH" as const,
        keterangan: "Istri Pewaris",
      });
    } else if (kondisi === "kondisi3") {
      // Kondisi 3: 1 istri + 2 anak (1 meninggal) + 1 cucu
      setJumlahAnak(2);
      setJumlahCucu(1);

      // Tambah 2 anak
      for (let i = 0; i < 2; i++) {
        append({
          ...defaultAhliWaris,
          hubungan: "ANAK" as const,
          keterangan: `Anak Pewaris ${i + 1}`,
        });
      }

      // Tambah 1 cucu
      append({
        ...defaultAhliWaris,
        hubungan: "CUCU" as const,
        keterangan: "Cucu Pewaris",
      });

      // Tambah istri
      append({
        ...defaultAhliWaris,
        hubungan: "ISTRI" as const,
        jenisKelamin: "PEREMPUAN" as const,
        statusPernikahan: "MENIKAH" as const,
        keterangan: "Istri Pewaris",
      });
    } else if (kondisi === "kondisi4") {
      // Kondisi 4: 2 istri + minimal 2 anak
      setJumlahAnak(2);

      // Tambah 2 anak
      append({
        ...defaultAhliWaris,
        hubungan: "ANAK" as const,
        keterangan: "Anak dari Istri Pertama",
      });
      append({
        ...defaultAhliWaris,
        hubungan: "ANAK" as const,
        keterangan: "Anak dari Istri Kedua",
      });

      // Tambah 2 istri
      append({
        ...defaultAhliWaris,
        hubungan: "ISTRI" as const,
        jenisKelamin: "PEREMPUAN" as const,
        statusPernikahan: "MENIKAH" as const,
        keterangan: "Istri Pertama",
      });
      append({
        ...defaultAhliWaris,
        hubungan: "ISTRI" as const,
        jenisKelamin: "PEREMPUAN" as const,
        statusPernikahan: "MENIKAH" as const,
        keterangan: "Istri Kedua",
      });
    } else if (kondisi === "kondisi5") {
      // Kondisi 5: Suami hidup
      setJumlahAnak(0);

      // Tambah suami
      append({
        ...defaultAhliWaris,
        hubungan: "SUAMI" as const,
        statusPernikahan: "MENIKAH" as const,
        keterangan: "Suami Pewaris",
      });
    } else if (kondisi === "kondisi6") {
      // Kondisi 6: Tidak ada keturunan
      setJumlahAnak(0);
      // Tidak ada ahli waris yang ditambahkan
    } else if (kondisi === "kondisi7") {
      // Kondisi 7: Saudara kandung
      setJumlahSaudara(1);

      // Tambah 1 saudara
      append({
        ...defaultAhliWaris,
        hubungan: "SAUDARA" as const,
        keterangan: "Saudara Kandung Pewaris",
      });
    }
  }, [selectedKondisi]);

  // Render form berdasarkan kondisi
  const renderAhliWarisForms = () => {
    const kondisi = form.watch("kondisi");

    if (!kondisi) return null;

    switch (kondisi) {
      case "kondisi5": // Suami masih hidup
        return (
          <div className="space-y-6">
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                Data Suami Pewaris
              </h4>
              <p className="text-sm text-blue-600">
                Suami pewaris masih hidup dan menjadi ahli waris
              </p>
            </div>
            {fields.map((field, index) => (
              <div key={field.id}>{renderFormKeluarga(index, "SUAMI")}</div>
            ))}
          </div>
        );

      case "kondisi7": // Saudara kandung
        return (
          <div className="space-y-6">
            <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-2">
                Data Saudara Kandung
              </h4>
              <p className="text-sm text-purple-600">
                Pewaris tidak memiliki keturunan, ahli waris adalah saudara
                kandung
              </p>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800">
                    Saudara {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        remove(index);
                        setJumlahSaudara((prev) => prev - 1);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Hapus Saudara
                    </Button>
                  )}
                </div>
                {renderFormKeluarga(index, "SAUDARA")}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={tambahSaudara}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Tambah Saudara Kandung
            </Button>
          </div>
        );

      case "kondisi6": // Tidak ada keturunan
        return (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
            <h4 className="font-medium text-yellow-800 mb-2">
              Tidak Ada Ahli Waris
            </h4>
            <p className="text-sm text-yellow-600">
              Pewaris tidak memiliki keturunan. Silakan lanjutkan pengisian data
              pewaris.
            </p>
          </div>
        );

      default: // Kondisi dengan anak dan istri
        return (
          <div className="space-y-6">
            {/* Data Anak */}
            {jumlahAnak > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Data Anak Pewaris
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Jumlah Anak: {jumlahAnak}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={tambahAnak}
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Tambah Anak
                    </Button>
                  </div>
                </div>

                {fields
                  .filter((_, idx) => idx < jumlahAnak)
                  .map((field, index) => (
                    <div key={field.id} className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">
                          Anak {index + 1}
                        </h4>
                        {jumlahAnak > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              remove(index);
                              setJumlahAnak((prev) => prev - 1);
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Hapus Anak
                          </Button>
                        )}
                      </div>

                      {renderFormKeluarga(index, "ANAK")}
                    </div>
                  ))}
              </div>
            )}

            {/* Data Istri */}
            {(kondisi === "kondisi1" ||
              kondisi === "kondisi2" ||
              kondisi === "kondisi3" ||
              kondisi === "kondisi4") && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {kondisi === "kondisi4"
                    ? "Data Istri Pewaris (Pernikahan 1 & 2)"
                    : "Data Istri Pewaris"}
                </h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600 mb-3">
                    {kondisi === "kondisi4"
                      ? "Pewaris menikah 2 kali, silakan isi data kedua istri"
                      : "Data istri pewaris"}
                  </p>

                  {kondisi === "kondisi4" ? (
                    // Untuk kondisi 4: 2 istri
                    <>
                      {fields
                        .filter((_, idx) => idx >= jumlahAnak + jumlahCucu)
                        .map((field, index) => (
                          <div key={field.id} className="mb-6">
                            <h4 className="font-medium text-gray-800 mb-4">
                              {index === 0 ? "Istri Pertama" : "Istri Kedua"}
                            </h4>
                            {renderFormKeluarga(
                              jumlahAnak + jumlahCucu + index,
                              "ISTRI"
                            )}
                          </div>
                        ))}
                    </>
                  ) : (
                    // Untuk kondisi 1,2,3: 1 istri
                    <>
                      {fields
                        .filter((_, idx) => idx >= jumlahAnak + jumlahCucu)
                        .map((field, index) => (
                          <div key={field.id}>
                            {renderFormKeluarga(
                              jumlahAnak + jumlahCucu + index,
                              "ISTRI"
                            )}
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Data Cucu */}
            {jumlahCucu > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Data Cucu Pewaris
                </h3>
                {fields
                  .filter(
                    (_, idx) =>
                      idx >= jumlahAnak && idx < jumlahAnak + jumlahCucu
                  )
                  .map((field, index) => (
                    <div key={field.id} className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">
                          Cucu {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const actualIndex = jumlahAnak + index;
                            remove(actualIndex);
                            setJumlahCucu((prev) => prev - 1);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Hapus Cucu
                        </Button>
                      </div>
                      {renderFormKeluarga(jumlahAnak + index, "CUCU")}
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
    }
  };

  // Fungsi untuk render form data keluarga
  const renderFormKeluarga = (index: number, hubunganDefault: string) => {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.nama`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama lengkap"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nama Ayah */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.namaAyah`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nama Ayah
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama ayah kandung"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NIK */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.nik`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  NIK
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="16 digit NIK"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tempat Lahir */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.tempatLahir`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Tempat Lahir
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Kota tempat lahir"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tanggal Lahir */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.tanggalLahir`}
            render={({ field }) => {
              const dateValue = field.value
                ? new Date(field.value).toISOString().split("T")[0]
                : "";

              return (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Tanggal Lahir
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={dateValue}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Pekerjaan */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.pekerjaan`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Pekerjaan
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pekerjaan saat ini"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Agama */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.agama`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Agama
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Agama"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jenis Kelamin */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.jenisKelamin`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Jenis Kelamin
                </FormLabel>
                <FormControl>
                  <select
                    value={field.value || "LAKI-LAKI"}
                    onChange={field.onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LAKI-LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Pernikahan */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.statusPernikahan`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Status Pernikahan
                </FormLabel>
                <FormControl>
                  <select
                    value={field.value || "BELUM_MENIKAH"}
                    onChange={field.onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BELUM_MENIKAH">Belum Menikah</option>
                    <option value="MENIKAH">Menikah</option>
                    <option value="CERAI_HIDUP">Cerai Hidup</option>
                    <option value="CERAI_MATI">Cerai Mati</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hubungan dengan Pewaris */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.hubungan`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Hubungan dengan Pewaris
                </FormLabel>
                <FormControl>
                  <select
                    value={field.value || hubunganDefault}
                    onChange={field.onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUAMI">Suami</option>
                    <option value="ISTRI">Istri</option>
                    <option value="ANAK">Anak</option>
                    <option value="CUCU">Cucu</option>
                    <option value="SAUDARA">Saudara Kandung</option>
                    <option value="ORANG_TUA">Orang Tua</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alamat */}
          <FormField
            control={form.control}
            name={`ahliWaris.${index}.alamat`}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Alamat Lengkap
                </FormLabel>
                <FormControl>
                  <textarea
                    value={field.value || ""}
                    onChange={field.onChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alamat lengkap saat ini"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Data pernyataan warisan:", data);

    try {
      const isValid = await form.trigger();

      if (!isValid) {
        alert("Harap isi semua field yang diperlukan!");
        return;
      }
      setFormData(data);
      alert("Data berhasil disimpan! Anda dapat mendownload PDF sekarang.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Form Pernyataan Ahli Waris
          </h1>
          <p className="text-gray-600">Isi data sesuai kondisi pewaris</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Pilih Kondisi */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Step 1: Pilih Kondisi Pewaris
            </h2>
            <FormField
              control={form.control}
              name="kondisi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Kondisi Ahli Waris
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Kondisi --</option>
                      {kondisiAhliWaris.map((kondisi) => (
                        <option key={kondisi.id} value={kondisi.id}>
                          {kondisi.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {field.value && (
                    <p className="text-sm text-gray-500 mt-2">
                      {
                        kondisiAhliWaris.find((k) => k.id === field.value)
                          ?.description
                      }
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Step 2: Data Pewaris */}
          {form.watch("kondisi") && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Step 2: Data Pewaris
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(defaultDataPewaris).map((key) => {
                  if (key === "jenisKelamin" || key === "statusPernikahan") {
                    return null;
                  }

                  const isDateField = key.includes("tanggal");

                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`dataPewaris.${key}`}
                      render={({ field }) => {
                        if (isDateField) {
                          const dateValue = field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : "";

                          return (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  value={dateValue}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }

                        return (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Masukkan ${key
                                  .replace(/([A-Z])/g, " $1")
                                  .toLowerCase()}`}
                                value={field.value || ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}

                {/* Jenis Kelamin Pewaris */}
                <FormField
                  control={form.control}
                  name="dataPewaris.jenisKelamin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Jenis Kelamin Pewaris
                      </FormLabel>
                      <FormControl>
                        <select
                          value={field.value || "LAKI-LAKI"}
                          onChange={field.onChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="LAKI-LAKI">Laki-laki</option>
                          <option value="PEREMPUAN">Perempuan</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status Pernikahan Pewaris */}
                <FormField
                  control={form.control}
                  name="dataPewaris.statusPernikahan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Status Pernikahan Pewaris
                      </FormLabel>
                      <FormControl>
                        <select
                          value={field.value || "MENIKAH"}
                          onChange={field.onChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="MENIKAH">Menikah</option>
                          <option value="BELUM_MENIKAH">Belum Menikah</option>
                          <option value="CERAI_HIDUP">Cerai Hidup</option>
                          <option value="CERAI_MATI">Cerai Mati</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 3: Data Ahli Waris */}
          {form.watch("kondisi") && form.watch("kondisi") !== "kondisi6" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Step 3: Data Ahli Waris
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {showAdvanced ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Sembunyikan Pengaturan
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Pengaturan Lanjutan
                    </>
                  )}
                </button>
              </div>

              {renderAhliWarisForms()}

              {showAdvanced && (
                <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Pengaturan Lanjutan
                  </h4>
                  <FormField
                    control={form.control}
                    name="tambahanKeterangan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Keterangan Tambahan
                        </FormLabel>
                        <FormControl>
                          <textarea
                            value={field.value || ""}
                            onChange={field.onChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tambahkan keterangan jika diperlukan..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          {form.watch("kondisi") && (
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </Button>

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Menyimpan..."
                  : "Simpan & Generate PDF"}
              </Button>

              {/* PDF Button hanya muncul setelah submit */}
              {formData && (
                <DownloadPDFButton
                  data={formData}
                  fileName={`Surat-Pernyataan-Ahli-Waris-${formData.dataPewaris.nama}.pdf`}
                />
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
