import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_URL } from '@env';

type AccessTokenGetter = () => string | null | undefined;

let accessTokenGetter: AccessTokenGetter | null = null;

/**
 * Register a function that returns the current access token.
 * Call once at app startup, for example from `App.tsx`:
 *
 * ```ts
 * setAccessTokenGetter(() => useAuthStore.getState().accessToken);
 * ```
 */
export function setAccessTokenGetter(getter: AccessTokenGetter): void {
  accessTokenGetter = getter;
}

export const apiClient = axios.create({
  baseURL: API_URL || undefined,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = accessTokenGetter?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle global errors here, e.g. sign out on 401 or refresh tokens.
    return Promise.reject(error);
  },
);
