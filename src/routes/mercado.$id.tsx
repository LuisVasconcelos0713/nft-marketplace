import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nftQueryOptions, nftsQueryOptions } from "@/api/nftsApi";
import { isHttpError } from "@/lib/api";
import NftGallery from "@/components/nft/NftGallery";
import NftSummary from "@/components/nft/NftSummary";
import NftDetailsTabs from "@/components/nft/NftDetailsTabs";
import RelatedNfts from "@/components/nft/RelatedNfts";
import { focusRing } from "@/lib/ui";

export const Route = createFileRoute("/mercado/$id")({
  component: NftDetailPage,
});

function NftDetailPage() {
  const { id } = Route.useParams();
  const nftQuery = useQuery(nftQueryOptions(id));
  // Provisório: o Figma mostra itens de outras coleções. Trocar por filtro de coleção depois.
  const relatedQuery = useQuery(nftsQueryOptions({ pageSize: 9 }));

  if (nftQuery.isPending) {
    return (
      <div
        role="status"
        className="mx-auto w-full max-w-5xl px-4 py-20 text-center font-mono text-sm text-[#B99665]"
      >
        Carregando NFT…
      </div>
    );
  }

  if (nftQuery.isError) {
    const notFound = isHttpError(nftQuery.error, 404);
    return (
      <div
        role="alert"
        className="mx-auto w-full max-w-5xl px-4 py-20 text-center font-mono text-[#F5F1EB]"
      >
        <h1 className="text-2xl font-bold">
          {notFound ? "NFT não encontrado" : "Não foi possível carregar o NFT"}
        </h1>
        <p className="mt-3 text-sm text-[#B99665]">
          {notFound
            ? `Não existe nenhum item com o identificador "${id}".`
            : "Verifique sua conexão e tente novamente."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {!notFound && (
            <button
              type="button"
              onClick={() => nftQuery.refetch()}
              className={`rounded border border-[#CF8A4B] px-6 py-2 text-xs font-bold uppercase text-[#CF8A4B] hover:bg-[#CF8A4B] hover:text-[#26180F] ${focusRing}`}
            >
              Tentar novamente
            </button>
          )}
          <Link
            to="/"
            className={`rounded bg-[#CF8A4B] px-6 py-2 text-xs font-bold uppercase text-[#26180F] hover:bg-[#E0A066] ${focusRing}`}
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const nft = nftQuery.data;
  // Provisório: o schema só tem uma imagem, então a galeria repete a mesma 4 vezes.
  const images = [nft.image, nft.image, nft.image, nft.image];
  const related =
    relatedQuery.data?.items.filter((item) => item.id !== nft.id) ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 font-mono text-[#F5F1EB]">
      <nav aria-label="Trilha de navegação" className="text-xs text-[#B99665]">
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
          <li aria-current="page">Mercado</li>
        </ol>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <NftGallery key={`gallery-${nft.id}`} name={nft.name} images={images} />
        <NftSummary key={`summary-${nft.id}`} nft={nft} />
      </div>

      <NftDetailsTabs key={`tabs-${nft.id}`} nft={nft} />
      <RelatedNfts items={related} />
    </div>
  );
}
