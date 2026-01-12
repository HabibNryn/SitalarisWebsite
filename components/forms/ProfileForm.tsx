// components/forms/ProfileForm.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, QrCode, Save, AlertCircle } from "lucide-react";

// 1. DEFINE PROPER TYPES
interface AddressData {
  provinces: Province[];
}

interface Province {
  name: string;
  cities: City[];
}

interface City {
  name: string;
  districts: District[];
}

interface District {
  name: string;
  subdistricts: string[];
}

interface IKDResponse {
  token: string;
  payload?: Partial<Profile>;
}

interface SaveProfileResponse {
  success: boolean;
  message?: string;
}

interface Profile {
  nik: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  addressLine: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  motherName: string;
  fatherName: string;
  maritalStatus: string;
  occupation: string;
  citizenship: string;
}

type ProfileKey = keyof Profile;

// 2. MAIN COMPONENT
export default function ProfileForm() {
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [ikdStatus, setIkdStatus] = useState<"idle" | "pending" | "completed">("idle");
  const [address, setAddress] = useState<AddressData>({ provinces: [] });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 3. Required fields for progress calculation
  const requiredKeys: ProfileKey[] = [
    "nik", "fullName", "birthPlace", "birthDate", "gender", 
    "addressLine", "province", "city", "district", "subdistrict"
  ];

  // 4. Progress calculation
  useEffect(() => {
    const filled = requiredKeys.filter((key) => {
      const value = form[key];
      return value !== undefined && value !== null && value.toString().length > 0;
    }).length;
    
    setProgress(Math.round((filled / requiredKeys.length) * 100));
  }, [form]);

  // 5. Fetch address data
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // Mock address data - replace with actual API call
        const mockAddressData: AddressData = {
          provinces: [
            {
              name: "DKI Jakarta",
              cities: [
                {
                  name: "Jakarta Selatan",
                  districts: [
                    {
                      name: "Kebayoran Baru",
                      subdistricts: ["Gandaria", "Cipete", "Melawai", "Senayan"]
                    },
                    {
                      name: "Kebayoran Lama",
                      subdistricts: ["Grogol", "Cipulir", "Kebayoran", "Pondok Pinang"]
                    }
                  ]
                },
                {
                  name: "Jakarta Pusat",
                  districts: [
                    {
                      name: "Menteng",
                      subdistricts: ["Menteng", "Gondangdia", "Cikini", "Kebon Sirih"]
                    }
                  ]
                }
              ]
            },
            {
              name: "Jawa Barat",
              cities: [
                {
                  name: "Bandung",
                  districts: [
                    {
                      name: "Bandung Wetan",
                      subdistricts: ["Tamansari", "Cihapit", "Citarum"]
                    }
                  ]
                }
              ]
            }
          ]
        };
        
        setAddress(mockAddressData);
      } catch (error) {
        console.error("Failed to fetch address data:", error);
        setAddress({ provinces: [] });
      }
    };

    fetchAddress();
  }, []);

  // 6. Memoized address data
  const cities = useMemo((): City[] => {
    const province = address.provinces.find((p) => p.name === form.province);
    return province?.cities || [];
  }, [address, form.province]);

  const districts = useMemo((): District[] => {
    const city = cities.find((c) => c.name === form.city);
    return city?.districts || [];
  }, [cities, form.city]);

  const subdistricts = useMemo((): string[] => {
    const district = districts.find((d) => d.name === form.district);
    return district?.subdistricts || [];
  }, [districts, form.district]);

  // 7. Update form field
  function update<K extends ProfileKey>(key: K, value: Profile[K]) {
    setForm((prevForm) => ({ 
      ...prevForm, 
      [key]: value 
    }));
    // Clear success/error messages when user edits
    setSuccess(null);
    setError(null);
  }

  // 8. Reset address fields
  const resetAddressFields = () => {
    update("city", "");
    update("district", "");
    update("subdistrict", "");
  };

  // 9. IKD Authentication function
  async function startIKD() {
    setError(null);
    setSuccess(null);
    setIkdStatus("pending");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful IKD data
      const mockIKDData: Partial<Profile> = {
        nik: "3173041234567890",
        fullName: "Adi Negara",
        birthPlace: "Jakarta",
        birthDate: "1992-04-12",
        gender: "Male",
        addressLine: "Jl. Mawar No. 10",
        province: "DKI Jakarta",
        city: "Jakarta Selatan",
        district: "Kebayoran Baru",
        subdistrict: "Gandaria",
        phone: "081234567890",
        email: "adi@example.com",
        postalCode: "12140",
        motherName: "Siti Aminah",
        fatherName: "Budi Santoso",
        maritalStatus: "Married",
        occupation: "Software Engineer",
        citizenship: "Indonesia"
      };
      
      setForm((prevForm) => ({ ...prevForm, ...mockIKDData }));
      setIkdStatus("completed");
      setSuccess("Data berhasil diambil dari IKD!");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "IKD authentication failed";
      setError(errorMessage);
      setIkdStatus("idle");
    }
  }

  // 10. Save draft function
  async function saveDraft() {
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // Validate required fields
      const missingFields = requiredKeys.filter(key => {
        const value = form[key];
        return !value || value.toString().trim() === "";
      });

      if (missingFields.length > 0) {
        throw new Error(`Harap lengkapi: ${missingFields.join(", ")}`);
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success handling
      setSuccess("Data berhasil disimpan!");
      console.log("Form data saved:", form);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menyimpan data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // 11. Clear all form data
  const clearForm = () => {
    setForm({});
    setProgress(0);
    setIkdStatus("idle");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex items-center gap-3">
          {ikdStatus === "completed" ? (
            <span className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle2 className="w-5 h-5" /> Data dari IKD
            </span>
          ) : (
            <span className="text-gray-600 font-medium">IKD digital population authentication</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={startIKD}
            disabled={ikdStatus === "pending"}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-sm font-medium"
          >
            {ikdStatus === "pending" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            {ikdStatus === "pending" ? "Memproses..." : "Scan IKD"}
          </button>
          
          <button
            onClick={clearForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors shadow-sm text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Progress Pengisian</span>
          <span className="font-semibold text-blue-600">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {progress === 100 ? "Semua data telah lengkap!" : `Lengkapi ${10 - (progress/10)} data lagi`}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-700">{success}</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          Data Pribadi
        </h3>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Input 
            label="NIK" 
            value={form.nik || ""} 
            onChange={(v) => update("nik", v)}
            placeholder="Masukkan 16 digit NIK"
            required
          />
          
          <Input 
            label="Nama Lengkap" 
            value={form.fullName || ""} 
            onChange={(v) => update("fullName", v)}
            placeholder="Nama sesuai KTP"
            required
          />
          
          <Input 
            label="Tempat Lahir" 
            value={form.birthPlace || ""} 
            onChange={(v) => update("birthPlace", v)}
            placeholder="Kota/Kabupaten tempat lahir"
            required
          />
          
          <Input 
            type="date" 
            label="Tanggal Lahir" 
            value={form.birthDate || ""} 
            onChange={(v) => update("birthDate", v)}
            required
          />
          
          <Select
            label="Jenis Kelamin"
            value={form.gender || ""}
            onChange={(v) => update("gender", v)}
            options={["Laki-laki", "Perempuan"]}
            placeholder="Pilih jenis kelamin"
            required
          />
          
          <Input 
            label="No. Telepon/HP" 
            value={form.phone || ""} 
            onChange={(v) => update("phone", v)}
            placeholder="08xxxxxxxxxx"
          />
          
          <Input 
            type="email"
            label="Email" 
            value={form.email || ""} 
            onChange={(v) => update("email", v)}
            placeholder="email@contoh.com"
          />

          <div className="md:col-span-2">
            <Input 
              label="Alamat Lengkap" 
              value={form.addressLine || ""} 
              onChange={(v) => update("addressLine", v)}
              placeholder="Jl. Nama Jalan No. X, RT/RW"
              required
            />
          </div>

          {/* Address Information */}
          <div className="md:col-span-2">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Alamat Domisili</h4>
          </div>
          
          <Select
            label="Provinsi"
            value={form.province || ""}
            onChange={(v) => {
              update("province", v);
              resetAddressFields();
            }}
            options={address.provinces.map((p) => p.name)}
            placeholder="Pilih Provinsi"
            required
          />
          
          <Select
            label="Kota/Kabupaten"
            value={form.city || ""}
            onChange={(v) => {
              update("city", v);
              update("district", "");
              update("subdistrict", "");
            }}
            options={cities.map((c) => c.name)}
            disabled={!form.province}
            placeholder={form.province ? "Pilih Kota" : "Pilih Provinsi dulu"}
            required
          />
          
          <Select
            label="Kecamatan"
            value={form.district || ""}
            onChange={(v) => {
              update("district", v);
              update("subdistrict", "");
            }}
            options={districts.map((d) => d.name)}
            disabled={!form.city}
            placeholder={form.city ? "Pilih Kecamatan" : "Pilih Kota dulu"}
            required
          />
          
          <Select
            label="Kelurahan"
            value={form.subdistrict || ""}
            onChange={(v) => update("subdistrict", v)}
            options={subdistricts}
            disabled={!form.district}
            placeholder={form.district ? "Pilih Kelurahan" : "Pilih Kecamatan dulu"}
            required
          />
          
          <Input 
            label="Kode Pos" 
            value={form.postalCode || ""} 
            onChange={(v) => update("postalCode", v)}
            placeholder="5 digit kode pos"
          />
          
          {/* Family Information */}
          <div className="md:col-span-2">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Data Keluarga</h4>
          </div>
          
          <Input 
            label="Nama Ibu Kandung" 
            value={form.motherName || ""} 
            onChange={(v) => update("motherName", v)}
            placeholder="Nama lengkap ibu"
          />
          
          <Input 
            label="Nama Ayah Kandung" 
            value={form.fatherName || ""} 
            onChange={(v) => update("fatherName", v)}
            placeholder="Nama lengkap ayah"
          />
          
          <Select 
            label="Status Pernikahan" 
            value={form.maritalStatus || ""} 
            onChange={(v) => update("maritalStatus", v)} 
            options={["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"]}
            placeholder="Pilih status"
          />
          
          <Input 
            label="Pekerjaan" 
            value={form.occupation || ""} 
            onChange={(v) => update("occupation", v)}
            placeholder="Pekerjaan saat ini"
          />
          
          <Input 
            label="Kewarganegaraan" 
            value={form.citizenship || ""} 
            onChange={(v) => update("citizenship", v)}
            placeholder="Warga Negara Indonesia"
          />
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
        <button
          onClick={clearForm}
          className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Batal
        </button>
        
        <button
          onClick={saveDraft}
          disabled={loading || progress < 100}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {progress < 100 ? "Lengkapi Data Dulu" : "Simpan Data"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// 12. INPUT COMPONENT
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "date" | "tel" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

function Input({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  disabled = false,
  required = false 
}: InputProps) {
  return (
    <label className="space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
      />
    </label>
  );
}

// 13. SELECT COMPONENT
interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  disabled = false,
  required = false 
}: SelectProps) {
  return (
    <label className="space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
      >
        <option value="" className="text-gray-500">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-gray-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}