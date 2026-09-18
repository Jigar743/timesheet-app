# Ticktock - Timesheet Management App

A SaaS-style Timesheet Management application built with **Next.js,
TypeScript, Tailwind CSS, shadcn/ui, NextAuth, Prisma, and PostgreSQL**.

The application allows authenticated users to view and manage weekly
timesheets, track daily work entries, and monitor weekly working hours.

------------------------------------------------------------------------

## Features

### Authentication

-   Email and password login
-   Credentials-based authentication using NextAuth
-   JWT-based sessions
-   Protected dashboard
-   Invalid credential handling
-   Logout support

### Timesheet Dashboard

-   View weekly timesheets
-   View timesheet status
-   Filter by date range
-   Filter by status
-   Pagination
-   Status-based actions

### Weekly Timesheet

-   View entries grouped by day
-   Display weekly total hours
-   40-hour weekly progress
-   Add new task
-   Edit existing task
-   Delete task
-   Responsive layout

### Timesheet Status

The application supports three statuses:

-   `COMPLETED`
-   `INCOMPLETE`
-   `MISSING`

A missing timesheet becomes incomplete when the first task is
successfully created.

``` text
MISSING
   |
   | Add first task
   v
INCOMPLETE
```

Completed timesheets are read-only:

``` text
COMPLETED
   |
   └── View only
```

### Toast Notifications

The application uses **Sonner** through shadcn/ui for user feedback.

Examples include:

-   Successful timesheet creation
-   Successful timesheet updates
-   Successful deletion
-   API errors
-   Validation messages

The global `<Toaster />` is configured through the application's
`Providers` component.

------------------------------------------------------------------------

# Tech Stack

  Technology             Purpose
  ---------------------- --------------------------------------
  Next.js 16             Application framework
  React 19               UI development
  TypeScript             Type safety
  Tailwind CSS           Styling
  shadcn/ui              Reusable UI components
  Sonner                 Toast notifications
  NextAuth               Authentication and sessions
  Prisma 7               ORM and database access
  Prisma Postgres        Hosted PostgreSQL database
  `@prisma/adapter-pg`   PostgreSQL driver adapter for Prisma
  `pg`                   PostgreSQL client
  ESLint                 Code quality

------------------------------------------------------------------------

# Project Setup

## Prerequisites

Make sure you have the following installed:

-   Node.js
-   npm
-   PostgreSQL database / Prisma Postgres project

Check your versions:

``` bash
node -v
npm -v
```

## Install Dependencies

Clone the project and install dependencies:

``` bash
npm install
```

The project already includes Prisma, PostgreSQL adapter dependencies,
NextAuth, shadcn/ui, and Sonner.

------------------------------------------------------------------------

# Prisma and PostgreSQL Setup

The application uses **Prisma 7 with Prisma Postgres** instead of the
previous JSON/lowdb persistence layer.

The current persistence architecture is:

``` text
React UI
   |
   v
Next.js API Routes
   |
   v
Repository Layer
   |
   v
Prisma
   |
   v
PostgreSQL / Prisma Postgres
```

The JSON files are retained only as **seed data** for initial database
population. They are no longer used as the application's runtime
database.

## Prisma Schema

The database schema is located at:

``` text
prisma/schema.prisma
```

Current models:

``` text
User
Timesheet
TimesheetEntry
```

The `TimesheetStatus` enum contains:

``` text
COMPLETED
INCOMPLETE
MISSING
```

## Prisma Configuration

The Prisma configuration is located at:

``` text
prisma7.config.ts
```

The configuration uses the direct database connection for Prisma CLI
operations and migrations.

Conceptually:

``` text
DIRECT_URL
    |
    v
Prisma CLI
    |
    +-- migrate
    +-- seed
    +-- other database administration commands
```

## Prisma Client

The application uses the PostgreSQL adapter:

``` text
@prisma/adapter-pg
       |
       v
      pg
       |
       v
PostgreSQL
```

