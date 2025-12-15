# Shah Book House — Frontend

This repository contains the frontend for the Shah Book House admin and storefront, built with Next.js (App Router) and TypeScript.

**Tech stack:** `Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `ESLint`.

**Quick overview:** the project uses the `app/` directory for routes, components live under `src/components`, hooks in `src/hooks`, and services in `src/services`.

**Prerequisites**
- **Node.js**: v18+ recommended
- **Package manager**: `npm`, `pnpm`, or `yarn`

**Install dependencies**

```powershell
npm install
```

**Environment**
Create a `.env` file at the project root (an example is already present). The app expects the following environment variables:

- `NEXT_PUBLIC_SERVER_URL`: API server base URL (example: `http://localhost:5050`)
- `NEXT_PUBLIC_FRONTEND_URL`: Frontend base URL (example: `http://localhost:5050`)


**Available scripts** (from `package.json`)

- `npm run dev` : Runs the development server (Next.js with Turbopack)
- `npm run build` : Builds the production bundle
- `npm start` : Starts the production server after building
- `npm run lint` : Runs ESLint

Run the dev server:

```powershell
npm run dev
```

Open `http://localhost:3000` (or the port shown) in your browser.

**Project structure (important folders)**

- `app/` : Next.js App Router routes and pages
- `src/components/` : Reusable UI components and feature components
- `src/hooks/` : Custom React hooks used by the app
- `src/lib/` : Utility modules and client wrappers
- `src/services/` : API service layer
- `public/` : Static assets

**Features**

- **Authentication**: Signup, login, forget-password and reset-password flows (pages under `app/(auth)`).
- **Books management**: Browse, view details, insert new books, and edit existing books (`src/components/books`, `app/books`).
- **Search & filters**: Client-side filtering, selection dialog, and templates for finding and importing books.
- **Quotations**: Create, edit, preview, and manage quotations with status badges and statistics (`src/components/quotations`, `app/quotation`).
- **Email integration**: Compose and send emails, view email list and details (`src/components/email`, `app/emails`).
- **Import / export**: Excel import utilities, template saving/selection, and bulk operations.
- **Admin & management**: Admin pages for overall management and role-aware features (`app/admin`, `app/management`).

**Notes & tips**
- The project uses Turbopack by default in dev/build scripts (see `package.json`). If you need to disable it, edit the scripts in `package.json`.
- Follow the file layout inside `src/components` to find auth forms, book-related UI, and quotation components.

---

**Developer checklist**

- **Install & setup:** `npm install` then create a `.env` (see examples above).
- **Run locally:** `npm run dev` and confirm the app loads at `http://localhost:3000`.
- **API connectivity:** Ensure `NEXT_PUBLIC_SERVER_URL` points to a running backend; verify key flows (login, list books, view a book).
