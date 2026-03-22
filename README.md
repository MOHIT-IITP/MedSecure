MedSecure -> A Healthy QR



stack used in this project
-> turborepo
-> Drizzle ORM
-> tba 

medsecure/
│
├─ apps/
│   ├─ docs/        → landing page 
│   ├─ web/         → user dashboard (where the user will be redirected after qr sca)
│   └─ api/         → backend server
│
├─ packages/
│   ├─ db/          → drizzle schema
│   ├─ auth/        → auth logic
│   └─ types/       → shared types



User → docs.medsecure.com
        │
        │ Login / Signup
        ▼
api.medsecure.com/auth
        │
        ▼
Supabase Postgres
        │
        ▼
JWT token returned
        │
        ▼
User goes to
web.medsecure.com/dashboard
