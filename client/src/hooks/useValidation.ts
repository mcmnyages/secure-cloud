// hooks/useValidation.ts
import { useState, useCallback } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

interface UseValidationProps {
  initialValues: Record<string, any>;
  validators: Record<string, (value: any, formValues?: Record<string, any>) => string | undefined>;
}

export const useValidation = ({  validators }: UseValidationProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  

  const validateField = useCallback((name: string, value: any, formValues?: Record<string, any>) => {
    const validator = validators[name];
    if (validator) {
      const error = validator(value, formValues);
      setErrors(prev => ({
        ...prev,
        [name]: error ?? "",
      }));
      return !error;
    }
    return true;
  }, [validators]);

  const validateForm = useCallback((values: Record<string, any>) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validators).forEach(key => {
      const validator = validators[key];
      const error = validator(values[key], values);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [validators]);

  const handleBlur = useCallback((name: string, value: any, formValues?: Record<string, any>) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value, formValues);
  }, [validateField]);

  const resetErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
    resetErrors,
    setErrors,
  };
};