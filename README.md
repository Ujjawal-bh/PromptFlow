# PromptManager

Production-oriented Phase 1 MVP: authentication, PostgreSQL + Prisma, projects, prompts, dashboard UI, Zod validation, NextAuth (Auth.js), and Docker-friendly deployment for DigitalOcean.

## Local setup

### 1. Database

Create a PostgreSQL database (example credentials from brief):

- **Database:** `promptmanger`
- **User:** `postgres`
- **Password:** `redhat`

Example (with `psql` as superuser):

```sql
CREATE DATABASE promptmanger;
```


### 2. Environment

```bash
cp .env.example .env
# Set DATABASE_URL, AUTH_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL
```

Generate secrets (Linux/macOS):

```bash
openssl rand -base64 32
```

Use the same value for `AUTH_SECRET` and `NEXTAUTH_SECRET` if you like; set `NEXTAUTH_URL` to `http://localhost:3000` for local dev.

### 3. Install & migrate

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma migrate (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production/CI) |

## DigitalOcean: App Platform

1. Create a **Managed PostgreSQL** database and note its connection string.
2. Create an **App** from this repo (or from a container registry built with the included `Dockerfile`).
3. Set environment variables in the app:
   - `DATABASE_URL` – Postgres URL (`?sslmode=require` if required)
   - `AUTH_SECRET` / `NEXTAUTH_SECRET` – long random strings
   - `NEXTAUTH_URL` – public HTTPS URL of the app (e.g. `https://your-app.ondigitalocean.app`)
   - `NEXT_PUBLIC_APP_URL` – same as public URL (optional, for links)
4. **Run migrations** before or on each deploy, e.g.:
   - Build command: `npm install && npx prisma migrate deploy && npm run build`
   - Or a **Job** / release phase: `npx prisma migrate deploy`
5. Ensure the app **does not** rely on Vercel-only features; this template uses standard Node + Next.js.

## DigitalOcean: Droplet + Docker

1. Install Docker on Ubuntu and copy the project (or pull from git).
2. Create `.env` on the server with production `DATABASE_URL` and auth secrets.
3. Build and run:

```bash
docker build -t promptmanager .
docker run -d --name promptmanager -p 3000:3000 --env-file .env promptmanager
```

4. Run migrations against production DB (from the same image or a one-off container):

```bash
docker run --rm --env-file .env promptmanager npx prisma migrate deploy
```

(Adjust if your entrypoint overrides `CMD`; you can use `docker compose` with a separate migrate service.)

5. Put **Caddy** or **Nginx** in front for HTTPS and reverse-proxy to port `3000`.

## Security notes

- Passwords hashed with **bcrypt** (cost factor 12 on register).
- **JWT** sessions with HttpOnly cookies via Auth.js defaults.
- **Middleware** guards `/dashboard/*`; server actions re-check **ownership** on every mutation.
- Validate input with **Zod** on the server; forms use **react-hook-form** + Zod where required.

## Stack

Next.js 15 (App Router), TypeScript, Tailwind, shadcn-style UI, Prisma, PostgreSQL, Zod, Sonner, Auth.js (NextAuth v5 beta).
