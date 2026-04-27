# Deuka Auth Module

The secure authentication and user management core for the Deuka platform.

## Status
**MVP:** Functional Login and Register flows with accessibility compliance.

## Tech Stack
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router

## Development Conventions (Strict)
To ensure long-term maintainability, adhere to these rules:

1.  **Naming:**
    * Components/Pages: `PascalCase` (e.g., `Login.tsx`)
    * Hooks/Utils: `camelCase` (e.g., `useAuth.ts`)
2.  **Export Style:**
    * Every component must use `export default function ComponentName() { ... }`. 
    * No mixed named/default exports.
3.  **Styling:**
    * Use Tailwind CSS. 
    * Avoid hardcoded values; use configuration tokens where possible.
    * Consistency is non-negotiable: all inputs and buttons follow the `rounded-lg` radius standard.
4.  **Accessibility:**
    * Every `<input>` must have a corresponding `<label>` linked via `htmlFor`/`id`.
    * Include `name` attributes for all form fields.

## Folder Structure
* `src/layouts`: Persistent wrappers (e.g., `AuthLayout`).
* `src/pages`: Route-specific views (e.g., `Login`, `Register`).
* `src/components`: Reusable UI units.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install