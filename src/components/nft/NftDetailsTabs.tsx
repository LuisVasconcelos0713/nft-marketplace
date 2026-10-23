import { useId, useState, type KeyboardEvent } from "react";
import type { NFT } from "@/lib/schemas";
import { focusRing } from "@/lib/ui";

type TabId = "details" | "reviews";
type NftDetailsTabsProps = { nft: NFT };

const NftDetailsTabs = ({ nft }: NftDetailsTabsProps) => {
  const [active, setActive] = useState<TabId>("details");
  const baseId = useId();

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Detalhes do NFT" },
    { id: "reviews", label: `Avaliações de colecionadores (${nft.rating.count})` },
  ];

  // Setas esquerda/direita trocam de aba (padrão de acessibilidade para tabs)
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : tabs.length - 1;
    const next = tabs[(index + step) % tabs.length];
    setActive(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  const { creator } = nft;

  return (
    <section className="mt-12">
      <div role="tablist" aria-label="Informações do NFT" className="flex flex-wrap gap-x-6 border-b border-[#3A2112]">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`-mb-px border-b-2 pb-2 text-xs font-bold sm:text-sm ${
              active === tab.id
                ? "border-[#CF8A4B] text-[#CF8A4B]"
                : "border-transparent text-[#F5F1EB] hover:text-[#CF8A4B]"
            } ${focusRing}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-details`}
        aria-labelledby={`${baseId}-tab-details`}
        hidden={active !== "details"}
        className="space-y-4 pt-5 text-xs leading-relaxed text-[#B99665] sm:text-sm"
      >
        <p>{nft.description}</p>
        <p>
          A propriedade inclui a arte em alta resolução, lançamentos exclusivos para
          colecionadores e um registro permanente de procedência registrada na rede.{" "}
          {creator.name} recebe {creator.royaltyPercent}% de direitos autorais nas vendas
          secundárias, apoiando novos trabalhos e lançamentos da comunidade.
        </p>

        <dl className="space-y-4">
          <div>
            <dt className="font-bold text-[#F5F1EB]">Rede:</dt>
            <dd>
              Cunhado na {nft.network} com procedência imutável e metadados armazenados no
              IPFS.
            </dd>
          </div>
          <div>
            <dt className="font-bold text-[#F5F1EB]">Contrato:</dt>
            <dd>{creator.walletAddress} · Contrato inteligente ERC-721 verificado.</dd>
          </div>
          <div>
            <dt className="font-bold text-[#F5F1EB]">Direitos autorais:</dt>
            <dd>
              Direitos autorais do criador: {creator.royaltyPercent}% nas vendas secundárias,
              pagos automaticamente pelos mercados compatíveis.
            </dd>
          </div>
        </dl>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-reviews`}
        aria-labelledby={`${baseId}-tab-reviews`}
        hidden={active !== "reviews"}
        className="space-y-2 pt-5 text-xs leading-relaxed text-[#B99665] sm:text-sm"
      >
        <p>
          Nota média de {nft.rating.average.toLocaleString("pt-BR")} de 5, com{" "}
          {nft.rating.count} avaliações de colecionadores.
        </p>
        {/* Avaliações individuais estão fora do escopo do desafio */}
        <p>As avaliações individuais não estão disponíveis nesta demonstração.</p>
      </div>
    </section>
  );
};

export default NftDetailsTabs;
