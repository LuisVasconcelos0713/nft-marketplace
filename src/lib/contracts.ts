import { z } from "zod";
import { NftSchema } from "./schemas";

/* ---------- Contratos da API REST de NFTs ---------- */

export const SORT_OPTIONS = ["recent", "price-asc", "price-desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** Parâmetros aceitos por GET /api/nfts */
export type NftQuery = {
  q?: string;
  category?: string;
  network?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

/** Parte da query que vive na URL da página inicial */
export type CatalogSearch = Pick<
  NftQuery,
  "q" | "category" | "network" | "sort" | "page"
>;

export const NftPageSchema = z.object({
  items: z.array(NftSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
  totalPages: z.number().int(),
});
export type NftPage = z.infer<typeof NftPageSchema>;

export const ApiErrorSchema = z.object({
  code: z.enum([
    "VALIDATION",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "NOT_FOUND",
    "CONFLICT",
    "TRANSIENT",
  ]),
  message: z.string(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

const toText = (value: unknown) =>
  (typeof value === "string" || typeof value === "number") &&
  String(value).trim()
    ? String(value)
    : undefined;

/**
 * A URL é entrada do usuário: pode vir qualquer coisa (?page=abc, ?sort=xyz).
 * Aqui valores inválidos viram "sem filtro" em vez de quebrar a página.
 */
export function parseCatalogSearch(
  search: Record<string, unknown>,
): CatalogSearch {
  const page = Number(search.page);
  return {
    q: toText(search.q),
    category: toText(search.category),
    network: toText(search.network),
    sort: SORT_OPTIONS.find((option) => option === search.sort),
    page: Number.isInteger(page) && page > 1 ? page : undefined,
  };
}
