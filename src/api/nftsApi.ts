import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api, shouldRetry } from "@/lib/api";
import { NftPageSchema, type NftQuery } from "@/lib/contracts";
import { NftSchema } from "@/lib/schemas";

/*
  Funções de acesso à API de NFTs.
  - passam pelo Axios (que o MSW intercepta);
  - validam a resposta com Zod: se o "servidor" mandar um formato inesperado,
    o erro aparece aqui, e não dentro de um componente;
  - repassam o `signal`: quando o filtro muda no meio de uma busca, a requisição
    antiga é cancelada e a resposta obsoleta é descartada.
*/

export async function fetchNfts(query: NftQuery, signal?: AbortSignal) {
  const { data } = await api.get("/nfts", { params: query, signal });
  return NftPageSchema.parse(data);
}

export async function fetchNft(id: string, signal?: AbortSignal) {
  const { data } = await api.get(`/nfts/${encodeURIComponent(id)}`, { signal });
  return NftSchema.parse(data);
}

/* Listagem: a chave inclui os filtros, então mudou filtro = nova busca em cache separado */
export const nftsQueryOptions = (query: NftQuery) =>
  queryOptions({
    queryKey: ["nfts", "list", query],
    queryFn: ({ signal }) => fetchNfts(query, signal),
    placeholderData: keepPreviousData, // mantém a página anterior na tela enquanto carrega a nova
    retry: shouldRetry,
  });

export const nftQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["nfts", "detail", id],
    queryFn: ({ signal }) => fetchNft(id, signal),
    retry: shouldRetry,
  });
