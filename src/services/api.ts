const baseUrl = process.env.API_URL ?? '';

type RequestInitSubset = Pick<RequestInit, 'method' | 'headers' | 'body'>;

export async function apiFetch(
  path: string,
  init?: RequestInitSubset,
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const response = await fetch(url, init);
  if (response.status === 401) {
    // Handle case where status code is 401
  }
  return response;
}
