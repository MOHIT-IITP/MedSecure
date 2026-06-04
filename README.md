# MedSecure

MedSecure is a QR-based digital health record platform. Users manage medical reports and daily vitals in a private web app, then share emergency information through a tokenized QR code — no login required for viewers.
<img src="./medsecure_pics/user_dashboard.png" height=500px width=800px>
<img src="./medsecure_pics/daily_log.png" height=500px width=800px>
<img src="./medsecure_pics/emergency_dashboard.png" height=500px width=800px>
<img src="./medsecure_pics/medical_report_upload.png" height=500px width=800px>
<img src="./medsecure_pics/profile.png" height=500px width=800px>
<img src="./medsecure_pics/qr code.png" height=500px width=800px>
## Features

| Area | What you get |
|------|----------------|
| **Auth** | Signup, login, logout, HTTP-only JWT cookies, bcrypt passwords |
| **Profile** | Name, age, blood group, allergies, chronic conditions, emergency contact |
| **Reports** | Upload PDF/images to Supabase; list, download (signed URL), delete |
| **Health logs** | Blood pressure, sugar, pulse, weight, notes |
| **QR access** | Unique token per user → public dashboard on port 3001 |

## Architecture

```
medsecure/
├── monorepo/
│   ├── apps/
│   │   ├── web/          → Main app (port 3000)
│   │   └── dashboard/    → Public QR view (port 3001)
│   └── packages/
│       ├── db/           → Drizzle ORM + PostgreSQL
│       ├── auth/         → JWT + password hashing
│       └── validation/   → Zod schemas
└── README.md
```

**Stack:** Next.js 16, TypeScript, Turborepo, Bun, Tailwind CSS, Drizzle ORM, PostgreSQL, Supabase Storage, JWT (cookie sessions), QR code generation.

## Prerequisites

- [Bun](https://bun.sh) 1.3+
- PostgreSQL database
- [Supabase](https://supabase.com) project with a storage bucket named `medical-reports`

## Setup

```bash
cd monorepo
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-long-random-secret
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DASHBOARD_URL=http://localhost:3001
WEB_URL=http://localhost:3000
```

Apply the database schema:

```bash
bun install
bun run --filter @repo/db db:push
# or: bun run --filter @repo/db db:migrate
```

Build shared UI styles (first time):

```bash
bun run --filter @repo/ui build:components
bun run --filter @repo/ui build:styles
```

## Development

```bash
cd monorepo

# Terminal 1 — main app
cd apps/web && bun run dev

# Terminal 2 — public QR dashboard
cd apps/dashboard && bun run dev
```

| App | URL |
|-----|-----|
| Web (auth, records, QR generation) | http://localhost:3000 |
| Dashboard (scan target) | http://localhost:3001 |

Or run everything with Turbo:

```bash
bun run dev
```

## Backend API (web — port 3000)

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/auth/signup` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/logout` | cookie |
| GET | `/api/auth/me` | cookie |
| GET/PATCH | `/api/profile` | cookie |
| GET/POST | `/api/health` | cookie |
| GET | `/api/reports` | cookie |
| POST | `/api/reports/upload` | cookie |
| GET/DELETE | `/api/reports/[id]` | cookie |
| GET | `/api/qr` | cookie |

## Public API (dashboard — port 3001)

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/view/[token]` | token in URL |

## Testing

With both apps running:

```bash
cd monorepo
bun run test:backend
```

Runs integration tests against all API endpoints.

## User flow

1. **Sign up** at `/signup` → redirected to dashboard.
2. **Profile** — add blood type, allergies, emergency contact (shown on QR view).
3. **Health logs** — `/records` for daily vitals.
4. **Reports** — upload from dashboard.
5. **QR** — `/qr` shows code linking to `http://localhost:3001/view/{token}`.
6. **Scan** — responder sees read-only emergency dashboard (no account needed).

## Security notes

- QR uses opaque tokens, not user UUIDs in URLs.
- Profile API strips password hashes from responses.
- Medical report files are not exposed on the public dashboard.
- JWT stored in `httpOnly` cookies (7-day expiry).

## License

Private / educational use — adjust as needed for your deployment.
