import type { Post } from './types';

const DEMO_POSTS_URL =
  'https://jsonplaceholder.typicode.com/posts?_limit=5';

/**
 * Demo-only: for your API use `import { API_URL } from '@env'`
 * and `fetch(\`${API_URL}/posts\`)`.
 */
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(DEMO_POSTS_URL);
  if (!response.ok) {
    throw new Error(`Posts failed: ${response.status}`);
  }
  return response.json() as Promise<Post[]>;
}
