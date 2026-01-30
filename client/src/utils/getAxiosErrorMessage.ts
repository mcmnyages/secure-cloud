import axios from 'axios';

export function getAxiosErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data ||
      'Something went wrong'
    );
  }
  return 'Something went wrong';
}
