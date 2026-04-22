# 📋 Issue: Fullstack Web Portfolio — Perencanaan & Rancangan

> **Status:** Draft  
> **Dibuat:** 2026-04-23  
> **Tech Stack:** Next.js · Tailwind CSS v4 · Supabase · Express.js · TypeScript  
> **Arsitektur:** Clean Architecture · SOLID Principles

---

## 🎯 Ringkasan Proyek

Membangun sebuah **web portfolio fullstack** yang modern, performant, dan mudah di-maintain. Portfolio ini akan memiliki halaman publik yang menampilkan karya/proyek, sertifikat, skill, dan informasi kontak. Dilengkapi dengan **Admin CMS Dashboard** untuk mengelola konten secara dinamis tanpa perlu mengubah kode.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│              Next.js (App Router) + Tailwind            │
│                  TypeScript + Framer Motion             │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST API
┌──────────────────────▼──────────────────────────────────┐
│                    BACKEND API                          │
│              Express.js + TypeScript                    │
│        (Clean Architecture: Route → Controller          │
│               → Use Case → Repository)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    DATABASE                             │
│          Supabase (PostgreSQL + Storage + Auth)         │
└─────────────────────────────────────────────────────────┘
```

### Struktur Folder

```
my-portfolio/
├── client/           # Next.js Frontend
├── server/           # Express.js Backend
├── packages/
│   ├── types/        # Shared TypeScript interfaces/types
│   └── utils/        # Shared utility functions
├── package.json      # Root workspace config (pnpm workspaces)
└── turbo.json        # Turborepo config (opsional)
```

---

## 📁 Struktur Direktori Detail

### `client/` — Next.js Frontend

```
client/
├── src/
│   ├── app/                        # App Router (Next.js 14+)
│   │   ├── (public)/               # Route group: halaman publik
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # Daftar proyek
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Detail proyek
│   │   │   └── layout.tsx
│   │   ├── (admin)/                # Route group: CMS Admin
│   │   │   ├── layout.tsx          # Admin layout (sidebar, auth guard)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # CRUD daftar proyek
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── certificates/
│   │   │   │   └── page.tsx
│   │   │   └── skills/
│   │   │       └── page.tsx
│   │   ├── api/                    # Next.js API routes (opsional, untuk revalidation)
│   │   │   └── revalidate/
│   │   │       └── route.ts
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # Reusable UI atoms (Button, Card, Badge, Modal)
│   │   ├── sections/               # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── CertificatesSection.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminSidebar.tsx
│   │   └── admin/                  # Admin-specific components
│   │       ├── ProjectForm.tsx
│   │       ├── CertificateForm.tsx
│   │       └── SkillForm.tsx
│   ├── hooks/                      # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useCertificates.ts
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api-client.ts           # Axios/fetch wrapper untuk call ke Express API
│   │   ├── supabase.ts             # Supabase client (auth only di frontend)
│   │   └── utils.ts
│   ├── types/                      # Re-export dari packages/types
│   └── constants/
│       └── index.ts
├── public/
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### `server/` — Express.js Backend

