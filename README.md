# Next.js + Supabase Template

Production-ready Next.js template with Supabase integration.

## Features

- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Supabase** for auth, database, and storage
- **Server Components** by default
- **Server Actions** for mutations
- **Middleware** for route protection
- **Zod** for validation
- **Tailwind CSS** for styling
- **ESLint + Prettier** for code quality

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (home)
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Protected routes
│   └── api/               # API routes
│       ├── auth/callback/ # OAuth callback
│       └── health/        # Health check
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── features/             # Feature modules
│   ├── auth/             # Authentication logic
│   └── user/             # User management
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and config
│   └── supabase/         # Supabase clients
├── providers/            # React context providers
├── services/             # API client services
└── types/                # TypeScript types
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your credentials
3. Add credentials to `.env.local`
4. Enable Email/Password auth in Authentication settings

### Optional: Generate database types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
4. Deploy

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Decisions

- **Feature-based organization**: Domain logic grouped by feature
- **No Supabase in components**: All DB calls in services/actions
- **Server-first auth**: Session handled via cookies/middleware
- **Type safety**: Zod for runtime validation, TypeScript for static

## License

MIT
