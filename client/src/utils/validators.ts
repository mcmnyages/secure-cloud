// utils/validators.ts
export const authValidators = {
  email: (value: string): string | undefined => {
    if (!value?.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },

  password: (value: string): string | undefined => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    
    // Additional validation with specific messages
    const checks = [
      { test: /[A-Z]/, message: 'Include at least one uppercase letter' },
      { test: /[a-z]/, message: 'Include at least one lowercase letter' },
      { test: /\d/, message: 'Include at least one number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'Include at least one special character' },
    ];

    const failedChecks = checks.filter(check => !check.test.test(value));
    if (failedChecks.length > 0) {
      return `Password requirements: ${failedChecks.map(c => c.message).join(', ')}`;
    }
    
    return undefined;
  },

  name: (value: string): string | undefined => {
    if (!value?.trim()) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 50) return 'Name cannot exceed 50 characters';
    return undefined;
  },

  confirmPassword: (value: string, formValues?: Record<string, any>): string | undefined => {
    if (!value) return 'Please confirm your password';
    if (formValues && value !== formValues.password) {
      return 'Passwords do not match';
    }
    return undefined;
  },

  // Async validator example (for checking if email exists)
  emailExists: async (value: string): Promise<string | undefined> => {
    if (!value) return undefined;
    
    try {
      const response = await fetch(`/api/check-email?email=${encodeURIComponent(value)}`);
      const data = await response.json();
      
      if (data.exists) {
        return 'This email is already registered';
      }
      
      return undefined;
    } catch {
      return undefined; // Don't block form on network error
    }
  },
};