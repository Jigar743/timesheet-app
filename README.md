# Ticktock - Timesheet Management App

A SaaS-style Timesheet Management application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, NextAuth, and lowdb.

The application allows authenticated users to view and manage weekly timesheets, track daily work entries, and monitor weekly working hours.

---

## Features

### Authentication

- Email and password login
- Credentials-based authentication using NextAuth
- JWT-based sessions
- Protected dashboard
- Invalid credential handling
- Logout support

### Timesheet Dashboard

- View all weekly timesheets
- View timesheet status
- Filter by date range
- Filter by status
- Pagination
- Status-based actions

### Weekly Timesheet

- View entries grouped by day
- Display weekly total hours
- 40-hour weekly progress
- Add new task
- Edit existing task
- Delete task
- Responsive layout

### Timesheet Status

The application supports three statuses:

- `COMPLETED`
- `INCOMPLETE`
- `MISSING`

A missing timesheet becomes incomplete when the first task is successfully created.

```text
MISSING
   |
   | Add first task
   v
INCOMPLETE
```

Completed timesheets are read-only.

```text
COMPLETED
   |
   └── View only
```

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework |
| TypeScript | Type safety |
| React | UI development |
| Tailwind CSS | Styling |
| shadcn/ui | Reusable UI components |
| NextAuth | Authentication and sessions |
| lowdb | JSON-based persistence |
| ESLint | Code quality |

---

# Project Setup

## Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm

Check your versions:

```bash
node -v
npm -v
```

## Create the Project

```bash
npx create-next-app@latest timesheet-app
```

Recommended options:

```text
TypeScript          Yes
ESLint              Yes
Tailwind CSS        Yes
src/ directory      No
App Router          Yes
Turbopack           Yes
Import alias        Yes
```

Move into the project:

```bash
cd timesheet-app
```

## Install Dependencies

```bash
npm install
```

Install authentication and JSON persistence:

```bash
npm install next-auth lowdb
```

Initialize shadcn/ui:

```bash
npx shadcn@latest init
```

Install required UI components:

```bash
npx shadcn@latest add button input label dialog select popover calendar table dropdown-menu badge textarea
```

---

# Environment Variables

Create a `.env.local` file in the project root:

```env
AUTH_SECRET=your-development-secret
```

For production, use a strong randomly generated secret and configure it through the deployment platform's environment variables.

Do not commit `.env.local` to the repository.

---

# Run the Application

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

---

# Demo Credentials

The application currently uses dummy credentials stored in:

```text
data/users.json
```

Example:

```text
Email: john@example.com
Password: password123
```

These credentials are intended only for the take-home assignment.

In a production application, passwords should never be stored as plaintext. Password hashing would be implemented using a secure hashing algorithm such as Argon2 or bcrypt.

---

# Project Structure

```text
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
│   ├── login-form.tsx
│   ├── timesheet-table.tsx
│   ├── timesheet-list.tsx
│   ├── entry-modal.tsx
│   └── ui/
│
├── data/
│   ├── users.json
│   ├── timesheets.json
│   └── entries.json
│
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── users.ts
│   ├── timesheets.ts
│   └── entries.ts
│
├── types/
│   └── timesheet.ts
│
├── .env.local
├── package.json
└── README.md
```

---

# Architecture

The application follows a layered architecture to keep the UI, API, business logic, and data persistence separated.

```text
┌─────────────────────────┐
│       React UI          │
│ Pages + Components      │
└────────────┬────────────┘
             │
             │ fetch()
             ▼
┌─────────────────────────┐
│    Next.js API Routes   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     Repository Layer    │
│ users / timesheets /    │
│ entries                 │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│          lowdb          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       JSON Files        │
│ users.json              │
│ timesheets.json         │
│ entries.json            │
└─────────────────────────┘
```

The client never directly accesses the JSON files.

All client-side data operations go through internal Next.js API routes.

---

# Data Storage

For this take-home assignment, a traditional database is intentionally not used.

The application uses three separate JSON files:

```text
data/
├── users.json
├── timesheets.json
└── entries.json
```

Keeping these files separate makes the data easier to understand and allows each data source to be replaced independently in the future.

---

## users.json

Stores users used for authentication.

Example:

```json
[
  {
    "id": "user-1",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
]
```

---

## timesheets.json

Stores weekly timesheet information.

Example:

```json
[
  {
    "id": "week-1",
    "weekNumber": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-01-05",
    "status": "COMPLETED"
  },
  {
    "id": "week-2",
    "weekNumber": 2,
    "startDate": "2024-01-08",
    "endDate": "2024-01-12",
    "status": "INCOMPLETE"
  },
  {
    "id": "week-3",
    "weekNumber": 3,
    "startDate": "2024-01-15",
    "endDate": "2024-01-19",
    "status": "MISSING"
  }
]
```