The Prisma client is created in:

``` text
lib/db.ts
```

The application uses:

``` text
DATABASE_URL
```

for runtime database access.

## Generated Prisma Client

Prisma generates the client into:

``` text
generated/prisma
```

This directory is generated automatically and should **not** be
committed to Git.

It is regenerated during the application build using:

``` bash
npx prisma generate
```

The repository therefore commits the Prisma source files and migrations,
but not the generated client.

------------------------------------------------------------------------

# Environment Variables

Create a local environment file in the project root.

The application requires:

``` env
DATABASE_URL="your-pooled-postgresql-connection-string"
DIRECT_URL="your-direct-postgresql-connection-string"

AUTH_SECRET="your-development-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## `DATABASE_URL`

`DATABASE_URL` is used by the application at runtime through the
PostgreSQL Prisma adapter.

For Prisma Postgres, use the pooled connection string for application
traffic.

Conceptually:

``` text
DATABASE_URL
    |
    v
Next.js application
    |
    v
Prisma Client
    |
    v
Pooled PostgreSQL connection
```

## `DIRECT_URL`

`DIRECT_URL` is used by Prisma CLI operations such as migrations.

Conceptually:

``` text
DIRECT_URL
    |
    v
Prisma CLI
    |
    v
Direct PostgreSQL connection
```

Generate the connection strings from the Prisma/Vercel database
connection settings rather than manually converting one connection
string into another.

## `AUTH_SECRET`

Used by NextAuth for authentication/session security.

Use a strong, unique secret in production.

## `NEXTAUTH_URL`

For local development:

``` env
NEXTAUTH_URL="http://localhost:3000"
```

For production, configure the deployed application URL in Vercel, for
example:

``` env
NEXTAUTH_URL="https://your-project.vercel.app"
```

## Environment Variable Security

Never commit environment files containing secrets:

``` text
.env
.env.local
```

These files should be included in `.gitignore`.

------------------------------------------------------------------------

# Database Migration

After configuring `DIRECT_URL`, generate and apply the database schema
locally with Prisma migrations.

Create a migration:

``` bash
npx prisma migrate dev --name init
```

Check migration status:

``` bash
npx prisma migrate status
```

For production deployments, pending committed migrations can be applied
with:

``` bash
npx prisma migrate deploy
```

Do not use `prisma migrate dev` against the production database.

------------------------------------------------------------------------

# Seed Database

The initial seed data is stored in the existing JSON files:

``` text
data/
├── users.json
├── timesheets.json
└── entries.json
```

These files are now used only as the source for the Prisma seed script.

The seed script is:

``` text
prisma/seed.ts
```

It reads the JSON data and inserts it into PostgreSQL using Prisma
`upsert()` operations.

Run the seed with:

``` bash
npx prisma db seed
```

The seed flow is:

``` text
users.json
timesheets.json
entries.json
        |
        v
prisma/seed.ts
        |
        v
Prisma
        |
        v