```
server/
├── src/
│   ├── domain/                     # Enterprise Business Rules (Entities)
│   │   ├── entities/
│   │   │   ├── Project.ts
│   │   │   ├── Certificate.ts
│   │   │   ├── Skill.ts
│   │   │   └── Contact.ts
│   │   └── repositories/           # Repository Interfaces (Contracts)
│   │       ├── IProjectRepository.ts
│   │       ├── ICertificateRepository.ts
│   │       └── ISkillRepository.ts
│   │
│   ├── application/                # Application Business Rules (Use Cases)
│   │   ├── use-cases/
│   │   │   ├── projects/
│   │   │   │   ├── GetAllProjectsUseCase.ts
│   │   │   │   ├── GetProjectBySlugUseCase.ts
│   │   │   │   ├── CreateProjectUseCase.ts
│   │   │   │   ├── UpdateProjectUseCase.ts
│   │   │   │   └── DeleteProjectUseCase.ts
│   │   │   ├── certificates/
│   │   │   │   ├── GetAllCertificatesUseCase.ts
│   │   │   │   ├── CreateCertificateUseCase.ts
│   │   │   │   └── DeleteCertificateUseCase.ts
│   │   │   ├── skills/
│   │   │   │   ├── GetAllSkillsUseCase.ts
│   │   │   │   ├── CreateSkillUseCase.ts
│   │   │   │   └── DeleteSkillUseCase.ts
│   │   │   └── contact/
│   │   │       └── SendContactMessageUseCase.ts
│   │   └── dtos/                   # Data Transfer Objects
│   │       ├── ProjectDTO.ts
│   │       ├── CertificateDTO.ts
│   │       └── SkillDTO.ts
│   │
│   ├── infrastructure/             # Frameworks & Drivers
│   │   ├── database/
│   │   │   ├── supabase/
│   │   │   │   ├── SupabaseClient.ts
│   │   │   │   ├── ProjectSupabaseRepository.ts
│   │   │   │   ├── CertificateSupabaseRepository.ts
│   │   │   │   └── SkillSupabaseRepository.ts
│   │   │   └── migrations/         # SQL migration files
│   │   │       ├── 001_create_projects.sql
│   │   │       ├── 002_create_certificates.sql
│   │   │       └── 003_create_skills.sql
│   │   └── external/
│   │       └── EmailService.ts     # Nodemailer / Resend untuk contact form
│   │
│   ├── interfaces/                 # Interface Adapters (Controllers, Routes)
│   │   ├── controllers/
│   │   │   ├── ProjectController.ts
│   │   │   ├── CertificateController.ts
│   │   │   ├── SkillController.ts
│   │   │   └── ContactController.ts
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts   # Verifikasi Supabase JWT
│   │   │   ├── errorHandler.ts     # Global error handler
│   │   │   ├── validateRequest.ts  # Zod validation middleware
│   │   │   └── rateLimiter.ts      # Rate limiting untuk contact form
│   │   ├── routes/
│   │   │   ├── projectRoutes.ts
│   │   │   ├── certificateRoutes.ts
│   │   │   ├── skillRoutes.ts
│   │   │   └── contactRoutes.ts
│   │   └── validators/             # Zod schemas
│   │       ├── projectValidator.ts
│   │       └── contactValidator.ts
│   │
│   ├── shared/                     # Shared utilities
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   └── UnauthorizedError.ts
│   │   └── types/
│   │       └── ApiResponse.ts
│   │
│   ├── config/
│   │   ├── env.ts                  # Validasi env vars dengan Zod
│   │   └── cors.ts
│   │
│   └── main.ts                     # Entry point
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

### Tabel `projects`
```sql
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  thumbnail   TEXT,                  -- URL dari Supabase Storage
  tech_stack  TEXT[] DEFAULT '{}',   -- Array of technology names
  demo_url    TEXT,
  repo_url    TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel `certificates`
```sql
CREATE TABLE certificates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200) NOT NULL,
  issuer      VARCHAR(200) NOT NULL,
  issued_at   DATE NOT NULL,
  expired_at  DATE,
  image_url   TEXT,                  -- URL dari Supabase Storage
  credential_url TEXT,
  category    VARCHAR(100),          -- e.g., 'Frontend', 'Cloud', 'Security'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel `skills`
```sql
CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  category    VARCHAR(100) NOT NULL, -- e.g., 'Frontend', 'Backend', 'DevOps'
  icon_url    TEXT,
  proficiency INT CHECK (proficiency BETWEEN 1 AND 100),
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel `contact_messages`
```sql
CREATE TABLE contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(200) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  subject    VARCHAR(300),
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- projects: publik bisa read, hanya admin yang bisa write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can do all"
  ON projects FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🔌 API Endpoints (Express.js)

### Public Routes (tidak perlu autentikasi)

| Method | Endpoint                  | Deskripsi                        |
|--------|---------------------------|----------------------------------|
| GET    | `/api/projects`           | Ambil semua project yang published |
| GET    | `/api/projects/:slug`     | Ambil detail project by slug     |
| GET    | `/api/certificates`       | Ambil semua sertifikat           |
| GET    | `/api/skills`             | Ambil semua skill                |
| POST   | `/api/contact`            | Kirim pesan kontak               |

### Admin Routes (butuh JWT dari Supabase Auth)

| Method | Endpoint                       | Deskripsi                 |
|--------|--------------------------------|---------------------------|
| GET    | `/api/admin/projects`          | Ambil semua project (termasuk unpublished) |
| POST   | `/api/admin/projects`          | Buat project baru         |
| PUT    | `/api/admin/projects/:id`      | Update project            |
| DELETE | `/api/admin/projects/:id`      | Hapus project             |
| POST   | `/api/admin/projects/:id/image`| Upload thumbnail          |
| GET    | `/api/admin/certificates`      | Ambil semua sertifikat    |
| POST   | `/api/admin/certificates`      | Buat sertifikat baru      |
| PUT    | `/api/admin/certificates/:id`  | Update sertifikat         |
| DELETE | `/api/admin/certificates/:id`  | Hapus sertifikat          |
| GET    | `/api/admin/skills`            | Ambil semua skill         |
| POST   | `/api/admin/skills`            | Tambah skill              |
| PUT    | `/api/admin/skills/:id`        | Update skill              |
| DELETE | `/api/admin/skills/:id`        | Hapus skill               |
| GET    | `/api/admin/messages`          | Ambil semua pesan masuk   |
| PATCH  | `/api/admin/messages/:id/read` | Tandai pesan sudah dibaca |

---

## 🎨 Desain & UI/UX

### Color Palette
```css
/* Primary */
--color-primary: #0ea5e9;      /* Sky Blue */
--color-primary-dark: #0284c7;
--color-primary-light: #38bdf8;

