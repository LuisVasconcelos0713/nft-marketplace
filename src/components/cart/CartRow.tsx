import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { Minus, Plus, Trash2 } from "lucide-react";
import { nftQueryOptions } from "@/api/nftsApi";
import { removeFromCart, setCartQuantity } from "@/lib/cart";
import { formatEth } from "@/lib/format";
import { focusRing } from "@/lib/ui";

type CartRowProps = { nftId: string; quantity: number };

/* Mesmas colunas do cabeçalho em carrinho.tsx */
const rowClass =
  "grid items-center gap-3 rounded bg-[#241610] p-3 md:grid-cols-[minmax(0,2.4fr)_1fr_1.2fr_1fr_auto]";
const label = "text-[10px] text-[#B99665] md:sr-only";
const roundButton = `flex h-6 w-6 items-center justify-center rounded-full bg-[#CF8A4B] text-[#26180F] transition-colors hover:bg-[#E0A066] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

const CartRow = ({ nftId, quantity }: CartRowProps) => {
  // Mesma chave de cache da página de detalhe: não gera requisição extra
  const { data: nft, isPending } = useQuery(nftQueryOptions(nftId));

  if (isPending) {
    return (
      <li
        aria-hidden="true"
        className={`${rowClass} h-[72px] animate-pulse motion-reduce:animate-none`}
      />
    );
  }

  // NFT que não existe mais (ou falhou ao carregar): deixa o usuário remover
  if (!nft) {
    return (
      <li className={`${rowClass} md:grid-cols-[1fr_auto]`}>
        <p className="text-xs text-[#B99665]">
          Este NFT não está mais disponível.
        </p>
        <button
          type="button"
          onClick={() => removeFromCart(nftId)}
          className={`rounded border border-[#CF8A4B] px-3 py-1 text-xs text-[#CF8A4B] hover:bg-[#CF8A4B] hover:text-[#26180F] ${focusRing}`}
        >
          Remover
        </button>
      </li>
    );
  }

  const lineTotal = new Decimal(nft.priceEth).times(quantity);

  return (
    <li className={rowClass}>
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={nft.image}
          alt={nft.name}
          className="h-12 w-12 shrink-0 rounded object-cover"
        />
        <div className="min-w-0">
          <Link
            to="/mercado/$id"
            params={{ id: nft.id }}
            className={`block truncate text-sm font-bold hover:text-[#CF8A4B] ${focusRing}`}
          >
            {nft.name}
          </Link>
          <p className="truncate text-[11px] text-[#B99665]">
            ID do token: #{nft.tokenId}
          </p>
        </div>
      </div>

      <p className="flex items-center justify-between gap-2 md:block">
        <span className={label}>Preço</span>
        <span className="text-xs font-bold text-[#E89B55]">
          {formatEth(new Decimal(nft.priceEth))} ETH
        </span>
      </p>

      <div className="flex items-center justify-between gap-2 md:justify-start">
        <span className={label}>Edições</span>
        <div
          role="group"
          aria-label={`Quantidade de ${nft.name}`}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            aria-label="Diminuir quantidade"
            disabled={quantity <= nft.minQuantity}
            onClick={() => setCartQuantity(nft.id, quantity - 1)}
            className={roundButton}
          >
            <Minus aria-hidden="true" className="h-3 w-3" />
          </button>
          <span className="min-w-5 text-center text-xs font-bold">
            <span className="sr-only">Quantidade: </span>
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            disabled={quantity >= nft.available} // limite de disponibilidade
            onClick={() => setCartQuantity(nft.id, quantity + 1)}
            className={roundButton}
          >
            <Plus aria-hidden="true" className="h-3 w-3" />
          </button>
        </div>
      </div>

      <p className="flex items-center justify-between gap-2 md:block">
        <span className={label}>Total</span>
        <span className="text-xs font-bold text-[#E89B55]">
          {formatEth(lineTotal)} ETH
        </span>
      </p>

      <button
        type="button"
        aria-label={`Remover ${nft.name} do carrinho`}
        onClick={() => removeFromCart(nft.id)}
        className={`flex h-8 w-8 items-center justify-center justify-self-end rounded text-[#CF8A4B] transition-colors hover:bg-[#3A2112] ${focusRing}`}
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" />
      </button>
    </li>
  );
};

export default CartRow;
