import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ToastProvider } from './providers/ToastProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ToastProvider />
    <QueryProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </QueryProvider>
  </StrictMode>,
)
