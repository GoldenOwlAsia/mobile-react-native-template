import { get } from '@/services/api';

import type { Post } from './types';

const DEMO_POSTS_URL =
  'https://jsonplaceholder.typicode.com/posts?_limit=5';

/**
 * Demo-only: for your API use `get<Post[]>({ url: '/posts' })` with `API_URL`
 * configured on the shared axios client.
 */
export async function fetchPosts(): Promise<Post[]> {
  return get<Post[]>({ url: DEMO_POSTS_URL });
}
