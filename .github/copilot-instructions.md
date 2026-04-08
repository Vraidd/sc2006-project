# Pawsport & Peer – AI Agent Instructions

**Project:** Full-stack pet care coordination platform (owner & caregiver network)  
**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma + PostgreSQL, JWT auth, Tailwind CSS  
**Last Updated:** 2026-04-04

---

## Quick Start for AI Agents

### Essential Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Compile (prisma generate + next build)
npm run lint             # Run ESLint
npm run db:reset         # ⚠️ Development only: drop & recreate DB, apply migrations, seed
npm run db:seed          # Seed sample data (runs prisma generate first)
npm install              # Auto-runs postinstall hook (prisma generate)
```

### Environment Setup

**Required `.env.local` variables:**

```
DATABASE_URL=postgresql://user:password@localhost:5432/sc2006
JWT_SECRET=<secret-key-for-access-tokens>
JWT_REFRESH_SECRET=<secret-key-for-refresh-tokens>
NODE_ENV=development
```

⚠️ **No `.env.example` exists** – see "Potential Pitfalls" section below.

---

## Project Architecture at a Glance

### Folder Structure

```
sc2006/
├── app/
│   ├── api/                    # Backend API routes (standard Next.js pattern)
│   │   ├── auth/               # Login, register, refresh, verify-email
│   │   ├── booking/            # Service bookings
│   │   ├── caregivers/         # Caregiver profiles & search
│   │   ├── chats/              # Chat endpoint (messages tied to booking/user)
│   │   ├── messages/           # Message CRUD
│   │   ├── pets/               # Pet management
│   │   ├── profile/            # User profile & avatar upload
│   │   ├── reviews/            # Star ratings & comments
│   │   └── boundaries/         # Location-based data
│   │
│   ├── admin/                  # Admin dashboard (incidents, verified caregivers)
│   ├── caregiver/              # Caregiver console (profile, messages, bookings, transactions)
│   ├── owner/                  # Pet owner dashboard (search, bookings, my pets, rating)
│   ├── signin, signup/         # Auth flows
│   ├── components/             # Shared UI (Navbar, ChatUI, MapComponent, modals)
│   ├── context/                # React Context (ToastContext for notifications)
│   ├── hooks/                  # Custom hooks (useAuth, useBooking, usePets, useUsers)
│   ├── lib/                    # Utilities & config
│   │   ├── prisma.ts           # Prisma client singleton (prevents multiple instances)
│   │   ├── utils.ts            # Auth helpers (hash, tokens, cookies)
│   │   ├── validation.ts       # Zod schemas for all input validation
│   │   ├── debugConfig.ts      # DEBUG_MODE toggle & role switcher (dev testing)
│   │   ├── rate-limit.ts       # Rate limiting by IP
│   │   └── email.ts            # Nodemailer config for notifications
│   │
│   ├── generated/prisma/       # Auto-generated Prisma client (committed to repo)
│   └── globals.css             # Tailwind styles
│
├── prisma/
│   ├── schema.prisma           # Core data model (11 models, Enums for Role/Status/etc)
│   ├── migrations/             # Database migrations (initial: 20260306071910_init)
│   └── seed.ts                 # Database seeding script
│
├── hooks/                      # Root-level hooks directory
├── public/                     # Static assets (modals, uploads)
└── tsconfig.json              # Path alias: @/* → project root
```

### Data Model Overview

**11 Prisma Models:**

- `User` (auth + profile, role-based: OWNER/CAREGIVER/ADMIN)
- `CaregiverProfile` (daily rate, services, pet preferences, ratings)
- `Pet` (type, breed, vaccination, special needs)
- `Booking` (service requests with payment & status)
- `Review` (ratings & comments per booking)
- `Payment` (Stripe integration)
- `Message` (chat messages)
- `Chat` (1:1 relationships)
- `Availability` & `AvailabilityException` (caregiver scheduling)
- `Notification` (event-driven notifications)

**Key Enums:**

- `Role`: OWNER, CAREGIVER, ADMIN
- `PetType`: DOG, CAT, BIRD, FISH, REPTILE, SMALL_ANIMAL, OTHER
- `ServiceType`: 20+ types (BOARDING, DAYCARE, Training variants, TAXI, WEDDING, etc.)
- `BookingStatus`: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, DECLINED
- `PaymentStatus`: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
- `AccountStatus`: ACTIVE, SUSPENDED, LOCKED

---

## Key Patterns & Conventions

### Authentication

**Flow:**

1. User logs in → `POST /api/auth/login` validates credentials
2. On success, generates JWT access token (30m) + refresh token (7d)
3. Both stored in **HTTP-only, secure cookies** (`setAuthCookies()`)
4. `useAuth()` hook fetches `/api/auth/me` on mount
5. On 401, auto-refreshes via `/api/auth/refresh`

**Important:** When adding authenticated endpoints, require cookies, don't accept raw tokens in headers.

### API Route Pattern

```typescript
// app/api/[resource]/route.ts

