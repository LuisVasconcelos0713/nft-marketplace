import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import NftCard from "@/components/NftCard";
import { nftQueryOptions, nftsQueryOptions } from "@/api/nftsApi";
import { SORT_OPTIONS } from "@/lib/contracts";
import type { CatalogSearch } from "@/lib/contracts";
import { focusRing } from "@/lib/ui";

// Os filtros vivem na URL da rota "/" (busca, categoria, rede, ordenação e página)
const route = getRouteApi("/");

const categories = [
  ["Arte digital", 33],
  ["Fotografia", 12],
  ["Música", 65],
  ["Arte 3D", 39],
  ["Colecionáveis", 23],
  ["Generativa", 17],
  ["Jogos", 19],
  ["Assinaturas", 13],
  ["Utilidade", 18],
] as const;

const networks = [
  ["Ethereum", 119],
  ["Polygon", 78],
  ["Solana", 86],
] as const;

const gridClass =
  "grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:gap-x-4 lg:gap-x-6";

const filterClass = (active: boolean) =>
  `flex w-full items-center justify-between gap-2 text-left transition-colors ${
    active ? "text-[#E89B55]" : "text-[#BFA68A] hover:text-[#F5F1EB]"
  } ${focusRing}`;

function CatalogSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Carregando NFTs…
      </p>
      <div aria-hidden="true" className={gridClass}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="animate-pulse motion-reduce:animate-none">
            <div className="aspect-square rounded-lg bg-[#241610]" />
            <div className="mt-2 h-4 w-3/4 rounded bg-[#241610]" />
            <div className="mt-2 h-4 w-1/3 rounded bg-[#241610]" />
          </div>
        ))}
      </div>
    </>
  );
}

