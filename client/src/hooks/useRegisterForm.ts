// hooks/useRegisterForm.ts
import { useState, useCallback } from 'react';
import { useRegisterMutation } from './useAuthMutations';
import { useValidation } from './useValidation';
import { authValidators } from '../utils/validators';
import { useToast } from './useToast';
import type { RegisterData } from '../types/authTypes';

interface UseRegisterFormReturn {
  formData: RegisterData & { confirmPassword: string };
  errors: Record<string, string>;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: RegisterData & { confirmPassword: string } = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const useRegisterForm = (): UseRegisterFormReturn => {
  const [formData, setFormData] = useState(initialFormData);
  
  const { mutate: register, isPending: isLoading } = useRegisterMutation();
  const toast = useToast();
  
  const {
    errors,
    validateForm,
    handleBlur: handleValidationBlur,
    resetErrors: resetValidation,
    setErrors,
  } = useValidation({
    initialValues: initialFormData,
    validators: {
      name: authValidators.name,
      email: authValidators.email,
      password: authValidators.password,
      confirmPassword: (value, formValues) => 
        authValidators.confirmPassword(value, formValues),
    },
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleValidationBlur(name, value);
  }, [handleValidationBlur, formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateForm(formData);
    
    if (!isValid) {
      // Show first error as toast
      const firstError = Object.values(validationErrors).find(error => error);
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    // Prepare data for API (remove confirmPassword)
    const { confirmPassword, ...apiData } = formData;

    // Register user
    register(apiData, {
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        
        // Show error toast
        toast.error(message);
        
        // Set server errors on specific fields
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      },
    });
  }, [formData, validateForm, register, toast, setErrors]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    resetValidation();
  }, [resetValidation]);

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};