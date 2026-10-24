import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { nftQueryOptions } from "@/api/nftsApi";
import type { CartItem } from "@/lib/cart";
import { formatEth } from "@/lib/format";
import { NETWORK_FEE_ETH, WALLET_PROVIDERS } from "@/lib/orders";
import { focusRing } from "@/lib/ui";

type CheckoutSummaryProps = {
  items: CartItem[];
  subtotal: Decimal;
  loading: boolean;
  pending: boolean;
  walletError?: string;
  submitError?: string;
};

function SummaryRow({ nftId, quantity }: CartItem) {
  const { data: nft } = useQuery(nftQueryOptions(nftId)); // mesmo cache do carrinho

  if (!nft) {
    return <li aria-hidden="true" className="h-14 animate-pulse rounded bg-[#241610] motion-reduce:animate-none" />;
  }

  return (
    <li className="flex items-center gap-3 rounded bg-[#241610] p-2">
      <img src={nft.image} alt={nft.name} className="h-10 w-10 shrink-0 rounded object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold">{nft.name}</p>
        <p className="truncate text-[10px] text-[#B99665]">ID do token: #{nft.id}</p>
      </div>
      <span className="text-[11px] text-[#B99665]">
        <span className="sr-only">Quantidade: </span>(x {quantity})
      </span>
      <span className="text-xs font-bold text-[#E89B55]">
        {formatEth(new Decimal(nft.priceEth).times(quantity))} ETH
      </span>
    </li>
  );
}

const CheckoutSummary = ({ items, subtotal, loading, pending, walletError, submitError }: CheckoutSummaryProps) => {
  const fee = new Decimal(NETWORK_FEE_ETH);
  const total = subtotal.plus(fee);
  const value = (amount: Decimal) => (loading ? "…" : `${formatEth(amount)} ETH`);

  return (
    <aside aria-labelledby="checkout-summary-title" className="md:border-l md:border-[#3A2112] md:pl-6">
      <h2 id="checkout-summary-title" className="text-sm font-bold">
        Seus NFTs
      </h2>
      <div aria-hidden="true" className="mt-2 flex justify-between text-[11px] font-bold">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>

      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <SummaryRow key={item.nftId} {...item} />
        ))}
      </ul>

      <p className="mt-3 text-center text-[11px]">
        Tem um código promocional?{" "}
        <Link to="/carrinho" className={`text-[#CF8A4B] underline ${focusRing}`}>
          Aplique aqui
        </Link>
      </p>

      <dl className="mt-3 space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <dt>Subtotal</dt>
          <dd>{value(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Desconto do lançamento</dt>
          <dd>(-) 0.00</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Taxa de rede</dt>
          <dd>{value(fee)}</dd>
        </div>
        <p className="text-center text-[10px] text-[#B99665]">Taxa estimada</p>
        <div className="flex justify-between gap-2 border-t border-[#3A2112] pt-3 text-sm font-bold">
          <dt>Total</dt>
          <dd className="text-[#E89B55]">{value(total)}</dd>
        </div>
      </dl>

      {/* Os radios ficam aqui, mas pertencem ao formulário da esquerda (atributo form) */}
      <fieldset className="mt-5" aria-describedby={walletError ? "wallet-error" : undefined}>
        <legend className="w-full text-center text-xs font-bold">Carteira e rede</legend>
        <div className="mt-3 space-y-2">
          {WALLET_PROVIDERS.map((provider) => (
            <label
              key={provider}
              className="flex cursor-pointer items-center gap-2 rounded border border-[#3A2112] bg-[#1B100B] px-3 py-3 text-xs has-[:checked]:border-[#CF8A4B] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#F5F1EB]"
            >
              <input
                type="radio"
                name="wallet"
                value={provider}
                form="checkout-form"
                aria-invalid={walletError ? true : undefined}
                className="accent-[#CF8A4B]"
              />
              {provider}
            </label>
          ))}
        </div>
        {walletError && (
          <p id="wallet-error" className="mt-2 text-[11px] text-red-300">
            {walletError}
          </p>
        )}
      </fieldset>

      {submitError && (
        <p role="alert" className="mt-4 rounded border border-red-400 p-2 text-xs text-red-300">
          {submitError}
        </p>
      )}
      <p role="status" className="sr-only">
        {pending ? "Confirmando compra…" : ""}
      </p>

      {/* O botão está fora do <form>, mas envia ele (atributo form) */}
      <button
        type="submit"
        form="checkout-form"
        disabled={pending || loading}
        className={`mt-4 w-full rounded bg-[#CF8A4B] px-4 py-3 text-sm font-bold text-[#26180F] transition-colors hover:bg-[#E0A066] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
      >
        {pending ? "Confirmando…" : "Confirmar compra"}
      </button>
    </aside>
  );
};

export default CheckoutSummary;
