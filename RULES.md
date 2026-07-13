# PANDUAN PENGEMBANGAN & ATURAN PROYEK (RULES.md)

Dokumen ini mendefinisikan aturan, standar pengkodean, arsitektur, dan panduan desain yang **wajib dipatuhi** oleh pengembang (manusia maupun asisten AI) yang bekerja di dalam repositori monorepo portofolio ini.

---

## 1. STRUKTUR REPOSITORI & WORKSPACE

Repositori ini dikelola sebagai **monorepo** menggunakan **pnpm workspaces**.

*   **`client/` (Frontend):** Aplikasi Next.js App Router (React 19, Next.js 16).
*   **`server/` (Backend):** Server Express.js dengan TypeScript kompilasi `tsup`.
*   **`packages/types/` (Shared):** Package TypeScript bersama yang berisi kontrak tipe data.
*   **Manajer Paket:** Wajib menggunakan `pnpm`. Jangan menggunakan `npm` atau `yarn` secara langsung di dalam sub-direktori untuk menghindari rusaknya file kunci dependensi (`pnpm-lock.yaml`).

---

## 2. ATURAN FRONTEND & DESAIN (UI/UX RULES)

Semua desain halaman publik dan panel admin harus mempertahankan estetika premium, konsistensi token, dan animasi mikro yang halus.

### A. Token Warna & Tema (Tailwind CSS v4)
Jangan pernah menggunakan warna *hardcoded* (seperti `bg-slate-900` atau `text-gray-300`) secara langsung tanpa mempertimbangkan mode terang/gelap. Selalu gunakan token tema CSS variabel yang didefinisikan di [globals.css](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/client/src/app/globals.css):
*   `bg-background`: Warna latar belakang utama halaman (Putih di mode terang, Biru gelap di mode gelap).
*   `text-foreground`: Warna teks utama.
*   `text-primary`: Warna aksen biru utama (`#0ea5e9`).
*   `bg-surface`: Warna permukaan kartu/kontainer sekunder.
*   `text-secondary`: Teks sekunder/muted.
*   `bg-accent`: Warna aksen ungu (`#a78bfa`).

### B. Konfigurasi Mode Gelap/Terang Terpadu
*   **Penting:** Tailwind CSS v4 secara default melacak deteksi media query sistem (`prefers-color-scheme`). Untuk menyelaraskannya dengan tombol toggle website (`next-themes`), Anda **wajib** mendaftarkan custom variant berikut di bagian atas berkas CSS utama:
    ```css
    @custom-variant dark (&:where(.dark, .dark *));
    ```
    Hal ini mencegah elemen visual website ter-override oleh preferensi tema gelap bawaan sistem operasi pengguna saat website berada di mode terang.

### C. Standardisasi Kelengkungan Kartu (Border Radius)
*   **Major Cards/Form Wrappers:** Semua kartu utama, wadah form, panel kontrol pencarian, dan skeleton pemuatan harus menggunakan kelengkungan **`rounded-[32px]`**.
*   **Buttons/Minor Elements:** Tombol aksi, badge kecil, input teks, dan gambar preview sekunder menggunakan **`rounded-2xl`** atau **`rounded-xl`**.

### D. Tipografi & Desain Tajuk (Typography & Headings)
*   **Font Keluarga:** Wajib menggunakan font **Geist Sans** (`font-sans`) untuk tulisan biasa dan **Geist Mono** (`font-mono`) untuk kode. Ini dipetakan di `@theme inline` globals.css.
*   **Sub-title Bagian (H2):**
    `className="text-primary font-extrabold tracking-widest mb-2.5 uppercase text-xs sm:text-sm"`
*   **Title Utama Bagian (H3):**
    `className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-6"`

### E. Utilitas Glassmorphism (`.glass`)
Gunakan class `.glass` untuk navbar melayang, dropdown, dan kartu login.
*   Akan menghasilkan efek `backdrop-blur(10px)` dengan bayangan lembut yang kontras agar teks di atas elemen melayang tetap terbaca di mode terang maupun gelap.

### F. Aturan Konsistensi Dropdown Input
*   **DILARANG** menggunakan tag `select` bawaan (native HTML select) pada formulir masukan data.
*   Gunakan **Kustom Dropdown Komponen** dengan tombol pemicu, indikator `ChevronDown` berotasi, bayangan `shadow-2xl`, sudut melengkung `rounded-2xl`, serta efek `backdrop-blur-md` untuk menu pilihannya agar selaras dengan desain premium monorepo ini. Nilai pilihan harus diintegrasikan dengan input `type="hidden"`.

---

## 3. ATURAN ANIMASI & TRANSISI (MOTION RULES)

Animasi harus terasa premium, intuitif, berkinerja tinggi, dan nyaman digunakan di semua perangkat.

