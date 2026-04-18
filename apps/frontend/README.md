# Resync AI — Frontend

> **AI-powered resume tailoring.** Paste a job description, Resync AI extracts every keyword, matches it to your experience, and rewrites your bullets — all in seconds.

This is the Next.js 14 frontend for [Resync AI](https://resync.ai), bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Custom CSS |
| Auth | Supabase Auth (email + Google OAuth) |
| State | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page (Hero, Features, HowItWorks, Testimonials, Pricing, CTA, Footer) |
| `/login` | Sign in with email or Google |
| `/signup` | Create a new account |
| `/dashboard/tailor` | Main resume tailoring wizard |
| `/dashboard/resumes` | View & manage saved resumes |
| `/dashboard/analytics` | ATS score trends, skills gap analysis |
| `/dashboard/job-hunt` | AI-matched job recommendations |
| `/dashboard/settings` | Profile, plan, and account settings |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_API_URL` | Your backend service URL (default: `http://localhost:8000`) |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
apps/frontend/
├── app/
│   ├── (auth)/           # Login & Signup pages
│   ├── auth/             # Supabase OAuth callback
│   ├── dashboard/        # Protected dashboard pages
│   │   ├── tailor/       # Resume tailoring wizard
│   │   ├── resumes/      # Saved resumes library
│   │   ├── analytics/    # Score & skills analytics
│   │   ├── job-hunt/     # Job recommendations
│   │   └── settings/     # User settings
│   ├── layout.tsx        # Root layout (fonts, providers)
│   └── page.tsx          # Landing page
├── components/
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Sidebar, Topbar, CustomCursor
│   ├── tailor/           # TailorWizard + steps
│   ├── analytics/        # Analytics cards & charts
│   ├── resumes/          # Resume grid & cards
│   ├── job-hunt/         # Job cards & filters
│   ├── settings/         # Settings layout & sections
│   ├── providers/        # QueryProvider
│   └── ui/               # Base UI components
├── lib/                  # API client, Supabase clients, utils
├── store/                # Zustand stores
├── styles/               # globals.css (landing + auth + dashboard CSS)
├── types/                # TypeScript types
├── middleware.ts          # Supabase auth middleware (protects routes)
├── tailwind.config.ts
└── .env.example          # Required environment variables
```

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Google OAuth** under Authentication → Providers (optional)
3. Set the **Site URL** and **Redirect URLs** in Authentication → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`
4. Copy your project URL and anon key to `.env.local`

---

## Deploy on Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new).

1. Import the repository
2. Set the **Root Directory** to `apps/frontend`
3. Add all environment variables from `.env.example`
4. Deploy 🚀

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

