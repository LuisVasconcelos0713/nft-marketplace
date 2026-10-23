import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import { db } from "./db";
import { SORT_OPTIONS, type ApiError } from "@/lib/contracts";

const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 24;

const fail = (error: ApiError, status: number) =>
  HttpResponse.json(error, { status });

export const handlers = [
  http.get("/api/health", () => HttpResponse.json({ ok: true })),

  /* Listagem com busca, filtros, ordenação e paginação */
  http.get("/api/nfts", async ({ request }) => {
    const params = new URL(request.url).searchParams;

    const q = (params.get("q") ?? "").trim().toLowerCase();
    const category = params.get("category");
    const network = params.get("network");
    const sort = params.get("sort") ?? "recent";
    const page = Math.max(1, Number(params.get("page")) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE),
    );

    if (!SORT_OPTIONS.some((option) => option === sort)) {
      return fail({ code: "VALIDATION", message: "Ordenação inválida" }, 400);
    }

    let list = db.nfts.filter(
      (nft) =>
        (!q ||
          nft.name.toLowerCase().includes(q) ||
          nft.collection.toLowerCase().includes(q)) &&
        (!category || nft.category === category) &&
        (!network || nft.network === network),
    );

    // ETH é string: compara com Decimal para não perder precisão
    if (sort === "price-asc") {
      list = [...list].sort((a, b) =>
        new Decimal(a.priceEth).comparedTo(b.priceEth),
      );
    }
    if (sort === "price-desc") {
      list = [...list].sort((a, b) =>
        new Decimal(b.priceEth).comparedTo(a.priceEth),
      );
    }

    const total = list.length;
    await delay(400);

    return HttpResponse.json({
      items: list.slice((page - 1) * pageSize, page * pageSize),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  }),

  /* Detalhe por identificador */
  http.get("/api/nfts/:id", async ({ params }) => {
    await delay(300);
    const nft = db.nfts.find((item) => item.id === params.id);
    if (!nft) {
      return fail({ code: "NOT_FOUND", message: "NFT não encontrado" }, 404);
    }
    return HttpResponse.json(nft);
  }),
];
