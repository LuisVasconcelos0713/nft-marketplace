import axios, { isAxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

export function isHttpError(error: unknown, status: number) {
  return isAxiosError(error) && error.response?.status === status;
}

export function shouldRetry(failureCount: number, error: unknown) {
  if (isAxiosError(error) && error.response && error.response.status < 500) {
    return false;
  }
  return failureCount < 2;
}
