# Modern Fullstack Developer Portfolio & CMS Monorepo

A state-of-the-art, high-performance **Fullstack Developer Portfolio & Content Management System (CMS)** built as a **pnpm Monorepo**. This project features a modern public portfolio frontend alongside a comprehensive administrative dashboard for managing projects, skills, certifications, contact inquiries, global categories, and certificate issuers.

---

## 📑 Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Tech Stack & Prerequisites](#3-tech-stack--prerequisites)
- [4. Folder Structure & Architecture](#4-folder-structure--architecture)
- [5. Environment Variables & Setup](#5-environment-variables--setup)
- [6. Installation & Local Development](#6-installation--local-development)
- [7. Core Modules & API Routes](#7-core-modules--api-routes)
- [8. Quality Assurance & Scripts](#8-quality-assurance--scripts)

---

## 1. Project Overview

This repository is designed to showcase modern web engineering practices. It provides:
- A **Public Frontend** powered by Next.js 16 (React 19) featuring dynamic glassmorphism aesthetics, dark/light theme toggle, interactive photo lightboxes, vertical reveal animations (`y: 35`), and responsive layouts.
- An **Admin Dashboard** allowing authorized users to perform CRUD operations on portfolio items, manage certificate issuers and global category definitions, inspect contact messages, and securely upload media assets.
- A **Clean Architecture (Domain-Driven Design) Backend** powered by Express.js and Supabase (PostgreSQL, Auth, Storage) that strictly separates business logic from infrastructure and interfaces.

---

## 2. Key Features

- **Projects Showcase & Case Study**: Interactive gallery lightbox with keyboard navigation (`AnimatePresence` fade transitions), tech stack badges, live demo & source repository links.
- **Skills Expertise Matrix**: Dynamic skill categorization (Frontend, Backend, DevOps, Database, Tools) with proficiency indicators.
- **Certifications & Achievements**: List verified accomplishments, credentials, and issuer logos.
- **Contact Inquiries**: Interactive contact form with server-side validation and read/unread status tracking in the admin panel.
- **System Settings (Category & Issuer Management)**: Centralized management of categories (project, skill, certificate, general) and certification issuers with custom dynamic dropdowns (`rounded-2xl`, `backdrop-blur-md`).
- **Dark / Light Mode**: Unified theme switching via `next-themes` and `@custom-variant dark (&:where(.dark, .dark *))` CSS integration.
- **Security & Validation**: JWT Supabase authentication, Zod request payload validation, Multer memory buffer limit (5MB), MIME type checks, and Helmet HTTP header security.

---

## 3. Tech Stack & Prerequisites

### Core Monorepo Technologies
- **Package Manager**: [pnpm](https://pnpm.io/) (v10+ workspaces)
- **Shared Types**: `@packages/types` workspace package

### Client (`client/`)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Geist Sans & Geist Mono typography
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **UI Utilities**: `lucide-react`, `sweetalert2`, `next-themes`, `axios`

### Server (`server/`)
- **Runtime**: [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Build Tool**: [tsup](https://tsup.uno/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, GoTrue Auth, Storage)
- **Security & Utilities**: `helmet`, `cors`, `multer`, `dotenv`, `zod`

### Prerequisites
- Node.js `v20.x` or higher
- pnpm `v10.x` or higher
- Supabase project (URL and API/Service Role Keys)

---

## 4. Folder Structure & Architecture

The monorepo follows a clean high-level separation between frontend, backend, and shared packages:

```
my-portofolio/
├── client/          # Next.js 16 App Router Frontend & Admin Dashboard
├── server/          # Express.js REST API Server (Clean Architecture: Domain, Application, Infrastructure, Interfaces)
├── packages/
│   └── types/      # Shared TypeScript data types & interfaces
├── LAPORAN_AUDIT.md # Code Audit & Quality Assurance Report
├── RULES.md         # Monorepo Development & Style Guidelines
└── pnpm-workspace.yaml
```

---

## 5. Environment Variables & Setup

Create `.env` configuration files for both the client and server.

### Server Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
FRONTEND_URL=http://localhost:3000,http://localhost:3001
```

### Client Environment (`client/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 6. Installation & Local Development

### 1. Clone the repository and install dependencies:
```bash
git clone https://github.com/ahmadsanny02/my-portofolio.git
cd my-portofolio

# Install all workspace dependencies via pnpm
pnpm install
```

### 2. Run Database Migrations:
Execute the SQL files in `server/src/infrastructure/database/migrations/` (from `001_create_projects.sql` to `007_create_categories_and_issuers.sql`) within your Supabase SQL Editor to create table schemas, RLS policies, and seed data.

### 3. Start Development Servers:

To start the **backend server**:
```bash
pnpm --filter server dev
```
*(Runs on `http://localhost:5000`)*

To start the **frontend application**:
```bash
pnpm --filter client dev
```
*(Runs on `http://localhost:3000`)*

---

## 7. Core Modules & API Routes

All write operations (`POST`, `PUT`, `DELETE`) require a valid Bearer JWT token in the `Authorization` header (`Bearer <token>`).

| Module | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Projects** | `GET` | `/api/projects` | Public | Fetch all published projects |
| **Projects** | `GET` | `/api/projects/:id` | Public | Fetch project details by ID or slug |
| **Projects** | `POST` | `/api/projects` | Admin | Create a new project |
| **Projects** | `PUT` | `/api/projects/:id` | Admin | Update existing project details |
| **Projects** | `DELETE` | `/api/projects/:id` | Admin | Delete a project |
| **Certificates**| `GET` | `/api/certificates` | Public | Fetch all certificates |
| **Certificates**| `POST` | `/api/certificates` | Admin | Create a new certificate |
| **Certificates**| `PUT` | `/api/certificates/:id` | Admin | Update certificate information |
| **Certificates**| `DELETE` | `/api/certificates/:id` | Admin | Delete a certificate |
| **Skills** | `GET` | `/api/skills` | Public | Fetch all skills |
| **Skills** | `POST` | `/api/skills` | Admin | Create a skill entry |
| **Skills** | `PUT` | `/api/skills/:id` | Admin | Update skill details |
| **Skills** | `DELETE` | `/api/skills/:id` | Admin | Delete a skill |
| **Categories** | `GET` | `/api/categories?type=:type` | Public | Fetch global categories (filtered by type) |
| **Categories** | `POST` | `/api/categories` | Admin | Create a new category |
| **Categories** | `PUT` | `/api/categories/:id` | Admin | Update category details |
| **Categories** | `DELETE` | `/api/categories/:id` | Admin | Delete a category |
| **Issuers** | `GET` | `/api/issuers` | Public | Fetch all certification issuers |
| **Issuers** | `POST` | `/api/issuers` | Admin | Create a new issuer |
| **Issuers** | `PUT` | `/api/issuers/:id` | Admin | Update issuer details |
| **Issuers** | `DELETE` | `/api/issuers/:id` | Admin | Delete an issuer |
| **Contact** | `POST` | `/api/contact` | Public | Submit contact inquiry message |
| **Contact** | `GET` | `/api/contact` | Admin | Fetch all contact messages |
| **Upload** | `POST` | `/api/upload` | Admin | Upload image asset (Max 5MB, JPG/PNG/WebP/SVG) |

---

## 8. Quality Assurance & Scripts

Ensure code quality and type safety before committing changes:

### Type Checking
```bash
# Verify Client TypeScript types
pnpm --filter client exec tsc --noEmit

# Verify Server TypeScript types
pnpm --filter server exec tsc --noEmit
```

### Code Linting
```bash
# Run ESLint on client codebase
pnpm --filter client run lint

# Run ESLint on server codebase
pnpm --filter server run lint
```

### Production Bundling
```bash
# Build production bundle for server
pnpm --filter server run build

# Build production bundle for client
pnpm --filter client run build
```

---

## 📄 License

Distributed under the **ISC License**. Created by [Ahmad Sani Jabarulloh](https://github.com/ahmadsanny02).
