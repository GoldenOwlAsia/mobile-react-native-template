import { get } from '@/services/api';

import type { Post } from './types';

const DEMO_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

/**
 * Demo-only. For your API, use get() with { url: '/posts' } and API_URL set on the
 * shared axios client.
 */
export async function fetchPosts(): Promise<Post[]> {
  return get<Post[]>({ url: DEMO_POSTS_URL });
}
