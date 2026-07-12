# LAPORAN PENGENALAN & ARSITEKTUR KODE PROYEK WEB

## 1. RINGKASAN EKSEKUTIF PROYEK
- **Nama/Jenis Aplikasi (Berdasarkan temuan kode):** Full-Stack Developer Portfolio Website dengan CMS Admin Panel.
- **Pola Arsitektur yang Digunakan:**
  - **Monorepo (Multi-package):** Menggunakan `pnpm-workspace` untuk memisahkan frontend (`client`), backend (`server`), dan tipe data bersama (`packages/types`).
  - **Backend:** Clean Architecture (Domain-Driven Design / Onion-like Structure) terbagi menjadi layer: *Domain* (Repository Interfaces), *Application* (Use Cases), *Infrastructure* (Supabase Client/Repositories Implementation), dan *Interfaces* (Express Routes, Controllers, Middlewares, Validators).
  - **Frontend:** Next.js App Router (Component-driven architecture) dengan custom hook pattern untuk pemisahan logika state data.
- **Deskripsi Singkat Fungsi Aplikasi (Menurut analisis AI):** 
  Aplikasi ini merupakan situs web portofolio profesional interaktif dan dinamis yang mencakup halaman publik untuk menampilkan identitas (About), keterampilan (Skills), proyek (Projects), sertifikasi (Certificates), dan formulir kontak (Contact). Situs ini dilengkapi dengan area administrator (`/admin`) yang aman sebagai Content Management System (CMS) untuk mengelola data proyek, sertifikat, keahlian, dan membaca pesan masuk dari formulir kontak.

---

## 2. EKOSISTEM & TECH STACK
- **Framework Utama:**
  - **Frontend:** Next.js 16.2.4 (React 19)
  - **Backend:** Express.js 5.2.1
- **Database & ORM yang Digunakan:**
  - **Supabase (PostgreSQL):** Digunakan sebagai basis data utama. Supabase JS SDK (`@supabase/supabase-js`) bertindak sebagai klien untuk kueri data. Hubungan data dan struktur tabel dipetakan secara manual ke domain entities menggunakan mapper di repositori infrastruktur, tanpa ORM tradisional seperti Prisma/Sequelize.
- **Library Pihak Ketiga Kunci (Key Dependencies):**
  - **Shared (`packages/types`):** Menggunakan TypeScript interfaces untuk standarisasi tipe data di frontend dan backend.
  - **Frontend (`client`):**
    - `framer-motion`: Animasi mikro dan transisi visual.
    - `react-hook-form` & `zod`: Manajemen form dan validasi skema data.
    - `axios`: Client HTTP dengan interseptor otomatis untuk injeksi token JWT Supabase.
    - `next-themes`: Manajemen tema gelap/terang.
    - `lucide-react`: Kumpulan ikon grafis.
  - **Backend (`server`):**
    - `tsup`: Pembundel (bundler) TypeScript super cepat berbasis esbuild untuk kompilasi kode ke JavaScript produksi.
    - `helmet`: Mengamankan aplikasi Express dengan menyetel berbagai header HTTP.
    - `cors`: Konfigurasi berbagi sumber daya lintas asal (cross-origin sharing).
    - `multer`: Middleware penanganan unggahan file (multipart/form-data) ke memory buffer sebelum diunggah ke Supabase Storage.
    - `zod`: Validasi muatan (payload) HTTP request di tingkat middleware (Zod v4).

---

## 3. PEMETAAN MODUL & ALUR KERJA UTAMA

Berikut adalah pemetaan modul utama sistem berserta file dan controller kunci yang bertanggung jawab:

### A. Modul Portofolio & Proyek (Projects Module)
Mengelola visualisasi proyek yang telah dikerjakan oleh developer.
- **Backend Flow:**
  - Route: [projectRoutes.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/routes/projectRoutes.ts)
  - Controller: [ProjectController.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/controllers/ProjectController.ts)
  - Use Cases: `GetAllProjectsUseCase`, `GetProjectBySlugUseCase`, `CreateProjectUseCase`, `UpdateProjectUseCase`, `DeleteProjectUseCase` di dalam [server/src/application/use-cases/projects](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/application/use-cases/projects).
  - Repository (Database): [ProjectSupabaseRepository.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/infrastructure/database/supabase/ProjectSupabaseRepository.ts)
- **Frontend Flow:**
  - Route: `/` (Home, [ProjectsSection.tsx](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/components/sections/ProjectsSection.tsx)) & `/projects/[slug]` (Detail, [page.tsx](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/app/projects/%5Bslug%5D/page.tsx))
  - Admin Route: `/admin/projects` (CRUD)
  - Hook: [useProjects.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/hooks/useProjects.ts)

