# DEUKA

A German vocabulary mastery app built on the Centurion system — 
a structured learning architecture that forces active recall 
through timed quizzes and a strict 10/10 progression gate.

## Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Auth:** Supabase
- **Form Logic:** React Hook Form + Zod
- **Routing:** React Router DOM

## Architecture

Vocabulary is organized into a three-tier hierarchy:

- **Bucket** — 10 words, the atomic unit of learning
- **Centurion** — 10 buckets (100 words)
- **Level** — A1 / A2 / B1 / B2 (up to 4,500 words total)

To advance from one bucket to the next, the user must pass 
a timed quiz with a perfect 10/10 score. One wrong answer 
triggers an immediate fail and returns the user to the 
review loop.

## Project Structure

src/
├── components/     # Reusable UI components
├── data/           # Internal vocabulary data (A1–B2)
├── hooks/          # Custom React hooks (useAuth, etc.)
├── layouts/        # AppLayout, AuthLayout
├── lib/            # Supabase client
├── pages/          # Route-level components
├── router/         # Centralized route configuration
└── types/          # TypeScript type definitions

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- A Supabase project with auth enabled

### Installation

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file in the project root:
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4. Start the dev server:
```bash
   npm run dev
```

## Key Design Decisions

- **Vite over Next.js** — DEUKA is a client-side app with 
  no SEO requirements. Vite gives faster dev builds with 
  zero server-side overhead.
- **Internal vocabulary data** — Word lists are bundled 
  as typed TypeScript constants rather than database 
  records. This keeps the app fully functional offline 
  and eliminates unnecessary API calls for static content.
- **Zod + React Hook Form** — Schema-first validation 
  ensures type safety from form input to Supabase auth 
  call, with no manual error state management.
- **Centurion progression system** — Inspired by mastery 
  learning theory. Users cannot skip buckets or bypass 
  the quiz gate, ensuring genuine retention over 
  passive exposure.

## Roadmap

- [ ] Complete learning screen with Generate/Translate/Hint loop
- [ ] Quiz page with 5s timer and distractor generation
- [ ] User progress persistence via Supabase
- [ ] A2, B1, B2 vocabulary data
- [ ] Responsive polish and Vercel deployment