import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { Router } from './router.tsx';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/Theme/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Router />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
