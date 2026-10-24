import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import Decimal from "decimal.js";
import { formatEth } from "@/lib/format";
import { focusRing } from "@/lib/ui";

type CartSummaryProps = {
  subtotal: Decimal;
  hasItems: boolean;
  loading: boolean;
};

/* Provisório: a taxa de rede e o desconto virão da cotação da API (README). */
const NETWORK_FEE = new Decimal("0.016");
const DISCOUNT = new Decimal(0);

const CartSummary = ({ subtotal, hasItems, loading }: CartSummaryProps) => {
  const [message, setMessage] = useState("");

  const fee = hasItems ? NETWORK_FEE : new Decimal(0);
  const total = subtotal.minus(DISCOUNT).plus(fee);

  // Cupons dependem da API de cotação: por enquanto não "fingem" que funcionaram.
  const handleCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Cupons ainda não estão disponíveis nesta versão.");
  };

  const value = (amount: Decimal) =>
    loading ? "…" : `${formatEth(amount)} ETH`;

  return (
    <aside
      aria-labelledby="cart-summary-title"
      className="md:border-l md:border-[#3A2112] md:pl-6"
    >
      <h2
        id="cart-summary-title"
        className="border-b border-[#3A2112] pb-3 text-lg font-bold"
      >
        Resumo da carteira
      </h2>

      <form onSubmit={handleCoupon} className="mt-4">
        <label htmlFor="promo-code" className="text-xs font-bold">
          Código promocional
        </label>
        <div className="mt-2 flex">
          <input
            id="promo-code"
            type="text"
            placeholder="Digite o código promocional..."
            className={`min-w-0 flex-1 rounded-l bg-[#3A2112] px-3 py-2 text-xs text-[#F5F1EB] placeholder:text-[#B99665] ${focusRing}`}
          />
          <button
            type="submit"
            className={`rounded-r bg-[#CF8A4B] px-4 text-xs font-bold text-[#26180F] hover:bg-[#E0A066] ${focusRing}`}
          >
            Aplicar
          </button>
        </div>
        <p role="status" className="mt-2 min-h-4 text-[11px] text-[#CF8A4B]">
          {message}
        </p>
      </form>

      <dl className="mt-3 space-y-3 text-xs">
        <div className="flex justify-between gap-2">
          <dt>Subtotal</dt>
          <dd>{value(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Desconto do lançamento</dt>
          <dd>{loading ? "…" : `(-) ${formatEth(DISCOUNT)} ETH`}</dd>
        </div>
        <div>
          <div className="flex justify-between gap-2">
            <dt>Taxa de rede</dt>
            <dd>{value(fee)}</dd>
          </div>
          <p className="mt-1 text-right text-[10px] text-[#B99665]">
            Taxa estimada
          </p>
        </div>
        <div className="flex justify-between gap-2 border-t border-[#3A2112] pt-3 text-sm font-bold">
          <dt>Total</dt>
          <dd className="text-[#E89B55]">{value(total)}</dd>
        </div>
      </dl>

      {/* Com itens, vai para o pagamento. Sem itens, fica desabilitado. */}
      {hasItems && !loading ? (
        <Link
          to="/pagamento"
          className={`mt-5 block w-full rounded bg-[#CF8A4B] px-4 py-3 text-center text-sm font-bold text-[#26180F] transition-colors hover:bg-[#E0A066] ${focusRing}`}
        >
          Conectar e finalizar
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed rounded bg-[#CF8A4B] px-4 py-3 text-sm font-bold text-[#26180F] opacity-50"
        >
          Conectar e finalizar
        </button>
      )}

      <Link
        to="/"
        className={`mt-3 block text-center text-xs text-[#B99665] underline hover:text-[#CF8A4B] ${focusRing}`}
      >
        Continuar explorando
      </Link>
    </aside>
  );
};

export default CartSummary;
