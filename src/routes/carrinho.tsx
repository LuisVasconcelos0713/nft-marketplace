import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { nftQueryOptions, nftsQueryOptions } from "@/api/nftsApi";
import { useCart } from "@/lib/cart";
import CartRow from "@/components/cart/CartRow";
import CartSummary from "@/components/cart/CartSummary";
import Footer from "@/components/Footer";
import RelatedNfts from "@/components/nft/RelatedNfts";
import { focusRing } from "@/lib/ui";

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
});

function CartPage() {
  const { items } = useCart();

  const results = useQueries({
    queries: items.map((item) => nftQueryOptions(item.nftId)),
  });

  const loading = results.some((result) => result.isPending);

  const subtotal = items.reduce((sum, item, index) => {
    const nft = results[index]?.data;
    return nft ? sum.plus(new Decimal(nft.priceEth).times(item.quantity)) : sum;
  }, new Decimal(0));

  const relatedQuery = useQuery(nftsQueryOptions({ pageSize: 9 }));
  const cartIds = new Set(items.map((item) => item.nftId));
  const related =
    relatedQuery.data?.items.filter((item) => !cartIds.has(item.id)) ?? [];

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 font-mono text-[#F5F1EB]">
        <nav
          aria-label="Trilha de navegação"
          className="text-xs text-[#B99665]"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link
                to="/"
                className={`hover:text-[#CF8A4B] hover:underline ${focusRing}`}
              >
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>Mercado</li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Carrinho</li>
          </ol>
        </nav>

        <h1 className="sr-only">Carrinho</h1>

        <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,1fr)_300px]">
          <section aria-label="Itens do carrinho" className="min-w-0">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg font-bold">Seu carrinho está vazio</p>
                <p className="mt-2 text-sm text-[#B99665]">
                  Explore o mercado e adicione NFTs à sua coleção.
                </p>
                <Link
                  to="/"
                  className={`mt-6 inline-block rounded bg-[#CF8A4B] px-6 py-2 text-xs font-bold uppercase text-[#26180F] hover:bg-[#E0A066] ${focusRing}`}
                >
                  Explorar o mercado
                </Link>
              </div>
            ) : (
              <>
                {/* Cabeçalho da tabela (só no desktop; no mobile cada linha tem seus rótulos) */}
                <div
                  aria-hidden="true"
                  className="hidden gap-3 border-b border-[#3A2112] px-3 pb-2 text-xs font-bold md:grid md:grid-cols-[minmax(0,2.4fr)_1fr_1.2fr_1fr_auto]"
                >
                  <span>NFTs</span>
                  <span>Preço</span>
                  <span>Edições</span>
                  <span>Total</span>
                  <span className="w-8" />
                </div>

                <ul className="mt-3 space-y-2">
                  {items.map((item) => (
                    <CartRow
                      key={item.nftId}
                      nftId={item.nftId}
                      quantity={item.quantity}
                    />
                  ))}
                </ul>
              </>
            )}
          </section>

          <CartSummary
            subtotal={subtotal}
            hasItems={items.length > 0}
            loading={loading}
          />

          {/* Ocupa a largura toda, abaixo das duas colunas */}
          <div className="min-w-0 md:col-span-2">
            <RelatedNfts items={related} />
          </div>
        </div>
      </div>

      {/* Fora do container de largura máxima, para o rodapé ocupar a tela toda.
          Se o Footer já está no __root.tsx, apague esta linha para não duplicar. */}
      <Footer />
    </>
  );
}
