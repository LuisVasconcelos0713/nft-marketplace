import { useState } from "react";
import { Heart, Mail, Minus, Plus, Star } from "lucide-react";
import type { NFT } from "@/lib/schemas";
import { LinkedinIcon, TwitterIcon } from "@/assets/SocialIcons";
import { focusRing } from "@/lib/ui";
import { addToCart, useCart } from "@/lib/cart";

type NftSummaryProps = { nft: NFT };

/* Opções de edição do Figma. A disponibilidade real por edição vem na etapa de lógica. */
const editionOptions = [
  { id: "1/1", label: "1/1" },
  { id: "1/10", label: "1/10" },
  { id: "1/50", label: "1/50" },
  { id: "open", label: "ABERTA" },
];

const roundButton = `flex h-8 w-8 items-center justify-center rounded-full bg-[#CF8A4B] text-[#26180F] transition-colors hover:bg-[#E0A066] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;
const shareLink = `inline-flex h-7 w-7 items-center justify-center rounded text-[#F5F1EB] transition-colors hover:text-[#CF8A4B] ${focusRing}`;

const NftSummary = ({ nft }: NftSummaryProps) => {
  const [edition, setEdition] = useState(
    nft.edition.isOpen ? "open" : `${nft.edition.number}/${nft.edition.total}`,
  );
  const [quantity, setQuantity] = useState(nft.minQuantity);
  const [cartMessage, setCartMessage] = useState("");
  const { quantityOf } = useCart();

  const inCart = quantityOf(nft.id);

  const handleBuy = () => {
    // Não deixa o carrinho passar do estoque disponível
    const remaining = nft.available - inCart;
    const toAdd = Math.min(quantity, remaining);

    if (toAdd <= 0) {
      setCartMessage("Você já adicionou o máximo disponível deste NFT.");
      return;
    }
    addToCart(nft.id, toAdd);
    setCartMessage(
      toAdd < quantity
        ? `Adicionamos ${toAdd} (limite de disponibilidade) ao carrinho.`
        : `${toAdd} ${toAdd === 1 ? "item adicionado" : "itens adicionados"} ao carrinho.`,
    );
  };

  const soldOut = nft.available === 0;
  const canDecrease = quantity > nft.minQuantity;
  const canIncrease = quantity < nft.available; // limite de quantidade
  const filledStars = Math.round(nft.rating.average);

  const pageUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`${nft.name} no Kurio`);

  return (
    <div className="flex flex-col gap-5">
      {/* Título, preço e nota */}
      <div>
        <h1 className="text-2xl font-bold leading-tight">{nft.name}</h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#CF8A4B]">
              {nft.priceEth} ETH
            </span>
            {nft.previousPriceEth && (
              <span className="text-xs text-[#B99665] line-through">
                <span className="sr-only">Preço anterior: </span>
                {nft.previousPriceEth} ETH
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#B99665]">
            <span
              role="img"
              aria-label={`Nota ${nft.rating.average.toLocaleString("pt-BR")} de 5`}
              className="flex gap-0.5"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 ${
                    n <= filledStars
                      ? "fill-[#CF8A4B] text-[#CF8A4B]"
                      : "text-[#6B4A2D]"
                  }`}
                />
              ))}
            </span>
            <span>{nft.rating.count} avaliações de colecionadores</span>
          </div>
        </div>
      </div>

      {/* Sobre */}
      <div>
        <p className="text-xs font-bold sm:text-sm">Sobre este NFT:</p>
        <p className="mt-1 text-xs leading-relaxed text-[#B99665] sm:text-sm">
          {nft.description}
        </p>
      </div>

      {/* Edição */}
      <fieldset className="min-w-0">
        <legend className="text-xs font-bold sm:text-sm">Edição:</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {editionOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={edition === option.id}
              onClick={() => setEdition(option.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                edition === option.id
                  ? "border-[#CF8A4B] text-[#CF8A4B]"
                  : "border-[#3A2112] text-[#F5F1EB] hover:border-[#B99665]"
              } ${focusRing}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Quantidade + ações. COMPRAR adiciona ao carrinho; Favoritar entra na etapa de lógica. */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label="Quantidade"
          className="flex items-center gap-2"
        >
          <button
            type="button"
            aria-label="Diminuir quantidade"
            disabled={!canDecrease}
            onClick={() => setQuantity((q) => q - 1)}
            className={roundButton}
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span
            aria-live="polite"
            className="min-w-6 text-center text-sm font-bold"
          >
            <span className="sr-only">Quantidade: </span>
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            disabled={!canIncrease}
            onClick={() => setQuantity((q) => q + 1)}
            className={roundButton}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={handleBuy}
          className={`rounded bg-[#CF8A4B] px-6 py-2 text-xs font-bold uppercase tracking-wide text-[#26180F] transition-colors hover:bg-[#E0A066] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          {soldOut ? "Indisponível" : "Comprar"}
        </button>

        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded border border-[#CF8A4B] px-4 py-2 text-xs text-[#CF8A4B] transition-colors hover:bg-[#CF8A4B] hover:text-[#26180F] ${focusRing}`}
        >
          <Heart aria-hidden="true" className="h-4 w-4" />
          Favoritar
        </button>
      </div>

      {/* Feedback do carrinho: role="status" faz leitores de tela anunciarem a mudança */}
      <p role="status" className="min-h-5 text-xs text-[#CF8A4B]">
        {cartMessage}
      </p>

      {/* Metadados */}
      <ul className="space-y-1 text-[11px] text-[#B99665] sm:text-xs">
        <li>ID do token: #{nft.tokenId}</li>
        <li>Coleção: {nft.collection}</li>
        <li>
          Atributos:{" "}
          {nft.attributes.map((a) => `${a.trait}: ${a.value}`).join(", ")}
        </li>
      </ul>

      {/* Compartilhar (links reais, abrem fora do app) */}
      <div className="flex items-center gap-2 text-[11px] sm:text-xs">
        <span className="font-bold">Compartilhar este NFT:</span>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no LinkedIn (abre em nova aba)"
          className={shareLink}
        >
          <LinkedinIcon aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          href={`mailto:?subject=${shareText}&body=${pageUrl}`}
          aria-label="Compartilhar por e-mail"
          className={shareLink}
        >
          <Mail aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no Twitter (abre em nova aba)"
          className={shareLink}
        >
          <TwitterIcon aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default NftSummary;
