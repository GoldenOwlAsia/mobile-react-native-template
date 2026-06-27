import { useQuery } from '@tanstack/react-query';

import { fetchPosts } from './api';
import { postKeys } from './keys';

export function usePostsQuery() {
  return useQuery({
    queryKey: postKeys.list(),
    queryFn: fetchPosts,
    staleTime: 60_000,
  });
}
