# DEUKA

DEUKA is a German vocabulary mastery application designed for 
learners who want genuine retention, not passive exposure. 
Built on a strict progression architecture called the Centurion 
System, the app covers A1 through B2 level vocabulary — 
approximately 4,500 words — and enforces mastery at every step 
before allowing the user to advance.

---

## The Centurion System

Vocabulary in DEUKA is not presented as a flat list. It is 
organized into a three-tier hierarchy designed to make large 
learning goals feel achievable while maintaining rigorous 
standards for progression.

| Unit | Composition | Size |
|---|---|---|
| Bucket | 10 words | Atomic unit of learning |
| Centurion | 10 Buckets | 100 words |
| Level | Multiple Centurions | A1=700 / A2=500 / B1=1000 / B2=2000 |

### Progression Logic

The user moves through the curriculum one bucket at a time. 
Advancement is never automatic — it is earned.

**Within a Bucket:**
1. The user generates words one at a time from the current bucket
2. For each word, they can reveal the translation and an example sentence
3. Once all 10 words have been seen, the Next button unlocks
4. Clicking Next takes the user to the Quiz Gate

**The Quiz Gate:**
- The quiz presents all 10 words from the current bucket
- Each question shows the German word with 4 answer options
- The user has 5 seconds per question to select the correct answer
- A perfect score of 10/10 is required to advance
- A single wrong answer triggers an immediate fail
- On fail, the user is returned to the review loop for the same bucket
- There is no limit on attempts — but there is no shortcut either

**Bucket → Centurion → Level progression:**
```
Pass Bucket quiz → advance to next Bucket
Pass final Bucket in Centurion → advance to next Centurion, Bucket 1
Pass final Centurion in Level → Level complete → advance to next Level
```

This means a user completing A1 has passed 70 consecutive 
perfect quizzes across 7 Centurions — and genuinely knows 
700 German words.

### Quiz Distractor Design

Wrong answer options are not random. They are selected based 
on semantic and orthographic similarity to the correct answer:

- If the word is a verb, all four options are verbs
- If the word shares a prefix (ver-, be-, ent-), distractors 
  share that prefix
- Words from the same category are prioritized as distractors

This maintains medium-to-hard difficulty throughout all levels 
and prevents guessing by elimination.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | React + Vite | No SSR or SEO needs — Vite gives faster builds with zero overhead |
| Language | TypeScript (strict) | End-to-end type safety from data layer to UI |
| Styling | Tailwind CSS | Utility-first, consistent design system |
| Routing | React Router DOM | `createBrowserRouter` for centralized route config |
| Backend/Auth | Supabase | Auth + progress persistence without custom server |
| Form Logic | React Hook Form + Zod | Schema-first validation, no manual error state |
| State | Zustand | Lightweight global state for learning progress |

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── data/             # Internal vocabulary constants (A1–B2)
├── hooks/            # Custom React hooks (useAuth, useLearning)
├── layouts/          # AppLayout (authenticated), AuthLayout (public)
├── lib/              # Supabase client initialization
├── pages/            # Route-level components
├── router/           # Centralized route configuration
├── services/         # vocabularyService — data access and session logic
└── types/            # TypeScript type definitions
```

---

## Data Model

Every word in DEUKA follows a strict shape enforced by TypeScript:

```typescript
type Word = {
  id: string        // Format: "A1-1-1-1" — encodes level, centurion, bucket, position
  de: string        // German word
  en: string        // English translation
  ar: string        // Arabic translation
  sentence: string  // Example sentence in German
  category: Category
}
```

The ID format `A1-1-1-1` encodes the word's exact position in 
the curriculum, making progress tracking and filtering trivial 
without any additional lookups.

---

## Key Design Decisions

**Vite over Next.js**
DEUKA is a fully client-side application. There are no public 
pages that require indexing, no server-rendered content, and 
no SEO requirements. Next.js would add complexity with zero 
benefit. Vite was chosen deliberately.

**Internal vocabulary data over database records**
Word lists are bundled as typed TypeScript constants rather 
than fetched from a database. The vocabulary is static, 
curated content — not user-generated data. Bundling it keeps 
the app offline-capable and eliminates unnecessary network 
requests for content that never changes.

**Zod + React Hook Form**
Schema-first validation ensures type safety from form input 
through to the Supabase auth call. Error states are derived 
from the schema, not managed manually.

**ID format as coordinates**
The word ID `A1-1-1-4` is not just a unique identifier — it 
is a set of coordinates. It encodes level (A1), centurion (1), 
bucket (1), and position (4). This makes progress tracking, 
filtering, and debugging significantly easier than opaque 
numeric IDs.

**Zustand for global state**
Learning progress, current position in the curriculum, and 
seen word tracking are managed via Zustand. Lightweight, 
no boilerplate, and easy to persist to Supabase when the 
backend integration phase begins.

**Auth architecture**
Session management is handled by a custom `useAuth` hook 
built on Supabase's `onAuthStateChange`. User metadata 
(display name) is stored directly in the Supabase Auth 
schema, avoiding a separate profiles table for now.

---

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- A Supabase project with Email auth enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/KarimElGuerzyfy/deuka-app.git
cd deuka-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Add your Supabase credentials to `.env`:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```bash
# Start the development server
npm run dev
```

---

## Build Status

| Phase | Description | Status |
|---|---|---|
| 1 | Foundation — routing, auth, layouts | ✅ Complete |
| 2 | Data layer — type system, A1 vocabulary | ✅ Complete |
| 3 | Learning Screen — Generate/Translate/Hint loop | ✅ Complete |
| 4 | Auth & Profile — useAuth hook, name/password update, session management | ✅ Complete |
| 5 | Internationalization — language toggle, RTL groundwork for Arabic | ✅ Complete |
| 6 | Quiz Gate — timer, distractors, fail state | 🔲 Pending |
| 7 | Supabase — progress persistence, profiles | 🔲 Pending |
| 8 | Polish — responsive design, deploy to Vercel | 🔲 In Progress |
```