# CarbonWise AI

AI-powered Carbon Footprint Awareness Platform built for hackathon demos with Next.js 15, TypeScript, Tailwind CSS, shadcn-style components, Recharts, NextAuth credentials auth, Prisma, SQLite, and OpenAI.

## Folder Structure

```txt
app/
  api/
    activities/route.ts
    auth/[...nextauth]/route.ts
    challenges/route.ts
    coach/route.ts
    register/route.ts
    settings/route.ts
  dashboard/
    activity/page.tsx
    challenges/page.tsx
    coach/page.tsx
    leaderboard/page.tsx
    profile/page.tsx
    settings/page.tsx
    layout.tsx
    loading.tsx
    page.tsx
  login/page.tsx
  signup/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  charts/
  dashboard/
  providers/
  ui/
lib/
  carbon.ts
  dashboard.ts
  prisma.ts
  utils.ts
prisma/
  migrations/20260621174000_init/migration.sql
  schema.prisma
  seed.ts
types/
  next-auth.d.ts
auth.ts
```

## Installation

```bash
npm install
```

On Windows PowerShell, if script execution is blocked, use:

```bash
npm.cmd install
```

## Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""
```

Add a real `OPENAI_API_KEY` to enable live AI coaching. Without it, the coach returns a useful demo fallback.

## Database Setup

```bash
npx prisma migrate dev
npm run seed
```

Demo login:

```txt
Email: demo@carbonwise.ai
Password: password123
```

## Run Locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
```

## Feature Test Checklist

1. Landing page: open `/`, toggle dark mode, test CTA buttons.
2. Sign up: create a new account at `/signup`.
3. Login/logout: use `/login`, then logout from the dashboard header.
4. Dashboard: verify total, weekly, monthly, score cards, charts, and recent activities.
5. Activity tracker: add transportation, food, electricity, and waste activities at `/dashboard/activity`.
6. Carbon calculator: confirm each saved activity shows calculated kg CO2.
7. AI coach: ask a question at `/dashboard/coach`.
8. Challenges: complete a challenge at `/dashboard/challenges`; verify points and badge.
9. Leaderboard: check rankings at `/dashboard/leaderboard`.
10. Profile: verify savings, points, completed challenges, and badges at `/dashboard/profile`.
11. Settings: update name, email, goal, and preferred transport at `/dashboard/settings`.
12. Protected routes: visit `/dashboard` while logged out and confirm redirect to login.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set the build command to `npm run build`.
4. Set environment variables in Vercel:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - `OPENAI_API_KEY`
5. For production, use a hosted database instead of local SQLite because Vercel serverless storage is ephemeral. Prisma Postgres, Neon, Supabase, or Turso are good hackathon-friendly options.

## Prisma Deployment Notes

SQLite is ideal for local demos:

```bash
npx prisma migrate dev
npm run seed
```

For production:

1. Change `datasource db` in `prisma/schema.prisma` to the production provider, such as `postgresql`.
2. Set production `DATABASE_URL`.
3. Run:

```bash
npx prisma migrate deploy
```

4. Seed only if demo data is desired:

```bash
npm run seed
```

## Troubleshooting

- If `npm` or `npx` is blocked in PowerShell, use `npm.cmd` or `npx.cmd`.
- Use Node.js 20 LTS or 22 LTS for the smoothest Prisma/Next.js experience. Node 24 can cause Prisma schema-engine migration failures in some Windows environments.
- If Prisma migration fails locally, remove `prisma/dev.db` and retry `npx prisma migrate dev`.
- If AI coach returns fallback text, set `OPENAI_API_KEY` and restart `npm run dev`.
- If auth fails in production, confirm `AUTH_SECRET` and `NEXTAUTH_URL` match the deployed domain.

## Testing

CarbonWise AI includes:

- Authentication validation tests
- Registration workflow tests
- Carbon footprint calculation tests
- Sustainability challenge tests
- AI Coach validation and fallback tests
- Security and password hashing tests

Continuous Integration is enabled using GitHub Actions.