PostgreSQL
```

The seed is not part of the normal Next.js build and should not be run
automatically on every deployment unless explicitly required.

------------------------------------------------------------------------

# Generate Prisma Client

Whenever the Prisma schema changes, regenerate Prisma Client:

``` bash
npx prisma generate
```

The generated output is:

``` text
generated/prisma/
```

The generated directory is ignored by Git and is recreated during
deployment/build.

------------------------------------------------------------------------

# Run the Application

Start the development server:

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Available Scripts

### Development

``` bash
npm run dev
```

Starts the Next.js development server.

### Production Build

``` bash
npm run build
```

Creates the production build. The build configuration also generates the
Prisma Client before building the Next.js application.

### Production Server

``` bash
npm start
```

Starts the production Next.js server.

### Lint

``` bash
npm run lint
```

Runs ESLint.

### Type Check

``` bash
npm run typecheck
```

Runs TypeScript type checking without emitting files.

### Prisma Generate

``` bash
npx prisma generate
```

Generates the Prisma Client.

### Prisma Migration Status

``` bash
npx prisma migrate status
```

Checks the current migration state.

### Prisma Production Migrations

``` bash
npx prisma migrate deploy
```

Applies pending committed migrations to the target database.

### Prisma Seed

``` bash
npx prisma db seed
```

Seeds the database from the JSON seed data.

### Prisma Studio

``` bash
npx prisma studio
```

Opens Prisma Studio for viewing and managing database records.

------------------------------------------------------------------------

# Project Structure

``` text
timesheet-app/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   │
│   │   └── timesheets/
│   │       ├── route.ts
│   │       └── [timesheetId]/
│   │           └── entries/
│   │               ├── route.ts
│   │               └── [entryId]/
│   │                   └── route.ts
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── [timesheetId]/
│   │       └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── EntryFormModal.tsx
│   ├── LoginForm.tsx
│   ├── Providers.tsx
│   ├── TimesheetDetails.tsx
│   ├── TimesheetTable.tsx
│   ├── header.tsx
│   └── ui/
│       ├── sonner.tsx
│       └── ...
│
├── data/
│   ├── users.json
│   ├── timesheets.json
│   └── entries.json
│
├── generated/
│   └── prisma/
│       └── ... generated files
│
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── users.ts
│   ├── timesheets.ts
│   └── entries.ts
│
├── prisma/
│   ├── migrations/
│   │   └── ...
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── .env
├── .env.local
├── .gitignore
├── package.json
├── prisma7.config.ts
└── README.md
```

> `generated/prisma` is generated output and should not be committed to
> Git.

------------------------------------------------------------------------

# Architecture

The application follows a layered architecture to keep the UI, API,
business logic, and persistence separated.

``` text
┌─────────────────────────┐
│       React UI          │
│ Pages + Components      │
└────────────┬────────────┘
             │
             │ fetch()
             ▼
┌─────────────────────────┐
│   Next.js API Routes    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    Repository Layer     │
│ users / timesheets /    │
│ entries                 │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         Prisma          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
│     Prisma Postgres     │
└─────────────────────────┘
```

The client does not directly access PostgreSQL.

All client-side data operations go through internal Next.js API routes.

------------------------------------------------------------------------

# Data Storage

The application uses PostgreSQL as its runtime persistent database.

Prisma provides the data access layer:

``` text
Next.js
   |
   v
Repository
   |
   v
Prisma
   |
   v
PostgreSQL
```

The JSON files under `data/` are retained as seed sources only.

## `users.json`

Stores initial users used by the seed process.

The seed script reads the users and creates/updates corresponding Prisma
`User` records.

## `timesheets.json`

Stores initial weekly timesheet data used by the seed process.

The data is inserted into the Prisma `Timesheet` model.

## `entries.json`

Stores initial work-entry data used by the seed process.

Each entry references its parent timesheet through `timesheetId`.

------------------------------------------------------------------------

# Database Models

## User

``` text
User
├── id
├── name
├── email
└── password
```

`email` is unique.

## Timesheet

``` text
Timesheet
├── id
├── weekNumber
├── startDate
├── endDate
├── status
└── entries[]
```

## TimesheetEntry

``` text
TimesheetEntry
├── id
├── timesheetId
├── date
├── project
├── workType
├── description
└── hours
```

Each `TimesheetEntry` belongs to a `Timesheet`.

Deleting a timesheet cascades to its related entries.

------------------------------------------------------------------------

# Authentication Implementation

Authentication is implemented using NextAuth's Credentials Provider.

The authentication flow is:

``` text
┌───────────────┐
│   Login Page  │
└───────┬───────┘
        │
        │ email + password
        ▼
┌───────────────┐
│    NextAuth   │
└───────┬───────┘
        │
        ▼
