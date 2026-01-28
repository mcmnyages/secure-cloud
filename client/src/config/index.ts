// config/index.ts
export const config = {
  // Development configuration
  development: {
    apiUrl: 'http://localhost:5000/api',
  },
  
  // Production configuration
  production: {
    apiUrl: 'https://your-production-api.com/api',
  },
  
  // Test configuration
  test: {
    apiUrl: 'http://localhost:5000/api',
  },
};

// Get current environment
const getEnv = (): 'development' | 'production' | 'test' => {
  if (import.meta.env?.MODE === 'production') return 'production';
  if (import.meta.env?.MODE === 'test') return 'test';
  return 'development';
};

// Export current config based on environment
export const currentConfig = config[getEnv()];