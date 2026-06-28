import type { AxiosRequestConfig } from 'axios';

import { apiClient } from './client';

export type RequestOptions = {
  url: string;
  config?: AxiosRequestConfig;
};

export type BodyRequestOptions<D = unknown> = RequestOptions & {
  body?: D;
};

export async function get<T>({ url, config }: RequestOptions): Promise<T> {
  const { data } = await apiClient.get<T>(url, config);
  return data;
}

export async function post<T, D = unknown>({
  url,
  body,
  config,
}: BodyRequestOptions<D>): Promise<T> {
  const { data } = await apiClient.post<T>(url, body, config);
  return data;
}

export async function put<T, D = unknown>({
  url,
  body,
  config,
}: BodyRequestOptions<D>): Promise<T> {
  const { data } = await apiClient.put<T>(url, body, config);
  return data;
}

export async function patch<T, D = unknown>({
  url,
  body,
  config,
}: BodyRequestOptions<D>): Promise<T> {
  const { data } = await apiClient.patch<T>(url, body, config);
  return data;
}

export async function del<T>({ url, config }: RequestOptions): Promise<T> {
  const { data } = await apiClient.delete<T>(url, config);
  return data;
}
