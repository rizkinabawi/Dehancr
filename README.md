# Alex Rivera — Portfolio

A Behance-inspired personal portfolio website with a dark cinematic aesthetic, built with React + Vite on the frontend and Express + PostgreSQL on the backend. Includes a full CMS dashboard for managing projects, profile, and inquiries.

---

## Features

### Public Portfolio
- **Home** — Hero section with featured projects grid and animated transitions
- **Work** — Filterable project gallery by category with hover effects
- **Project Detail** — Full project page with image gallery, tools, client info, and related projects
- **About** — Bio, skills, experience timeline, education, and contact form
- **Contact Form** — Inquiry submission saved to database + email notification via SMTP

### CMS Dashboard (`/admin`)
- **Overview** — Stats (total projects, views, likes, featured count, categories) and category breakdown chart
- **Projects** — Full CRUD: create, edit, delete projects with image URLs, tags, tools, category, featured toggle
- **Profile** — Edit name, title, bio, location, avatar, skills, and all social links
- **Inquiries** — Inbox for contact form messages with status management (unread → read → replied), reply via email, delete

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| UI Components | shadcn/ui (Radix UI primitives) |
| Fonts | Syne (display), Inter (body) |
| State / Data | TanStack Query (React Query) |
| Backend | Express 5, Node.js 24, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Validation | Zod v4, drizzle-zod |
| Email | Nodemailer (SMTP) |
| API Codegen | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
├── artifacts/
│   ├── api-server/          # Express REST API (port 8080)
│   │   └── src/routes/
│   │       ├── projects.ts  # CRUD + stats
│   │       ├── profile.ts   # Profile + experience + education
│   │       ├── categories.ts
│   │       ├── contact.ts   # Inquiry form + SMTP email
│   │       └── health.ts
│   └── portfolio/           # React + Vite frontend
│       └── src/
│           ├── pages/
│           │   ├── home.tsx
│           │   ├── projects.tsx
│           │   ├── project-detail.tsx
│           │   ├── about.tsx        # Includes inquiry form
│           │   └── admin.tsx        # Full CMS dashboard
│           └── components/
├── lib/
│   ├── db/                  # Drizzle schema + DB connection
│   │   └── src/schema/
│   │       ├── projects.ts
│   │       ├── profile.ts   # profile, experience, education tables
│   │       └── inquiries.ts
│   ├── api-spec/            # OpenAPI 3.1 spec + Orval config
│   ├── api-client-react/    # Generated React Query hooks
│   └── api-zod/             # Generated Zod schemas
└── scripts/                 # Utility scripts (seed, etc.)
```

---

## Environment Variables & Secrets

Set these in the Replit Secrets panel:

| Key | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-provided by Replit) |
| `SESSION_SECRET` | Session signing secret |
| `SMTP_HOST` | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (`587` for TLS, `465` for SSL) |
| `SMTP_USER` | Sender email address |
| `SMTP_PASS` | Email password or App Password |
| `SMTP_TO` | Recipient email for inquiry notifications |

> **Gmail users:** Enable 2FA and generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Use that as `SMTP_PASS`.

---

## API Endpoints

### Projects
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects (filterable by `category`, `featured`) |
| `GET` | `/api/projects/stats` | Aggregate stats |
| `GET` | `/api/projects/:id` | Single project |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

### Profile
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/profile` | Get profile with experience + education |
| `PUT` | `/api/profile` | Update profile |

### Contact / Inquiries
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit inquiry (saves to DB + sends email) |
| `GET` | `/api/inquiries` | List all inquiries |
| `PATCH` | `/api/inquiries/:id/status` | Update status (`unread` / `read` / `replied`) |
| `DELETE` | `/api/inquiries/:id` | Delete inquiry |

### Categories
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/categories` | List all categories |

---

## Development

### Prerequisites
- Node.js 24+
- pnpm
- PostgreSQL database (auto-provisioned on Replit)

### Start all services

```bash
# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Portfolio frontend
pnpm --filter @workspace/portfolio run dev
```

### Database

```bash
# Push schema changes
pnpm --filter @workspace/db run push

# Seed initial data
pnpm --filter @workspace/scripts run seed
```

### API Codegen

After editing `lib/api-spec/openapi.yaml`:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Design

- **Color palette:** Near-black backgrounds (`#080808`), amber/gold primary (`hsl(46 65% 52%)`)
- **Typography:** Syne for headings, Inter for body text
- **Aesthetic:** Dark cinematic, inspired by Behance — high contrast, large type, minimal chrome
- **Animations:** Framer Motion page transitions and scroll-triggered reveals
- **Dark mode default** with light mode toggle in both public nav and CMS sidebar

---

## Deployment

The project is ready to deploy via Replit. Click **Deploy** to publish to a `.replit.app` domain. Ensure all secrets are configured before deploying.
