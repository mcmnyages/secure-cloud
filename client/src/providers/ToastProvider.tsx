// providers/ToastProvider.tsx
// OR
import { Toaster } from 'sonner';
// OR
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Modular classNames for scalability
const toastClassNames = {
  toast:
    'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-xl',
  description: 'group-[.toast]:text-muted-foreground',
  actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold px-3 py-1 rounded-lg',
  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-semibold px-3 py-1 rounded-lg',
  closeButton: 'group-[.toast]:hover:bg-[rgba(var(--border-rgb),0.1)] rounded-full p-1 transition-colors',
};

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      closeButton={true}
      toastOptions={{
        duration: 4000,
        classNames: toastClassNames,
      }}
      containerAriaLabel="Notifications"
    />
  );
};