function Products() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { category, network, sort = "recent", page = 1 } = search;

  const catalog = useQuery(nftsQueryOptions(search));
  // Provisório: destaque fixo. Depois vira um endpoint de destaques.
  const featured = useQuery(nftQueryOptions("009")).data;

  // Mudou qualquer filtro: volta para a página 1
  const setFilters = (patch: Partial<CatalogSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch, page: undefined }) });

  const goToPage = (number: number) =>
    navigate({
      search: (prev) => ({ ...prev, page: number > 1 ? number : undefined }),
    });

  const totalPages = catalog.data?.totalPages ?? 1;

  return (
    <main className="mx-auto lg:min-h-screen w-full max-w-7xl px-4 py-8 text-[#F5F1EB] md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_minmax(0,1fr)] md:gap-7">
        {/* SIDEBAR */}
        <aside className="space-y-3">
          <div className="bg-[#241610] p-4 font-mono text-[16px]">
            <h2 className="mb-3 text-xl font-bold">Coleções</h2>

            <div className="space-y-3">
              {categories.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={category === name}
                  onClick={() =>
                    setFilters({ category: category === name ? undefined : name })
                  }
                  className={filterClass(category === name)}
                >
                  <span>{name}</span>
                  <span>({count})</span>
                </button>
              ))}
            </div>

            <div className="mb-3 mt-6 border-t border-[#493025] pt-4">
              <h3 className="mb-3 text-xs font-bold">Faixa de preço</h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D28A4C]" />
                <div className="h-1 flex-1 rounded bg-[#D28A4C]" />
                <span className="h-2 w-2 rounded-full bg-[#D28A4C]" />
              </div>
              <p className="mt-3 text-[#D0BBA3]">Preço: 0,02 – 12,30 ETH</p>
              <button
                type="button"
                onClick={() => setFilters({ category: undefined, network: undefined })}
                className={`mt-3 rounded bg-[#D28A4C] px-3 py-1.5 font-bold text-[#140D0A] hover:bg-[#E5A264] ${focusRing}`}
              >
                Aplicar
              </button>
            </div>

            <div className="border-t border-[#493025] pt-4">
              <h3 className="mb-3 text-xs font-bold">Rede</h3>
              <div className="space-y-3">
                {networks.map(([name, count]) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={network === name}
                    onClick={() =>
                      setFilters({ network: network === name ? undefined : name })
                    }
                    className={filterClass(network === name)}
                  >
                    <span>{name}</span>
                    <span>({count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Oferta em destaque */}
          {featured && (
            <div className="bg-[#241610] pt-4">
              <h2 className="px-3 font-mono text-xs font-bold uppercase text-[#E89B55]">
                NFT em destaque
              </h2>
              <p className="mb-2 mt-2 text-center text-xs font-bold">
                Oferta limitada
              </p>
              <img
                src={featured.image}
                alt={featured.name}
                loading="lazy"
                className="aspect-square w-full rounded-t-xl object-cover"
              />
            </div>
          )}
        </aside>

        {/* CATÁLOGO */}
        <section id="mercado" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 font-mono text-[18px]">
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate({ search: {} })}
                className={`border-b-2 border-[#E89B55] pb-2 text-[#E89B55] ${focusRing}`}
              >
                Todos os NFTs
              </button>
              <button
                type="button"
                onClick={() => setFilters({ sort: "recent" })}
                className={`pb-2 text-[#F5F1EB] hover:text-[#E89B55] ${focusRing}`}
              >
                Novos lançamentos
              </button>
              <button
                type="button"
                onClick={() => setFilters({ sort: "price-desc" })}
                className={`pb-2 text-[#F5F1EB] hover:text-[#E89B55] ${focusRing}`}
              >
                Em alta
              </button>
            </div>

            <label className="flex items-center gap-2 text-[#BFA68A]">
              <span>Ordenar por:</span>
              <select
                value={sort}
                onChange={(event) => {
                  const next = SORT_OPTIONS.find(
                    (option) => option === event.target.value,
                  );
                  if (next) setFilters({ sort: next });
                }}
                className={`max-w-[155px] bg-transparent text-[#F5F1EB] ${focusRing}`}
              >
                <option value="recent" className="bg-[#241610]">
                  Listados recentemente
                </option>
                <option value="price-asc" className="bg-[#241610]">
                  Menor preço
                </option>
                <option value="price-desc" className="bg-[#241610]">
                  Maior preço
                </option>
              </select>
            </label>
          </div>

          {catalog.isPending ? (
            <CatalogSkeleton />
          ) : catalog.isError ? (
            <div
              role="alert"
              className="py-12 text-center font-mono text-sm text-[#BFA68A]"
            >
              <p>Não foi possível carregar os NFTs.</p>
              <button
                type="button"
                onClick={() => catalog.refetch()}
                className={`mt-4 rounded bg-[#D28A4C] px-4 py-2 font-bold text-[#140D0A] hover:bg-[#E5A264] ${focusRing}`}
              >
                Tentar novamente
              </button>
            </div>
          ) : catalog.data.items.length > 0 ? (
            <div
              aria-busy={catalog.isPlaceholderData}
              className={`${gridClass} transition-opacity ${
                catalog.isPlaceholderData ? "opacity-60" : ""
              }`}
            >
              {catalog.data.items.map((nft) => (
                <NftCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center font-mono text-sm text-[#BFA68A]">
              Nenhum NFT encontrado com esses filtros.
            </p>
          )}

          {/* Paginação (vem da API) */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginação"
              className="mt-10 flex justify-center gap-2 md:justify-end"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                aria-label="Página anterior"
                className={`h-7 rounded border border-[#493025] px-2 text-xs hover:border-[#D28A4C] disabled:opacity-40 ${focusRing}`}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => goToPage(number)}
                    aria-label={`Página ${number}`}
                    aria-current={page === number ? "page" : undefined}
                    className={`h-7 min-w-7 rounded border px-2 font-mono text-xs ${
                      page === number
                        ? "border-[#D28A4C] bg-[#D28A4C] text-[#140D0A]"
                        : "border-[#493025] text-[#F5F1EB] hover:border-[#D28A4C]"
                    } ${focusRing}`}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                aria-label="Próxima página"
                className={`h-7 rounded border border-[#493025] px-2 text-xs hover:border-[#D28A4C] disabled:opacity-40 ${focusRing}`}
              >
                ›
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;
