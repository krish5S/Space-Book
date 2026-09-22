# SpaceBook — Campus Resource Booking System

Built for "Fullstack Development with NextJs" Assignments 1 & 2.

## What's in here, mapped to the brief

**Assignment 1**
- Part A: App Router + Tailwind + Radix/shadcn-style primitives (`components/ui/*`), `next-themes` toggle with no layout shift or hydration mismatch (`components/theme-toggle.tsx`, `suppressHydrationWarning` in `app/layout.tsx`). RSC/client boundary: `app/layout.tsx` and `app/page.tsx` are Server Components that fetch via Prisma and pass only plain DTOs into client components.
- Part B: `lib/cart-store.ts` (persistent booking cart) and `lib/filter-store.ts` (persistent filter panel) — two isolated Zustand slices so filter changes never re-render the server-rendered layout.
- Part C: `lib/validations/booking.ts` is the single Zod schema used both by `components/booking-form.tsx` (react-hook-form + `@hookform/resolvers/zod`) and re-validated server-side in `app/actions/booking.ts` (`'use server'`). Loading state via `<Suspense>` in `components/booking-section.tsx`, success/error feedback in `components/booking-cart.tsx`.

**Assignment 2**
- Part A: `prisma/schema.prisma` (User, Resource, Booking, AuditLog with FK relations) + `prisma/seed.ts` using `@faker-js/faker`. One-command pipeline: `npm run setup` (migrate + seed).
- Part B: `middleware.ts` gates `/admin/*` by role read from the session cookie; `lib/session.ts` + `app/actions/booking.ts` re-check the session server-side too (never trust the edge check alone).
- Part C: `emails/booking-confirmation.tsx` (React Email) sent via `lib/resend.ts` on booking creation and on every admin status change (`app/actions/booking.ts`).

## Setup (5 minutes)

```bash
npm install
cp .env.example .env          # fill in RESEND_API_KEY if you want real emails
npm run setup                 # prisma migrate dev + seed
npm run dev
```

Open http://localhost:3000. Use the "Demo login" card to switch between seeded users —
log in as `Admin User` to unlock `/admin`.

No Postgres/MySQL needed: SQLite (`dev.db`) is used so setup has zero external
dependencies. Swap the `provider` in `prisma/schema.prisma` to `postgresql` and point
`DATABASE_URL` at a real database if you need to demo that too.

If you don't set `RESEND_API_KEY`, emails just fail silently and get logged to the
console (`lib/resend.ts` catches the error) — the booking flow still works end to end.

## For the technical report

- **RSC vs Client render trees**: `app/page.tsx` and `app/layout.tsx` are Server
  Components (async, direct Prisma access). Everything under `components/` except
  `components/ui/card.tsx`/`badge.tsx` is a Client Component (`"use client"`) because it
  needs hooks/state/event handlers. Take a screenshot of the React DevTools component
  tree to show the boundary.
- **Server state vs Zustand client state**: resources/bookings/users are server state
  (fetched fresh per request via Prisma, revalidated with `revalidatePath` after a
  mutation). The booking cart and filters are pure client state, persisted to
  localStorage via Zustand's `persist` middleware — they survive refresh but are never
  the source of truth for what's actually booked.
- **Lighthouse / Core Web Vitals**: run `npm run build && npm run start`, then Lighthouse
  the home page in Chrome DevTools. Because the resource grid and filters are small and
  text-first, expect strong LCP/CLS out of the box — note any regressions if you add
  images.
- **Auth flow diagram**: `middleware.ts` (edge, role from cookie) → route/Server Action
  (`lib/session.ts`, re-fetches the user from Prisma) → mutation. Two checkpoints, not
  one — that's the "proxy gate + backend re-check" pattern worth diagramming.