export async function POST(req: Request) {
  try {
    // 1. Validate input with Zod schema from app/lib/validation.ts
    const data = yourSchema.parse(await req.json());

    // 2. Check rate limit (for auth routes)
    const rateLimit = checkRateLimit(req); // from app/lib/rate-limit.ts

    // 3. Use Prisma from singleton
    import { prisma } from "@/app/lib/prisma";
    const result = await prisma.model.create({ data });

    // 4. Return JSON with error/success structure
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

### Component Pattern

- **Server components by default** (Next.js 16 convention)
- Use `"use client"` only when needing hooks, Context, or interactivity
- Props fully typed (TypeScript)
- Modals for complex forms (DatePickerModal, FiltersModal, CaregiverAvailabilityModal)

### Validation

- All user input validated with **Zod schemas** (`app/lib/validation.ts`)
- Password: 8+ characters, must include uppercase, lowercase, number, special char
- Email: standard email format
- Phone: optional, E.164 format if provided
- Coordinates: valid lat/long ranges

### Utility Functions in lib/utils.ts

- `hashPassword(pwd)` / `comparePasswords(pwd, hash)` – bcrypt-based
- `generateTokens(user)` – creates access + refresh tokens
- `verifyToken(token, secret)` – JWT validation
- `setAuthCookies(response, tokens)` – sets HTTP-only cookies
- `generateVerificationToken()` – crypto.randomBytes for email links

---

## Common Development Tasks

| Task                     | Location                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| Add authentication logic | `app/lib/utils.ts`, `hooks/useAuth.ts`                                    |
| Add API endpoint         | `app/api/{resource}/route.ts`                                             |
| Add page/UI              | `app/{admin\|caregiver\|owner\|signin}/{feature}/page.tsx`                |
| Update database schema   | `prisma/schema.prisma` then run `prisma migrate dev --name "description"` |
| Add validation rule      | `app/lib/validation.ts` (Zod schema)                                      |
| Add global UI context    | `app/context/ToastContext.tsx`                                            |
| Add custom hook          | `hooks/{hookName}.ts` then import as `@/hooks/{hookName}`                 |
| Debug UI state           | Toggle `DEBUG_MODE` in `app/lib/debugConfig.ts`, switch `MOCK_ROLE`       |

---

## Potential Pitfalls & Solutions

### 1. Missing `.env.local`

**Problem:** App crashes on startup if `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` not set.

**Solution:**

```bash
# Create .env.local with actual credentials before running npm run dev
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="random-secret-key"
JWT_REFRESH_SECRET="another-secret-key"
NODE_ENV=development
```

### 2. Prisma Client Not Generated

**Problem:** `Cannot find module '@prisma/client'` or similar import errors.

**Solution:**

- Run `npm install` (auto-runs postinstall hook)
- Or manually: `npm run db:generate`
- Commit `app/generated/prisma/` to version control (unusual but intentional for this project)

### 3. Auth Cookies Not Persisting

**Problem:** User logs in, but on page refresh, `useAuth()` doesn't find the cookie.

**Check:**

- Cookies set with `path: /`, `sameSite: lax`, `secure: true` (HTTPS in prod)
- Dev server on `localhost` ✓ (HttpOnly over HTTP is allowed on localhost)
- Cross-domain requests may fail; test same-origin first

### 4. Role-Based Routing Broken

**Problem:** User with role OWNER can see CAREGIVER pages.

**Solution:** `ProtectedRoute` component checks roles before rendering. Verify:

- User role correctly fetched via `/api/auth/me`
- `ProtectedRoute` wraps the component: `<ProtectedRoute allowedRoles={['CAREGIVER']}>`

### 5. Database Migration Issues

**Problem:** Schema drift or migration conflicts after pulling changes.

**Solution:**

- Development only: `npm run db:reset --force` (drops DB, reapplies all migrations, seeds)
- Production: use `prisma migrate deploy` with backup

### 6. Rate Limiting False Positives

**Problem:** API endpoints return 429 (Too Many Requests) during local testing.

**Check:** `app/lib/rate-limit.ts` logic – verify window size and max requests per IP.

### 7. Next.js App Router Confusion

- **Server components by default** – the opposite of Pages Router
- Dynamic routes use `[id]` folder syntax (e.g., `app/owner/my_pets/[petId]/page.tsx`)
- Middleware/auth checks happen per route, not globally
- API routes are in the `api/` folder and treated as server-side only

---

## Debug Mode

For testing different UI states without full backend setup:

**File:** `app/lib/debugConfig.ts`

```typescript
export const DEBUG_MODE = true; // Set to false for production
export const MOCK_ROLE = "OWNER"; // Switch to CAREGIVER, ADMIN, GUEST to test
```

When `DEBUG_MODE = true`:

- Auth checks are bypassed
- User is mocked with the role in `MOCK_ROLE`
- Useful for frontend-only dev when backend APIs incomplete

---

## Performance Notes

- **Prisma queries:** Use `.select()` to avoid N+1 (only fetching needed fields)
- **Database indexes:** Schema indexes frequently queried columns (User.role, Booking.status, dates)
- **Rate limiting:** Auth routes use IP-based rate limiting to prevent brute force
- **HTTP-only cookies:** More secure than localStorage for tokens
- **Next.js Server Components:** Reduce JavaScript sent to client

---

## When to Ask the Codebase

- **"How is authentication implemented?"** → Start at `hooks/useAuth.ts` and `app/api/auth/`
- **"How do I add a new service type?"** → Update `ServiceType` enum in `prisma/schema.prisma`, run migration
- **"What validation rules apply to passwords?"** → See `app/lib/validation.ts` (passwordSchema)
- **"How are role-based pages protected?"** → Check `app/components/ProtectedRoute.tsx`
- **"How is the caregiver availability handled?"** → See `Availability` and `AvailabilityException` models + `/api/availability` routes

---

## Useful Links & External References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zod Schema Validation](https://zod.dev)
- [JWT.io](https://jwt.io) – Debug tokens

---

## Contributing Notes

When making changes:

1. Update database schema → run migration with descriptive name
2. Add/modify validation → update `app/lib/validation.ts`
3. Add API endpoints → follow the pattern in "API Route Pattern" section
4. Test with DEBUG_MODE for quick UI validation
5. Run `npm run lint` before committing
