import { Link, createFileRoute } from "@tanstack/react-router";
import { mockNFTs } from "@/data/nfts";
import NftGallery from "@/components/nft/NftGallery";
import NftSummary from "@/components/nft/NftSummary";
import NftDetailsTabs from "@/components/nft/NftDetailsTabs";
import RelatedNfts from "@/components/nft/RelatedNfts";
import { focusRing } from "@/lib/ui";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/mercado/$id")({
  component: NftDetailPage,
});

function NftDetailPage() {
  const { id } = Route.useParams();
  // Temporário: lê do mock. Na etapa de dados vira useQuery + MSW.
  const nft = mockNFTs.find((item) => item.id === id);

  // NFT inexistente (acesso direto a um id que não existe)
  if (!nft) {
    return (
      <div className="mx-auto w-full h-full min-h-svh bg-[#140d0A] max-w-5xl px-4 py-20 text-center font-mono text-[#F5F1EB]">
        <h1 className="text-2xl font-bold">NFT não encontrado</h1>
        <p className="mt-3 text-sm text-[#B99665]">
          Não existe nenhum item com o identificador "{id}".
        </p>
        <Link
          to="/"
          className={`mt-6 inline-block rounded bg-[#CF8A4B] px-6 py-2 text-xs font-bold uppercase text-[#26180F] hover:bg-[#E0A066] ${focusRing}`}
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  // Provisório: o schema só tem uma imagem, então a galeria repete a mesma 4 vezes.
  const images = [nft.image, nft.image, nft.image, nft.image];
  // Provisório: o Figma mostra itens de outras coleções. Trocar por filtro de coleção com a API.
  const related = mockNFTs.filter((item) => item.id !== nft.id);

  return (
    <div className="mx-auto w-full h-full min-h-svh  bg-[#140d0A] max-w-5xl px-4 py-8 font-mono text-[#F5F1EB]">
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

      {/* key = id: ao navegar de um NFT para outro, o estado local (quantidade, edição, foto) reinicia */}
      <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <NftGallery key={`gallery-${nft.id}`} name={nft.name} images={images} />
        <NftSummary key={`summary-${nft.id}`} nft={nft} />
      </div>

      <NftDetailsTabs key={`tabs-${nft.id}`} nft={nft} />
      <RelatedNfts items={related} />
      <Footer></Footer>
    </div>
  );
}
