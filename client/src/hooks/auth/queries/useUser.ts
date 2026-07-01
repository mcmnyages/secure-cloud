import { useQuery } from '@tanstack/react-query';
import { authService } from '@/api/services/authService';

export const useUser = () => {
  const query = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
  });

  return {
    ...query,
    me: query.data,
  };
};