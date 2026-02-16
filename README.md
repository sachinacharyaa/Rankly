# Rankly Landing

Single-page React + Tailwind landing page for automated inbox prioritization.

## Product promise

> See your top 3 work priorities each day — automatically ranked from your inbox.

## Getting started

1. Install dependencies (run in `d:\\Rankly`):

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

Then edit `.env` and replace `<db_password>` in `MONGODB_URI`.

3. Start the app (client + API):

```bash
npm run dev
```

4. Open the URL that Vite prints in your terminal (usually `http://localhost:5173`).

## What&apos;s included

- React single-page app (`src/App.jsx`, `src/main.jsx`)
- Tailwind CSS setup (`tailwind.config.js`, `postcss.config.cjs`, `src/index.css`)
- Blurry blue / red / pink / cream background hero
- Clear headline, problem section, and solution visual
- Waitlist form with &quot;Join beta&quot; CTA (saves emails to MongoDB via `server/index.js`)