/* Background (Dark Mode) */
--color-bg-base: #0f172a;      /* Slate 900 */
--color-bg-surface: #1e293b;   /* Slate 800 */
--color-bg-elevated: #334155;  /* Slate 700 */

/* Text */
--color-text-primary: #f1f5f9;
--color-text-secondary: #94a3b8;
--color-text-muted: #64748b;

/* Accent */
--color-accent: #a78bfa;       /* Violet */
```

### Sections pada Homepage
1. **Hero** — Nama, Tagline, Typing animation, CTA button (Lihat Proyek / Unduh CV)
2. **About** — Foto profil, deskripsi singkat, statistik (proyek, pengalaman)
3. **Skills** — Grid ikon teknologi dengan kategori (Frontend, Backend, DevOps)
4. **Projects** — Grid card proyek unggulan dengan filter kategori
5. **Certificates** — Galeri sertifikat dengan modal preview
6. **Contact** — Form kontak + social links

### Animasi
- **Framer Motion** untuk scroll animations (fade-in, slide-up)
- **Typing animation** di Hero section
- **Hover effects** pada project cards (tilt, glow)
- **Smooth scroll** antar section

---

## 🔐 Autentikasi & Otorisasi

### Flow Auth
```
Admin buka /admin/login
  → Input email & password
  → Supabase Auth memverifikasi
  → Return JWT (access_token)
  → Simpan di httpOnly cookie
  → Frontend attach token di header Authorization: Bearer <token>
  → Express middleware verifikasi token ke Supabase
  → Jika valid → lanjut ke controller
  → Jika tidak valid → return 401 Unauthorized
```

### Implementasi di Express (authMiddleware.ts)
```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }
  req.user = data.user; // extend Request type
  next();
};
```

---

## 🧩 SOLID Principles — Implementasi Nyata

### 1. Single Responsibility Principle (SRP)
- Setiap `UseCase` hanya menangani satu operasi bisnis
- `Controller` hanya bertugas menerima request & mengembalikan response
- `Repository` hanya bertugas akses data

### 2. Open/Closed Principle (OCP)
- `IProjectRepository` adalah interface. Implementasinya (`ProjectSupabaseRepository`) bisa diganti tanpa mengubah `UseCase`
- Mudah menambah provider database baru (misal: Prisma) tanpa breaking changes

### 3. Liskov Substitution Principle (LSP)
- Semua repository implementation memenuhi kontrak interface-nya
- `ProjectSupabaseRepository` bisa di-substitute dengan `ProjectPrismaRepository`

### 4. Interface Segregation Principle (ISP)
- `IProjectRepository` tidak dipaksa implement method yang tidak dibutuhkan
- Interface dibagi per konteks (read-only interface untuk public, full CRUD untuk admin)

### 5. Dependency Inversion Principle (DIP)
- `UseCase` bergantung pada abstraksi (`IProjectRepository`), bukan implementasi konkrit
- Dependency injection dilakukan di layer `main.ts` / composition root

### Contoh Implementasi (DIP):
```typescript
// domain/repositories/IProjectRepository.ts
export interface IProjectRepository {
  findAll(onlyPublished?: boolean): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  create(data: CreateProjectDTO): Promise<Project>;
  update(id: string, data: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<void>;
}

// application/use-cases/projects/GetAllProjectsUseCase.ts
export class GetAllProjectsUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(onlyPublished = true): Promise<Project[]> {
    return this.projectRepo.findAll(onlyPublished);
  }
}

