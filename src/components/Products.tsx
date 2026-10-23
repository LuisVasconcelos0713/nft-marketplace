import { useState } from "react";
import { mockNFTs } from "../data/nfts";
import NftCard from "../components/NftCard";

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

function Products() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const filteredNFTs = mockNFTs
    .filter((nft) => !category || nft.category === category)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <main className="mx-auto lg:min-h-screen w-full max-w-7xl px-4 py-8 text-[#F5F1EB] md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[168px_minmax(0,1fr)] md:gap-7">
        {/* SIDEBAR */}
        <aside className="space-y-3">
          <div className="bg-[#241610] p-4 font-mono text-[10px]">
            <h2 className="mb-3 text-xs font-bold">Coleções</h2>

            <div className="space-y-3">
              {categories.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setCategory(category === name ? "" : name);
                    setPage(1);
                  }}
                  className={`flex w-full items-center justify-between gap-2 text-left transition-colors ${
                    category === name
                      ? "text-[#E89B55]"
                      : "text-[#BFA68A] hover:text-[#F5F1EB]"
                  }`}
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
                onClick={() => setCategory("")}
                className="mt-3 rounded bg-[#D28A4C] px-3 py-1.5 font-bold text-[#140D0A] hover:bg-[#E5A264]"
              >
                Aplicar
              </button>
            </div>

            <div className="border-t border-[#493025] pt-4">
              <h3 className="mb-3 text-xs font-bold">Rede</h3>
              <div className="space-y-3">
                {networks.map(([name, count]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-2 text-[#BFA68A]"
                  >
                    <span>{name}</span>
                    <span>({count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Oferta em destaque */}
          <div className="bg-[#241610] pt-4">
            <h2 className="px-3 font-mono text-xs font-bold uppercase text-[#E89B55]">
              NFT em destaque
            </h2>
            <p className="mb-2 mt-2 text-center text-xs font-bold">
              Oferta limitada
            </p>
            <img
              src={mockNFTs[1].image}
              alt={mockNFTs[1].name}
              loading="lazy"
              className="aspect-square w-full rounded-t-xl object-cover"
            />
          </div>
        </aside>

        {/* CATÁLOGO */}
        <section id="mercado" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px]">
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  setSort("recent");
                  setPage(1);
                }}
                className="border-b-2 border-[#E89B55] pb-2 text-[#E89B55]"
              >
                Todos os NFTs
              </button>
              <button
                type="button"
                onClick={() => setSort("recent")}
                className="pb-2 text-[#F5F1EB] hover:text-[#E89B55]"
              >
                Novos lançamentos
              </button>
              <button
                type="button"
                onClick={() => setSort("price-desc")}
                className="pb-2 text-[#F5F1EB] hover:text-[#E89B55]"
              >
                Em alta
              </button>
            </div>

            <label className="flex items-center gap-2 text-[#BFA68A]">
              <span>Ordenar por:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="max-w-[155px] bg-transparent text-[#F5F1EB] outline-none"
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

          {filteredNFTs.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:gap-x-4 lg:gap-x-6">
              {filteredNFTs.map((nft) => (
                <NftCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center font-mono text-sm text-[#BFA68A]">
              Nenhum NFT encontrado nesta categoria.
            </p>
          )}

          {/* Paginação visual */}
          <div className="mt-10 flex justify-center gap-2 md:justify-end">
            {[1, 2, 3, 4].map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                className={`h-7 min-w-7 rounded border px-2 font-mono text-xs ${
                  page === number
                    ? "border-[#D28A4C] bg-[#D28A4C] text-[#140D0A]"
                    : "border-[#493025] text-[#F5F1EB] hover:border-[#D28A4C]"
                }`}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(4, current + 1))}
              aria-label="Próxima página"
              className="h-7 rounded border border-[#493025] px-2 text-xs hover:border-[#D28A4C]"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Products;