### A. Animasi Masuk Scroll-Reveal (Entry Motion)
*   Hindari animasi pergeseran horizontal sumbu-X yang agresif (seperti `x: -50` atau `x: 50`) untuk elemen masukan gulir. Pergeseran horizontal rawan memicu bug layout overflow/bilah gulir horizontal di peramban mobile (iOS/Android).
*   **Utamakan animasi pergeseran vertikal sumbu-Y** (seperti `y: 30` atau `y: 35` dengan spring damping `15` atau `16`) untuk reveal visual karena jauh lebih aman dan terasa mengalir seragam saat discroll.
*   Gunakan viewport threshold yang aman untuk mobile: `viewport={{ once: true, amount: 0.15 }}` agar animasi terpicu andal pada layar berukuran kecil.

### B. Transisi Pergantian Galeri Gambar (Gallery Lightbox Motion)
*   Saat pengguna menelusuri atau mengganti gambar di galeri slider/lightbox, pergantian gambar tidak boleh terjadi secara kaku/instan.
*   Wajib membungkus elemen gambar dengan `<AnimatePresence mode="wait">` dan `<motion.div key={imageIndex}>` untuk menghasilkan transisi **fade-in & zoom** yang dinamis dan halus.

---

## 4. ATURAN BACKEND & CLEAN ARCHITECTURE (SERVER RULES)

Backend harus secara ketat mengikuti prinsip **Clean Architecture (Domain-Driven Design)** untuk memisahkan detail infrastruktur dari logika bisnis utama.

```
┌─────────────────────────────────────────────────────────────┐
│  Interfaces (Routes, Controllers, Middlewares, Validators)  │
│    └─► Application (Use Cases / Logika Bisnis Utama)        │
│          └─► Domain (Repository Interfaces / Abstraksi)     │
│                ▲                                            │
│                │ (Diimplementasikan oleh)                   │
│          Infrastructure (Supabase Client, Repositories Impl)│
└─────────────────────────────────────────────────────────────┘
```

### A. Aturan Layering
1.  **Domain Layer (`src/domain/`):** Hanya berisi tipe data dan interface repositori murni (misal: `IProjectRepository`). **DILARANG** mengimpor library luar (seperti Express, Supabase SDK, dll.) di layer ini.
2.  **Application Layer (`src/application/use-cases/`):** Berisi logika bisnis (Use Cases). Use case hanya diizinkan berinteraksi dengan repositori melalui interface domain abstrak yang disuntikkan lewat *Constructor*.
3.  **Infrastructure Layer (`src/infrastructure/`):** Tempat implementasi nyata pihak ketiga (Supabase, database client). Bertanggung jawab memetakan struktur PostgreSQL snake_case menjadi entitas TypeScript camelCase menggunakan mapper.
4.  **Interfaces Layer (`src/interfaces/`):** Menangani daur hidup HTTP request/response. Berisi Routes, Controllers, Middlewares, dan Zod Validators.

### B. Larangan Bypass Layer (NO BYPASS RULE)
*   **DILARANG KERAS** memanggil `supabase` client secara langsung di dalam berkas rute (`routes/`) atau controller untuk melakukan manipulasi data. Seluruh interaksi database wajib melalui repository infrastruktur dan dibungkus di dalam use case.

---

## 5. KEAMANAN & VALIDASI DATA (SECURITY & VALIDATION)

### A. Validasi Payload Sisi Server (Zod Middleware)
*   Setiap rute POST dan PUT yang menerima masukan data dari pengguna (seperti pembuatan proyek, sertifikat, keahlian, pesan kontak) wajib dipasangi middleware `validateRequest(schema)` di berkas rute.
*   Skema validasi Zod diletakkan di `src/interfaces/validators/`.

### B. Proteksi Endpoint Admin
*   Rute admin yang melakukan perubahan data wajib dilindungi menggunakan middleware `authMiddleware`.
*   `authMiddleware` memvalidasi Bearer Token JWT menggunakan SDK Supabase `supabase.auth.getUser(token)` untuk memastikan pengguna terautentikasi sebelum rute dijalankan.

---

## 6. PENJAMINAN MUTU & ALUR KERJA GIT (QA & GIT WORKFLOW)

### A. Pengecekan Kepatuhan Lokal (Pre-commit Checks)
Sebelum melakukan komit atau pengiriman perubahan, wajib menjalankan:
1.  **Kepatuhan Tipe TypeScript:**
    *   Client: `pnpm --filter client exec tsc --noEmit`
    *   Server: `pnpm --filter server exec tsc --noEmit`
2.  **Pengecekan Kualitas Kode (Linter):**
    *   Client: `pnpm --filter client run lint`
    *   Server: `pnpm --filter server run lint`
3.  **Pengecekan Bundel Produksi:**
    *   Client: `pnpm --filter client run build`
    *   Server: `pnpm --filter server run build`

### B. Aturan Komit Git
*   Jangan pernah menggunakan perintah sapu jagat `git add .` untuk menyimpan perubahan.
*   Pilihlah berkas secara manual dan kelompokkan komit berdasarkan konteks pengerjaannya menggunakan format pesan komit yang deskriptif (misal: `feat(client): ...`, `refactor(server): ...`, `style(client): ...`).