// main.ts — Composition Root
const projectRepo = new ProjectSupabaseRepository(supabaseClient);
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepo);
const projectController = new ProjectController(getAllProjectsUseCase, ...);
```

---

## 📦 Dependencies

### Frontend (`client/`)
```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@supabase/supabase-js": "^2.x",
    "framer-motion": "^11.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "react-hot-toast": "^2.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@types/react": "^19.x",
    "@types/node": "^20.x"
  }
}
```

### Backend (`server/`)
```json
{
  "dependencies": {
    "express": "^4.x",
    "@supabase/supabase-js": "^2.x",
    "zod": "^3.x",
    "cors": "^2.x",
    "helmet": "^7.x",
    "express-rate-limit": "^7.x",
    "multer": "^1.x",
    "nodemailer": "^6.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/express": "^4.x",
    "@types/cors": "^2.x",
    "@types/nodemailer": "^6.x",
    "tsx": "^4.x",
    "tsup": "^8.x"
  }
}
```

---

## 🌍 Environment Variables

### `server/.env`
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Nodemailer / Resend)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=your@gmail.com
```

### `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## ✅ Tahapan Implementasi (Sprint Plan)

### Sprint 1 — Setup & Foundation (Estimasi: 2-3 hari)
- [ ] Setup monorepo dengan pnpm workspaces
- [ ] Setup `packages/types` — shared TypeScript interfaces
- [ ] Init Next.js di `apps/web` dengan Tailwind CSS v4
- [ ] Init Express.js di `apps/api` dengan TypeScript (tsup)
- [ ] Setup Supabase project, buat semua tabel, aktifkan RLS
- [ ] Setup environment variables di kedua app
- [ ] Setup ESLint + Prettier di semua workspace
- [ ] Init Git repository & `.gitignore`

### Sprint 2 — Backend API (Estimasi: 3-4 hari)
- [ ] Buat semua Domain Entities (`Project`, `Certificate`, `Skill`)
- [ ] Buat semua Repository Interfaces
- [ ] Implementasi Supabase Repositories
- [ ] Buat semua Use Cases (CRUD per entity)
- [ ] Buat Controllers & Routes
- [ ] Setup middleware: CORS, Helmet, Rate Limiter, Error Handler
- [ ] Implementasi `authMiddleware` (verifikasi Supabase JWT)
- [ ] Buat Zod validators untuk semua request body
- [ ] Test semua endpoint dengan Postman/Thunder Client
- [ ] Setup upload file ke Supabase Storage

### Sprint 3 — Frontend Public Pages (Estimasi: 3-4 hari)
- [ ] Buat design system: warna, tipografi, komponen UI atom
- [ ] Buat `api-client.ts` (wrapper untuk call ke Express API)
- [ ] Buat custom hooks: `useProjects`, `useCertificates`, `useSkills`
- [ ] Implementasi `Navbar` & `Footer`
- [ ] Implementasi `HeroSection` dengan typing animation
- [ ] Implementasi `AboutSection`
- [ ] Implementasi `SkillsSection` (grid + kategori)
- [ ] Implementasi `ProjectsSection` (card + filter)
- [ ] Implementasi `CertificatesSection` (galeri + modal)
- [ ] Implementasi `ContactSection` (form dengan validasi)
- [ ] Tambah Framer Motion scroll animations di semua section
- [ ] Halaman detail proyek `/projects/[slug]`

