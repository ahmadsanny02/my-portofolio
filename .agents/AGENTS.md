# WORKSPACE CUSTOMIZATIONS & AGENT RULES

Aturan khusus proyek portofolio ini wajib diikuti oleh seluruh agen AI (asisten koding) pada sesi-sesi mendatang.

## Aturan Utama Agen AI
1.  **Gunakan RULES.md:** Sebelum mengubah visual frontend atau rute backend, baca berkas [RULES.md](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/RULES.md) sebagai panduan utama.
2.  **Unifikasi UI/UX:** 
    *   Semua kartu kontainer utama wajib menggunakan class pembulatan `rounded-[32px]`.
    *   Font keluarga wajib menggunakan **Geist** (`font-sans`/`font-mono`).
    *   **Dropdown:** Dilarang menggunakan tag `<select>` bawaan browser. Gunakan custom dropdown button & menu popup dengan kelengkungan `rounded-2xl` dan `backdrop-blur-md` yang didukung oleh input hidden.
    *   **Dark Mode:** Menggunakan kustom variant `@custom-variant dark (&:where(.dark, .dark *))` pada berkas CSS utama agar tidak ter-override setelan OS.
3.  **Animasi & Transisi:**
    *   Gunakan animasi geser vertikal sumbu-Y (`y: 35`) untuk scroll reveal demi mencegah bug overflow horizontal pada mobile.
    *   Transisi pergantian galeri gambar (lightbox) wajib beranimasi fade-in menggunakan `<AnimatePresence mode="wait">` dan key index yang tepat.
4.  **Kepatuhan Clean Architecture:** Dilarang melewati (*bypass*) arsitektur backend. Semua operasi basis data Supabase harus melalui infrastruktur repositori abstrak dan dipanggil via use cases.
5.  **Validasi Masukan:** Rute POST/PUT baru di sisi server Express wajib divalidasi menggunakan skema Zod dan middleware `validateRequest`.
6.  **Verifikasi Tipe & Build:** Pastikan perintah `tsc --noEmit`, `eslint .`, dan `pnpm run build` sukses 100% di folder client maupun server sebelum menyatakan tugas selesai.
7.  **Jangan gunakan git add .**: Stage file satu per satu, buat komit terkelompok, dan dorong (push) perubahan ke repositori.