### B. Modul Sertifikasi & Prestasi (Certificates Module)
Menyajikan daftar sertifikasi profesional yang diperoleh.
- **Backend Flow:**
  - Route: [certificateRoutes.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/routes/certificateRoutes.ts)
  - Controller: `CertificateController`
  - Use Cases di bawah `use-cases/certificates`
  - Repository: [CertificateSupabaseRepository.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/infrastructure/database/supabase/CertificateSupabaseRepository.ts)
- **Frontend Flow:**
  - Route: `/` (Home, [CertificatesSection.tsx](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/components/sections/CertificatesSection.tsx))
  - Admin Route: `/admin/certificates` (CRUD)
  - Hook: [useCertificates.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/hooks/useCertificates.ts)

### C. Modul Keahlian & Kategori (Skills Module)
Menampilkan daftar keahlian teknis berdasarkan kategori (misalnya: Frontend, Backend, Tools) beserta persentase kecakapan.
- **Backend Flow:**
  - Route: [skillRoutes.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/routes/skillRoutes.ts)
  - Controller: `SkillController`
  - Repository: [SkillSupabaseRepository.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/infrastructure/database/supabase/SkillSupabaseRepository.ts)
- **Frontend Flow:**
  - Route: `/` (Home, [SkillsSection.tsx](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/components/sections/SkillsSection.tsx))
  - Admin Route: `/admin/skills` (CRUD)

### D. Modul Kontak & Pesan Masuk (Contact & Messages Module)
Mengizinkan pengunjung mengirimkan pesan langsung ke pemilik portofolio.
- **Backend Flow:**
  - Route: [contactRoutes.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/routes/contactRoutes.ts)
  - *Catatan:* Modul ini memotong jalur Clean Architecture dengan langsung mengakses instance `supabase` client secara inline untuk memproses pesan masuk (`contact_messages`), menyederhanakan kode yang minim logika bisnis rumit.
- **Frontend Flow:**
  - Route: `/` (Home, [ContactSection.tsx](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/components/sections/ContactSection.tsx))
  - Admin Route: `/admin/messages` (Daftar pesan masuk & hapus pesan)
  - Hook: [useMessages.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/hooks/useMessages.ts)

### E. Modul Keamanan, Autentikasi, & Unggah Media (Auth & Media Upload Module)
- **Autentikasi (Auth):**
  - Menggunakan Supabase Auth di frontend untuk mengelola sesi pengguna login dan logout ([useAuth.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/hooks/useAuth.ts)).
  - Di backend, middleware [authMiddleware.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/middlewares/authMiddleware.ts) memvalidasi token JWT (`Bearer Token`) yang dikirim dari klien dengan memanggil `supabase.auth.getUser(token)` sebelum mengizinkan rute administratif.
- **Unggah Media (Upload):**
  - Mengunggah media (gambar portofolio/sertifikat) ke bucket penyimpanan Supabase.
  - Route: [uploadRoutes.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/routes/uploadRoutes.ts). Dilindungi oleh `authMiddleware` dan menggunakan `multer` untuk menerima kiriman file multipart sebelum meneruskannya ke Supabase Storage.

---

## 4. CATATAN QA & KESIAPAN AI
- **Pernyataan Kesiapan AI:**
  AI (Antigravity) telah memindai, menganalisis, dan sepenuhnya memahami struktur proyek monorepo ini, termasuk pola Clean Architecture di backend, arsitektur Next.js App Router di frontend, alur autentikasi JWT terpusat dengan Supabase, serta pembagian tipe data bersama (`types` package).
- **Hasil Pemeliharaan Bebas Error (Error-Free Status):**
  Seluruh basis kode telah dibersihkan secara penuh:
  1. Kompilasi TypeScript backend (`server`) berhasil 100% tanpa error (`tsc --noEmit` bersih).
  2. Linter frontend (`client`) berhasil 100% tanpa ada error maupun warning (`eslint` bersih).
  3. Kompilasi TypeScript frontend (`client`) berhasil 100% tanpa error (`tsc --noEmit` bersih).
  4. Build produksi (`client` dan `server`) berhasil di-bundle secara optimal.
- **Temuan Keamanan & Catatan Pengembang:**
  1. **Bypass Layer pada Modul Kontak:** Berbeda dengan modul Proyek, Sertifikat, dan Skill, modul Kontak tidak menggunakan use-cases atau repository, melainkan langsung berinteraksi dengan Supabase client. Hal ini memotong arsitektur Clean Architecture yang telah mapan di bagian backend lainnya.
  2. **Supabase Service Role Key:** Backend menggunakan `SUPABASE_SERVICE_ROLE_KEY` yang melewati RLS (Row Level Security). Oleh karena itu, keamanan mutasi data bergantung penuh pada `authMiddleware` backend.