This data powers the dashboard/table view.

---

## entries.json

Stores individual work entries.

Example:

```json
[
  {
    "id": "entry-1",
    "timesheetId": "week-1",
    "date": "2024-01-01",
    "project": "Project Alpha",
    "workType": "Development",
    "description": "Homepage development",
    "hours": 4
  }
]
```

Each entry belongs to a weekly timesheet through `timesheetId`.

```text
timesheets.json

week-1
  |
  ├── entry-1
  ├── entry-2
  └── entry-3
```

---

# Why lowdb?

`lowdb` is used as a lightweight JSON database for this assignment.

Instead of manually reading and writing JSON files throughout the application, the repository layer uses lowdb to manage the data.

The persistence implementation is isolated from the UI and API layers.

```text
React Component
      |
      v
API Route
      |
      v
Repository
      |
      v
lowdb
      |
      v
JSON File
```

This makes it easier to replace the persistence layer later.

Current implementation:

```text
API
 ↓
Repository
 ↓
lowdb
 ↓
JSON
```

Possible production implementation:

```text
API
 ↓
Repository
 ↓
Prisma
 ↓
PostgreSQL
```

The UI and API contracts can remain largely unchanged.

---

# Authentication Implementation

Authentication is implemented using NextAuth's Credentials Provider.

The authentication flow is:

```text
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
│   users.json     │
└────────┬─────────┘
         │
     ┌───┴────┐
     │        │
   Valid    Invalid
     │        │
     ▼        ▼
  Session   Error
     │
     ▼
 /dashboard
```

The login form uses:

```ts
signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

Authentication configuration is located in:

```text
lib/auth.ts
```

The NextAuth API route is located in:

```text
app/api/auth/[...nextauth]/route.ts
```

---

# Session Protection

Protected pages validate the authenticated session on the server.

Example:

```ts
const session = await getServerSession(authOptions);

if (!session?.user) {
  redirect("/login");
}
```

This prevents unauthenticated users from directly accessing protected dashboard pages.

Protected API routes will also validate the session before allowing data operations.

---

# Application Pages

## Login

Route:

```text
/login
```

The login page contains:

- Email input
- Password input
- Remember me checkbox
- Sign in button
- Loading state
- Authentication error state

After successful authentication:

```text
/login
   ↓
Authentication
   ↓
/dashboard
```

---

## Dashboard / Table View

Route:

```text
/dashboard
```

The dashboard provides an overview of all weekly timesheets.

Example:

```text
Your Timesheets

Date Range        Status

Week #   Date              Status       Action

1        Jan 01 - Jan 05   COMPLETED    View
2        Jan 08 - Jan 12   INCOMPLETE   Update
3        Jan 15 - Jan 19   MISSING      Create
```

The dashboard supports:

- Date range filtering
- Status filtering
- Pagination
- Status-specific actions

---

## Weekly Timesheet / List View

Route:

```text
/dashboard/[timesheetId]
```

This page displays the entries belonging to a specific week.

Entries are grouped by date.

Example:

```text
This week's timesheet

Jan 15 - Jan 19

20 / 40 hrs

Jan 15

Development                       4h
Homepage implementation

Bug fixes                         4h
Fixed authentication issue

+ Add new task


Jan 16

Development                       8h
API implementation

+ Add new task
```

---

# Timesheet Status

The application supports three statuses.

## MISSING

A week has no timesheet entries.

Example:

```text
MISSING
Create
```

Clicking `Create` opens the weekly timesheet.

When the first task is successfully created:

```text
MISSING → INCOMPLETE
```

The status transition is handled by the server.

---

## INCOMPLETE

A week has one or more entries but is not completed.

The user can:

- Add entries
- Edit entries
- Delete entries

The dashboard action is:

```text
INCOMPLETE → Update
```

---

## COMPLETED

A completed timesheet is read-only.

The user can view the timesheet but cannot:

- Add entries
- Edit entries
- Delete entries

The dashboard action is:

```text
COMPLETED → View
```

---

# Entry Management

The application uses one reusable entry modal for both creating and editing entries.

## Add Entry

```text
Add New Entry

Select Project *
Type of Work *
Task description *
Hours *

[ Add entry ] [ Cancel ]
```

## Edit Entry

The same component is populated with the selected entry:

```text
Edit Entry

Select Project *
Type of Work *
Task description *
Hours *

