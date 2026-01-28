// hooks/useLoginForm.ts
import { useState, useCallback } from 'react';
import { useLoginMutation } from './useAuthMutations';
import { useValidation } from './useValidation';
import { authValidators } from '../utils/validators';
import type { LoginCredentials } from '../types/authTypes';

interface UseLoginFormReturn {
  formData: LoginCredentials;
  errors: Record<string, string>;
  isLoading: boolean;
  serverError?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: LoginCredentials = {
  email: '',
  password: '',
};

export const useLoginForm = (): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginCredentials>(initialFormData);
  const [serverError, setServerError] = useState<string>('');
  
  const { mutate: login, isPending: isLoading, } = useLoginMutation();
  
  const { errors, validateForm, handleBlur: handleValidationBlur, resetErrors } = useValidation({
    initialValues: initialFormData,
    validators: {
      email: authValidators.email,
      password: authValidators.password,
    },
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear server error when user starts typing
    if (serverError) {
      setServerError('');
    }
  }, [serverError]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleValidationBlur(name, value);
  }, [handleValidationBlur]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    resetErrors();

    const { isValid } = validateForm(formData);
    if (!isValid) {
      return;
    }

    login(formData, {
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        
        if (error.response?.status === 401) {
          setServerError('Invalid email or password. Please check your credentials.');
        } else if (error.response?.status === 429) {
          setServerError('Too many login attempts. Please try again in a few minutes.');
        } else {
          setServerError(message);
        }
      },
    });
  }, [formData, validateForm, login, resetErrors]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    resetErrors();
    setServerError('');
  }, [resetErrors]);

  return {
    formData,
    errors,
    isLoading,
    serverError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};