┌──────────────────┐
│ findUserByEmail()│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      Prisma      │
│      User        │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
  Valid    Invalid
    │         │
    ▼         ▼
 Session     Error
    │
    ▼
 /dashboard
```

The login form uses:

``` ts
signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

Authentication configuration is located in:

``` text
lib/auth.ts
```

The NextAuth API route is located in:

``` text
app/api/auth/[...nextauth]/route.ts
```

------------------------------------------------------------------------

# Session Protection

Protected pages validate the authenticated session on the server.

Example:

``` ts
const session = await getServerSession(authOptions);

if (!session?.user) {
  redirect("/login");
}
```

This prevents unauthenticated users from directly accessing protected
dashboard pages.

Protected API routes also validate the session before allowing data
operations.

------------------------------------------------------------------------

# Providers and Global Configuration

The application uses a client-side `Providers` component to wrap global
client providers.

Current structure:

``` text
RootLayout
    |
    v
Providers
    |
    ├── SessionProvider
    |
    ├── Toaster
    |
    └── Application
```

`SessionProvider` provides the NextAuth session context.

The Sonner `Toaster` provides global toast notifications.

The providers component is located at:

``` text
components/providers.tsx
```

------------------------------------------------------------------------

# Toast Notifications

Toast notifications are implemented using **shadcn/ui Sonner**.

The toaster is mounted globally through `Providers`.

In a Client Component:

``` tsx
"use client";

import { toast } from "sonner";
```

Examples:

``` tsx
toast.success("Timesheet created successfully!");
```

``` tsx
toast.error("Something went wrong.");
```

``` tsx
toast.warning("Please complete all required fields.");
```

With a description:

``` tsx
toast.success("Timesheet updated", {
  description: "Your changes have been saved.",
});
```

The reusable Sonner component is located at:

``` text
components/ui/sonner.tsx
```

------------------------------------------------------------------------

# Application Pages

## Login

Route:

``` text
/login
```

The login page contains:

-   Email input
-   Password input
-   Remember me checkbox
-   Sign in button
-   Loading state
-   Authentication error state

After successful authentication:

``` text
/login
   |
   v
Authentication
   |
   v
/dashboard
```

------------------------------------------------------------------------

## Dashboard / Table View

Route:

``` text
/dashboard
```

The dashboard provides an overview of weekly timesheets.

The dashboard supports:

-   Date range filtering
-   Status filtering
-   Pagination
-   Status-specific actions

Example:

``` text
Your Timesheets

Date Range        Status

Week #   Date              Status       Action

1        Jan 01 - Jan 05   COMPLETED    View
2        Jan 08 - Jan 12   INCOMPLETE   Update
3        Jan 15 - Jan 19   MISSING      Create
```

------------------------------------------------------------------------

## Weekly Timesheet / List View

Route:

``` text
/dashboard/[timesheetId]
```

This page displays entries belonging to a specific week.

Entries are grouped by date.

The page displays:

-   Weekly date range
-   Total hours
-   40-hour progress
-   Daily entries
-   Add task action
-   Edit task action
-   Delete task action

------------------------------------------------------------------------

# Timesheet Status

## MISSING

A week has no timesheet entries.

``` text
MISSING
   |
   └── Create
```

When the first task is successfully created:

``` text
MISSING → INCOMPLETE
```

The status transition is handled by the server.

------------------------------------------------------------------------

## INCOMPLETE

A week has one or more entries but is not completed.

The user can:

-   Add entries
-   Edit entries
-   Delete entries

Dashboard action:

``` text
INCOMPLETE → Update
```

------------------------------------------------------------------------

## COMPLETED

A completed timesheet is read-only.

The user can view the timesheet but cannot:

-   Add entries
-   Edit entries
-   Delete entries

Dashboard action:

``` text
COMPLETED → View
```

------------------------------------------------------------------------

# Entry Management

The application uses a reusable entry modal for creating and editing
entries.

## Add Entry

