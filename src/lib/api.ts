import axios, { isAxiosError } from "axios";

/* Único cliente HTTP do app. Toda chamada REST passa por aqui (exigência do README). */
export const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

/** true se o erro é uma resposta HTTP com esse status (ex.: 404) */
export function isHttpError(error: unknown, status: number) {
  return isAxiosError(error) && error.response?.status === status;
}

/**
 * Política de retry do TanStack Query:
 * - erros 4xx (validação, não encontrado, sessão) não adianta repetir;
 * - falha de rede e 5xx tentam até 2 vezes.
 */
export function shouldRetry(failureCount: number, error: unknown) {
  if (isAxiosError(error) && error.response && error.response.status < 500) {
    return false;
  }
  return failureCount < 2;
}