### Sprint 4 — Admin CMS Dashboard (Estimasi: 3-4 hari)
- [ ] Implementasi halaman login (`/admin/login`)
- [ ] Buat `AdminSidebar` & Admin Layout
- [ ] Auth guard middleware untuk route `/admin/*`
- [ ] Halaman Dashboard (statistik: total proyek, sertifikat, pesan)
- [ ] CRUD Projects: form tambah/edit, tabel daftar, hapus
- [ ] Upload thumbnail gambar proyek ke Supabase Storage
- [ ] CRUD Certificates: form tambah/edit, tabel daftar
- [ ] CRUD Skills: form tambah/edit, drag-to-reorder
- [ ] Halaman Messages: tampilkan pesan masuk, tandai dibaca

### Sprint 5 — Polish & Deployment (Estimasi: 2-3 hari)
- [ ] SEO: metadata, og:image, robots.txt, sitemap.xml
- [ ] Performance: lazy loading image, Next.js Image component
- [ ] Responsive design: pastikan semua tampilan mobile-friendly
- [ ] Dark mode (default dark, toggle opsional)
- [ ] Error pages: 404, 500
- [ ] Loading states & skeleton screens
- [ ] Deploy `apps/api` ke Railway / Render
- [ ] Deploy `apps/web` ke Vercel
- [ ] Setup domain custom (opsional)
- [ ] Final QA & bug fixing

---

## 🔒 Security Checklist

- [ ] Semua admin endpoint dilindungi `authMiddleware`
- [ ] Input validation dengan Zod di backend
- [ ] Helmet.js aktif (security headers)
- [ ] CORS hanya izinkan domain frontend
- [ ] Rate limiting di `/api/contact` (mencegah spam)
- [ ] Supabase Service Role Key **tidak pernah** di-expose ke frontend
- [ ] Environment variables **tidak pernah** di-commit ke Git (`.gitignore`)
- [ ] RLS aktif di semua tabel Supabase
- [ ] Sanitasi file upload (mime type check)

---

## 📏 Coding Standards

### TypeScript
- Gunakan `strict: true` di `tsconfig.json`
- Tidak boleh menggunakan `any` — gunakan `unknown` jika terpaksa
- Semua function harus memiliki return type yang eksplisit
- Gunakan `interface` untuk object shapes, `type` untuk unions/aliases

### Penamaan
- **Komponen React:** PascalCase → `ProjectCard.tsx`
- **Functions/hooks:** camelCase → `useProjects`, `getProjectBySlug`
- **Constants:** UPPER_SNAKE_CASE → `API_BASE_URL`
- **Files (non-component):** kebab-case → `api-client.ts`
- **Classes:** PascalCase → `ProjectSupabaseRepository`

### Git Commit Convention (Conventional Commits)
```
feat: tambah halaman detail proyek
fix: perbaiki bug auth middleware token expired
refactor: pisahkan project use cases menjadi file terpisah
style: perbaiki responsive layout pada mobile
docs: update README dengan instruksi setup
chore: update dependency framer-motion ke v11
```

---

## 🚀 Panduan Setup Awal (Quick Start)

```bash
# 1. Clone & masuk ke project
git clone <repo-url>
cd my-portfolio

# 2. Install semua dependencies
pnpm install

# 3. Setup environment variables
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
# → Edit kedua file .env dengan nilai yang sesuai

# 4. Jalankan SQL migrations di Supabase
# → Buka Supabase Dashboard → SQL Editor
# → Jalankan file dari server/src/infrastructure/database/migrations/

# 5. Jalankan development server
pnpm dev
# → Frontend: http://localhost:3000
# → Backend:  http://localhost:5000
```

---

## 📝 Catatan Penting untuk Developer

1. **Jangan langsung akses Supabase dari frontend** untuk operasi write — selalu lewat Express API. Frontend hanya menggunakan Supabase untuk Auth (login/logout).
2. **Selalu validasi input** di backend menggunakan Zod, jangan percaya data dari frontend.
3. **Gunakan DTOs** untuk transformasi data antara layer — jangan expose raw database entity ke response.
4. **Tambah loading state** di setiap komponen yang fetch data — gunakan skeleton screen bukan spinner sederhana.
5. **Setiap use case** harus memiliki unit test minimal (gunakan Vitest atau Jest).
6. **Slug proyek** harus di-generate otomatis dari title (lowercase, replace spasi dengan `-`).

---

*Dokumen ini merupakan panduan hidup — update setiap kali ada perubahan signifikan pada arsitektur atau keputusan teknis.*