``` text
Add New Entry

Select Project *
Type of Work *
Task description *
Hours *

[ Add entry ] [ Cancel ]
```

## Edit Entry

The same component is populated with the selected entry:

``` text
Edit Entry

Select Project *
Type of Work *
Task description *
Hours *

[ Update entry ] [ Cancel ]
```

The date is determined by the day from which the user clicks the
add-entry action, so the modal does not require a separate date field.

------------------------------------------------------------------------

# API Design

All client-side timesheet operations use internal Next.js API routes.

## Get Timesheets

``` http
GET /api/timesheets
```

Returns available weekly timesheets.

## Get Weekly Entries

``` http
GET /api/timesheets/:timesheetId/entries
```

Returns entries belonging to the selected timesheet.

## Create Entry

``` http
POST /api/timesheets/:timesheetId/entries
```

Creates a new work entry.

If the selected timesheet is currently `MISSING`, the API changes the
status to:

``` text
MISSING → INCOMPLETE
```

after the entry is successfully created.

## Update Entry

``` http
PUT /api/timesheets/:timesheetId/entries/:entryId
```

Updates an existing work entry.

## Delete Entry

``` http
DELETE /api/timesheets/:timesheetId/entries/:entryId
```

Deletes an existing work entry.

------------------------------------------------------------------------

# API Request Flow

Example: adding a new task.

``` text
User clicks "+ Add new task"
          |
          v
     Entry Modal
          |
          | POST
          v
/api/timesheets/:timesheetId/entries
          |
          v
    Validate Session
          |
          v
   Validate Request
          |
          v
   Entry Repository
          |
          v
        Prisma
          |
          v
      PostgreSQL
          |
          v
 Is timesheet MISSING?
          |
         Yes
          |
          v
   Update Timesheet
          |
          v
MISSING → INCOMPLETE
          |
          v
     API Response
          |
          v
      Update UI
```

------------------------------------------------------------------------

# Validation

Both client-side and server-side validation are used.

Required fields:

-   Project
-   Type of Work
-   Task Description
-   Hours

Hours must be a valid positive number.

Server-side validation is important because client-side validation alone
cannot be trusted.

------------------------------------------------------------------------

# UI Components

The application uses reusable shadcn/ui components where appropriate.

Examples include:

-   Button
-   Input
-   Label
-   Dialog
-   Select
-   Popover
-   Calendar
-   Table
-   Dropdown Menu
-   Badge
-   Textarea
-   Sonner

Application-specific components are kept separate from reusable
shadcn/ui components.

------------------------------------------------------------------------

# Responsive Design

The application is designed to work across:

-   Desktop
-   Tablet
-   Mobile

The dashboard table and weekly timesheet views adapt to smaller screen
sizes.

------------------------------------------------------------------------

# Loading and Error States

API operations provide loading and error feedback.

Examples:

``` text
Loading timesheets...
```

``` text
Unable to load timesheets.

[ Try again ]
```

During an entry operation:

``` text
Saving entry...
```

Toast notifications are also used to communicate successful operations
and errors.

The UI should not silently fail when an API request encounters an error.

------------------------------------------------------------------------

# Deployment on Vercel

The application is designed to deploy to Vercel with Prisma Postgres.

The deployment architecture is:

``` text
GitHub
   |
   v
Vercel
   |
   ├── Prisma generate
   |
   ├── Prisma migrations
   |
   v
Next.js Application
   |
   v
Prisma Client
   |
   v
Prisma Postgres
```

## Vercel Environment Variables

Configure the following variables in the Vercel project:

``` text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
NEXTAUTH_URL
```

### Production values

``` text
DATABASE_URL
→ Pooled Prisma Postgres connection

DIRECT_URL
→ Direct Prisma Postgres connection

AUTH_SECRET
→ Strong production secret

NEXTAUTH_URL
→ Production Vercel/application URL
```

Do not use:

