// hooks/useToast.ts
import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  icon?: React.ReactNode;
}

export const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = 'info',
    options: ToastOptions = {}
  ) => {
    const { duration = 4000, icon } = options;

    const config = {
      duration,
      ...(icon && { icon }),
    };

    switch (type) {
      case 'success':
        toast.success(message, config);
        break;
      case 'error':
        toast.error(message, config);
        break;
      case 'warning':
        toast(message, { ...config, icon: icon ?? '⚠️' });
        break;
      default:
        toast(message, config);
    }
  };

  const showPromiseToast = async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  };

  return {
    success: (msg: string, options?: ToastOptions) =>
      showToast(msg, 'success', options),
    error: (msg: string, options?: ToastOptions) =>
      showToast(msg, 'error', options),
    warning: (msg: string, options?: ToastOptions) =>
      showToast(msg, 'warning', options),
    info: (msg: string, options?: ToastOptions) =>
      showToast(msg, 'info', options),
    promise: showPromiseToast,
    dismissAll: toast.dismiss,
    dismiss: toast.dismiss,
  };
};
