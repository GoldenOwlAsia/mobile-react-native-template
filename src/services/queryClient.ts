import { QueryClient } from '@tanstack/react-query';

/**
 * Single app-wide client. For tests, create a new QueryClient per suite to avoid
 * shared cache between cases.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});