``` text
http://localhost:3000
```

for the production `NEXTAUTH_URL`.

The Vercel/Prisma integration may also provide additional managed
variables such as:

``` text
POSTGRES_URL
PRISMA_DATABASE_URL
```

The application itself uses `DATABASE_URL` for runtime queries and
`DIRECT_URL` for Prisma CLI/migration operations.

## Deployment Build

The production build is run through:

``` bash
npm run build
```

The build generates the Prisma Client before building Next.js.

If the build is configured to run production migrations, it uses:

``` bash
npx prisma migrate deploy
```

against the configured `DIRECT_URL`.

## Important Deployment Files

Commit:

``` text
prisma/schema.prisma
prisma/migrations/
prisma/seed.ts
prisma7.config.ts
package.json
package-lock.json
lib/db.ts
```

Do not commit:

``` text
.env
.env.local
generated/
.next/
node_modules/
```

The generated Prisma client is recreated during the build.

------------------------------------------------------------------------

# Development Principles

The project intentionally avoids unnecessary complexity.

## Separation of Concerns

UI, API, business logic, and persistence are separated:

``` text
UI
 ↓
API
 ↓
Repository
 ↓
Prisma
 ↓
PostgreSQL
```

## Reusable Components

Common functionality is extracted into reusable components rather than
duplicated across pages.

## Type Safety

TypeScript is used throughout the application for:

-   Users
-   Timesheets
-   Timesheet entries
-   Timesheet statuses
-   API request/response data

Prisma also provides generated types based on the database schema.

## Server-Side Authentication

Protected pages and APIs validate authentication on the server.

## Persistent Database

The application uses Prisma/PostgreSQL for persistent runtime data
rather than a local JSON database.

------------------------------------------------------------------------

# Production Improvements

Although the application now uses PostgreSQL for persistence, additional
production improvements could include:

-   Password hashing using Argon2 or bcrypt
-   Proper user authorization
-   Multi-tenant access control
-   Input validation using Zod
-   Database transactions where required
-   Audit logging
-   Rate limiting
-   Automated tests
-   Error monitoring
-   Production-grade logging
-   Improved observability
-   More granular role-based permissions

------------------------------------------------------------------------

# Implementation Status

## Authentication

-   [x] Login UI
-   [x] Credentials authentication
-   [x] Prisma user storage
-   [x] NextAuth session
-   [x] Protected dashboard
-   [x] Logout
-   [x] Authentication error handling

## Database

-   [x] Prisma 7
-   [x] PostgreSQL database
-   [x] Prisma schema
-   [x] Prisma migrations
-   [x] Prisma seed script
-   [x] Prisma PostgreSQL adapter
-   [x] JSON data converted to database seed data
-   [x] Generated Prisma client
-   [x] Database repository layer

## Timesheet API

-   [x] Get timesheets
-   [x] Get weekly entries
-   [x] Create entry
-   [x] Update entry
-   [x] Delete entry
-   [x] MISSING → INCOMPLETE transition

## Dashboard

-   [x] Table view
-   [x] Status filter
-   [x] Date range filter
-   [x] Pagination
-   [x] Responsive design
-   [x] Status-specific actions

## Weekly Timesheet

-   [x] List view
-   [x] Daily grouping
-   [x] Weekly hour calculation
-   [x] Progress indicator
-   [x] Add entry
-   [x] Edit entry
-   [x] Delete entry
-   [x] Completed read-only state

## UI / UX

-   [x] shadcn/ui components
-   [x] Sonner toast notifications
-   [x] Loading states
-   [x] Error states
-   [x] Form validation
-   [x] Responsive layout

## Quality / Deployment

-   [x] Type checking
-   [x] Production build
-   [x] Prisma Client generation
-   [x] Vercel deployment configuration
-   [ ] Automated tests
-   [ ] Production monitoring

------------------------------------------------------------------------

# License

This project was created as a take-home assignment/demo project.
