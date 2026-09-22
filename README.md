# SpaceBook — Campus Resource Booking System

SpaceBook is a full-stack campus resource booking platform built with **Next.js App Router, React, TypeScript, Tailwind CSS, Zustand, Zod, Prisma, SQLite, React Email, and Resend**.

The system allows campus users to browse resources, select booking times, maintain a booking cart, create bookings, and receive booking notifications. Administrators can manage bookings and update their status through a protected admin interface.

Built for **Fullstack Development with NextJs — Assignments 1 & 2**.

---

## System Architecture

SpaceBook follows a layered architecture that separates server-rendered application logic, client-side interaction state, validation, database access, authorization, and email delivery.

| Layer | Responsibility |
|---|---|
| UI / App Router | Resource browsing, booking form, cart, admin interface |
| Server Components | Resource and application data fetching |
| Client Components | Interactive forms, filters, cart and UI state |
| Zustand | Persistent booking-cart and filter state |
| Validation | Zod schemas shared between client and server |
| Server Actions | Secure booking and admin mutations |
| Database | Prisma + SQLite (`dev.db`) |
| Authorization | Middleware role gate + server-side session verification |
| Email | React Email templates + Resend |
| Audit | Booking and administrative actions recorded through `AuditLog` |

The architecture uses **Server Components for the main application pages/layout** and **Client Components for interactive functionality**. Server-rendered data is passed to client components as plain DTOs.

---

## Core Features

### User Features

- Browse campus resources
- Filter resources by building and resource type
- View resource capacity and availability
- Select booking dates and times
- Add resources to a persistent booking cart
- Validate booking information using Zod
- Create bookings through secure Server Actions
- View booking feedback and status
- Receive booking confirmation notifications

### Admin Features

- Protected `/admin` dashboard
- Role-based access control
- View bookings
- Update booking status
- Trigger notification emails when booking status changes
- Record administrative actions through the audit system

### Technical Features

- Next.js App Router
- React Server Components
- Client Components with explicit `"use client"` boundaries
- Tailwind CSS
- Radix/shadcn-style UI primitives
- `next-themes` light/dark mode
- Zustand persistent client state
- React Hook Form
- Zod validation
- Prisma ORM
- SQLite database
- React Email
- Resend email delivery
- Middleware authorization
- Server-side authorization re-check
- Prisma database seeding with Faker

---

# Assignment 1

## Part A — Next.js App Router and UI Architecture

The project uses the Next.js App Router with Tailwind CSS and reusable UI primitives under:

```text
components/ui/*
