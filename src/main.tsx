import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useGameStore } from './store/useGameStore';
import './index.css';
import { inject } from '@vercel/analytics';
inject();

// Keep document direction in sync with the store
useGameStore.subscribe(
  (state) => state.displayLanguage,
  (lang) => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  },
  { fireImmediately: true }
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);