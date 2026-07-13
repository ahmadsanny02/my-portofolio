# WORKSPACE CUSTOMIZATIONS & AGENT RULES

Aturan khusus proyek portofolio ini wajib diikuti oleh seluruh agen AI (asisten koding) pada sesi-sesi mendatang.

## Aturan Utama Agen AI
1.  **Gunakan RULES.md:** Sebelum mengubah visual frontend atau rute backend, baca berkas [RULES.md](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/RULES.md) sebagai panduan utama.
2.  **Unifikasi UI/UX:** Semua kartu kontainer utama wajib menggunakan class pembulatan `rounded-[32px]`. Font keluarga wajib menggunakan **Geist** (`font-sans`/`font-mono`).
3.  **Kepatuhan Clean Architecture:** Dilarang melewati (*bypass*) arsitektur backend. Semua operasi basis data Supabase harus melalui infrastruktur repositori abstrak dan dipanggil via use cases.
4.  **Validasi Masukan:** Rute POST/PUT baru di sisi server Express wajib divalidasi menggunakan skema Zod dan middleware `validateRequest`.
5.  **Verifikasi Tipe & Build:** Pastikan perintah `tsc --noEmit`, `eslint .`, dan `pnpm run build` sukses 100% di folder client maupun server sebelum menyatakan tugas selesai.
6.  **Jangan gunakan git add .**: Stage file satu per satu, buat komit terkelompok, dan dorong (push) perubahan ke repositori.
