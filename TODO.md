# TODO

- [ ] Update backend upload API: app/api/uploadFile/route.ts
  - [ ] Simpan file ke public/uploads
  - [ ] Create Prisma UploadFile record
  - [ ] Return uploadFileId + url/filePath
- [ ] Ubah komponen upload KTP agar langsung upload dan set value form ke uploadFileId
  - [ ] app/dashboard/user/SuratPernyataan/components/FileUpload.tsx
- [ ] Tambahkan field upload KTP untuk tiap ahli waris
  - [ ] components/forms/shared/AhliWarisFields.tsx (atau komponen form ahli waris yang relevan)
- [ ] Sesuaikan Zod schema submit agar menerima ktpFileId pada dataPewaris dan ahliWaris
  - [ ] app/api/surat-pernyataan/submit/route.ts
- [ ] Pastikan admin dashboard menampilkan KTP per objek dari UploadFile
  - [ ] app/dashboard/admin/submissions/[id]/page.tsx dan/atau components terkait
- [ ] Jalankan lint/build/test sederhana

---

## Fix Vercel Build: Module not found '@/components/ui/form'

**Root Cause:** Git me-track `components/ui/Form.tsx` (huruf F kapital), sedangkan import memakai `@/components/ui/form` (huruf kecil). Vercel memakai filesystem Linux case-sensitive sehingga tidak menemukan file.

- [x] 1. `git rm --cached components/ui/Form.tsx`
- [x] 2. `git add components/ui/form.tsx`
- [x] 3. Verifikasi index git mencatat `components/ui/form.tsx`
- [ ] 4. Commit dengan pesan jelas
- [ ] 5. Push ke `origin/main` untuk memicu deploy ulang Vercel
- [ ] 6. Konfirmasi build Vercel sukses
