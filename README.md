# Ahmad Sani Jabarulloh - Full-Stack Developer Portfolio & CMS

This repository contains a modern, highly interactive, and responsive developer portfolio website combined with a custom Content Management System (CMS) Admin Panel. The project is designed with modularity, performance, and security in mind.

---

## 🏗️ Project Architecture

The project is structured as a **Monorepo** managed using `pnpm` workspaces. It is divided into three main packages to ensure clear separation of concerns, high reusability, and clean code:

```
├── client/              # Next.js 16 Frontend & Admin Portal
├── server/              # Express.js 5 Backend (Clean Architecture / DDD)
└── packages/
    └── types/           # Shared TypeScript interfaces
```

### 1. Frontend (`client`)
Built with **Next.js 16 (React 19)** using the App Router. It contains two main sections:
- **Public Portfolio:** A showcase of projects, skills, certificates, and a contact form with rich micro-animations using `framer-motion`.
- **CMS Admin Portal (`/admin`):** A secure dashboard for CRUD operations on projects, certificates, skills, and viewing contact inbox messages. It uses a custom hook pattern to separate UI layout from state logic.

### 2. Backend (`server`)
An **Express.js** API server that follows **Clean Architecture / Domain-Driven Design (DDD)** concepts, ensuring the core business logic remains independent of databases or third-party web frameworks:
- **Domain Layer:** Defines core entity shapes and repository contracts (interfaces).
- **Application Layer:** Contains specific use-cases (e.g., `CreateProjectUseCase`, `GetAllProjectsUseCase`).
- **Infrastructure Layer:** Implements database connections (Supabase JS SDK) and repository implementations.
- **Interfaces Layer:** Holds routes, controllers, custom middlewares (error handlers, auth verifiers), and validation schemas (Zod).

### 3. Shared Types (`packages/types`)
Contains shared TypeScript models used by both the frontend and backend, preventing type duplication and keeping data contracts strict.

---

## 💻 Tech Stack & Key Libraries

### Frontend (`client/`)
- **Framework:** Next.js 16.2.4 (React 19.2.4)
- **Styling:** CSS Variables + TailwindCSS (v4)
- **Animations:** Framer Motion (v12)
- **Forms & Validation:** React Hook Form + Zod
- **API Client:** Axios (configured with automated interceptors for JWT token propagation)
- **Alerts & Modals:** SweetAlert2 + React Hot Toast
- **Icons:** Lucide React

### Backend (`server/`)
- **Framework:** Express.js 5.2.1
- **Database & Storage:** Supabase (PostgreSQL) via `@supabase/supabase-js`
- **Compiler/Bundler:** `tsup` (esbuild-based TypeScript bundler)
- **Validation:** Zod 4
- **Security:** Helmet (secure HTTP headers) + CORS (cross-origin validation)
- **File Upload:** Multer (memory-buffered multipart processor)

---

## 🗝️ Environment Setup

Before starting, create configuration files in both `client/` and `server/` directories.

### Backend (`server/.env`)
Create a `.env` file inside the `server` directory:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000,http://localhost:3001
```
> [!IMPORTANT]
> The backend uses the `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security (RLS) policies. Security checks are handled in the application layer via [authMiddleware.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/middlewares/authMiddleware.ts).

### Frontend (`client/.env`)
Create a `.env` file inside the `client` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🛠️ Database Setup & Migrations

Database tables and storage buckets are hosted on Supabase. SQL migration scripts are located in [server/src/infrastructure/database/migrations](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/infrastructure/database/migrations).

Run the scripts in your Supabase SQL Editor in the following order:
1. `001_create_projects.sql` — Creates the projects table.
2. `002_create_certificates.sql` — Creates the certificates table.
3. `003_create_skills.sql` — Creates the skills table.
4. `004_create_contact_messages.sql` — Creates the contact messages table.

Additionally, create a public storage bucket in Supabase called **`portfolio`** (or change the default name in your upload configurations) to handle file uploads.

---

## 🚀 Running the Project Locally

### 1. Installation
Install all dependencies for the entire workspace from the root directory:
```bash
pnpm install
```

### 2. Run Development Servers
Start both client and server development servers simultaneously:
```bash
# Run server only (from workspace root)
pnpm --filter server dev

# Run client only (from workspace root)
pnpm --filter client dev
```

### 3. Check Code Quality (Linting & Types)
Run Type Checking and ESLint audits to ensure code is clean:
```bash
# Compile and check TypeScript types
pnpm --filter server exec tsc --noEmit
pnpm --filter client exec tsc --noEmit

# Lint check
pnpm --filter client lint
pnpm --filter server lint
```

### 4. Build for Production
Create production bundles for both projects:
```bash
# Build server API
pnpm --filter server build

# Build client App
pnpm --filter client build
```

---

## 🔒 Security & Middleware Configuration

1. **JWT Verification:** All administrative routes (POST, PUT, DELETE) on projects, skills, certificates, and contact messages are protected by [authMiddleware.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/middlewares/authMiddleware.ts). This middleware decodes the authorization header bearer token using Supabase Auth:
   ```typescript
   const { data, error } = await supabase.auth.getUser(token);
   ```
2. **CORS:** Configuration restricts client communication to designated URLs specified in the `FRONTEND_URL` environment variable, localhost ports, or Vercel deployments.
3. **Helmet:** Secures Express endpoints by automatically injecting HTTP headers.
4. **Validation Layer:** Express requests are validated at the middleware level using Zod schemas (e.g. [projectValidator.ts](file:///home/ahmadsanny02/Workspace/02_coding/web/fullstack/projects/my-portofolio/server/src/interfaces/validators/projectValidator.ts)) before hitting controllers.
