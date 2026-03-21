import { useQuery } from '@tanstack/react-query';

/**
 * Demo-only: copy this pattern per feature — stable query keys, async fetcher, `useQuery`.
 * For your API use `import { API_URL } from '@env'` and `fetch(\`${API_URL}/path\`)`.
 */

const DEMO_POSTS_URL =
  'https://jsonplaceholder.typicode.com/posts?_limit=5';

type DemoPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

const demoPostsKeys = {
  all: ['demoPosts'] as const,
  list: () => [...demoPostsKeys.all, 'list'] as const,
};

async function fetchPosts(): Promise<DemoPost[]> {
  const response = await fetch(DEMO_POSTS_URL);
  if (!response.ok) {
    throw new Error(`Posts failed: ${response.status}`);
  }
  return response.json() as Promise<DemoPost[]>;
}

export function usePostsQuery() {
  return useQuery({
    queryKey: demoPostsKeys.list(),
    queryFn: fetchPosts,
    staleTime: 60_000,
  });
}