[ Update entry ] [ Cancel ]
```

The date is determined by the day from which the user clicks:

```text
+ Add new task
```

Therefore, the entry modal does not need a separate date field.

---

# API Design

All client-side timesheet operations use internal Next.js API routes.

## Get Timesheets

```http
GET /api/timesheets
```

Returns the available weekly timesheets.

---

## Get Weekly Entries

```http
GET /api/timesheets/:timesheetId/entries
```

Returns entries belonging to the selected timesheet.

---

## Create Entry

```http
POST /api/timesheets/:timesheetId/entries
```

Creates a new work entry.

If the selected timesheet is currently `MISSING`, the API changes the status to:

```text
MISSING → INCOMPLETE
```

after the entry is successfully created.

---

## Update Entry

```http
PUT /api/timesheets/:timesheetId/entries/:entryId
```

Updates an existing work entry.

---

## Delete Entry

```http
DELETE /api/timesheets/:timesheetId/entries/:entryId
```

Deletes an existing work entry.

---

# API Request Flow

Example: adding a new task.

```text
User clicks "+ Add new task"
          |
          ▼
     Entry Modal
          |
          | POST
          ▼
/api/timesheets/week-3/entries
          |
          ▼
   Validate Session
          |
          ▼
   Validate Request
          |
          ▼
    Entry Repository
          |
          ▼
      entries.json
          |
          ▼
Is timesheet MISSING?
          |
         Yes
          |
          ▼
    Update Timesheet
          |
          ▼
 timesheets.json
          |
          ▼
MISSING → INCOMPLETE
          |
          ▼
    API Response
          |
          ▼
       Update UI
```

---

# Validation

Both client-side and server-side validation are used.

Required fields:

- Project
- Type of Work
- Task Description
- Hours

Hours must be a valid positive number.

Server-side validation is important because client-side validation alone cannot be trusted.

---

# UI Components

The application uses reusable shadcn/ui components where appropriate.

Examples:

- Button
- Input
- Label
- Dialog
- Select
- Popover
- Calendar
- Table
- Dropdown Menu
- Badge
- Textarea

Application-specific components are kept separate from the reusable shadcn/ui components.

---

# Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile

The dashboard table and weekly timesheet views adapt to smaller screen sizes.

---

# Loading and Error States

API operations provide loading and error feedback.

Examples:

```text
Loading timesheets...
```

```text
Unable to load timesheets.

[ Try again ]
```

During an entry operation:

```text
Saving entry...
```

The UI should not silently fail when an API request encounters an error.

---

# Development Principles

The project intentionally avoids unnecessary complexity.

## Separation of Concerns

UI, API, business logic, and persistence are separated.

```text
UI
 ↓
API
 ↓
Repository
 ↓
Data
```

## Reusable Components

Common functionality is extracted into reusable components rather than duplicated across pages.

## Type Safety

TypeScript types are used for:

- Users
- Timesheets
- Timesheet entries
- Timesheet statuses
- API request/response data

## Server-Side Authentication

Protected pages and APIs validate authentication on the server.

## Simple Persistence

JSON + lowdb is used because this is a small take-home assignment and does not require introducing a full database.

---

# Production Improvements

The current JSON/lowdb implementation is intended for this assignment and local/demo use.

A production implementation would replace the JSON persistence layer with a proper persistent database.

For example:

```text
Next.js
   |
   ▼
API Routes
   |
   ▼
Repository / Service Layer
   |
   ▼
Prisma
   |
   ▼
PostgreSQL
```

Other production improvements would include:

- Password hashing using Argon2 or bcrypt
- Database-backed user management
- Proper user authorization
- Multi-tenant access control
- Input validation using Zod
- Database transactions
- Audit logging
- Rate limiting
- Automated tests
- Error monitoring
- Production-grade logging
- Persistent cloud storage

---

# Deployment Consideration

The application currently uses JSON files for persistence.

A serverless deployment may use an ephemeral filesystem, which means modifications to JSON files may not persist between instances or deployments.

For a production deployment, the persistence layer should therefore be replaced with a hosted database or deployed to an environment that provides persistent storage.

The repository abstraction makes this migration easier because the UI does not directly depend on the JSON implementation.

---

# Available Scripts

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

Run ESLint:

```bash
npm run lint
```

---

# Implementation Status

## Authentication

- [x] Login UI
- [x] Credentials authentication
- [x] JSON user storage
- [x] NextAuth session
- [x] Protected dashboard

## Timesheet API

- [ ] Get timesheets
- [ ] Get weekly entries
- [ ] Create entry
- [ ] Update entry
- [ ] Delete entry
- [ ] MISSING → INCOMPLETE transition

## Dashboard

- [ ] Table View
- [ ] Status filter
- [ ] Date range filter
- [ ] Pagination
- [ ] Responsive design

## Weekly Timesheet

- [ ] List View
- [ ] Daily grouping
- [ ] Weekly hour calculation
- [ ] Progress indicator
- [ ] Add entry
- [ ] Edit entry
- [ ] Delete entry
- [ ] Completed read-only state

## Quality

- [ ] Loading states
- [ ] Error states
- [ ] Validation
- [ ] Tests
- [ ] Production build
- [ ] Deployment

---

# License

This project was created as a take-home assignment/demo project.