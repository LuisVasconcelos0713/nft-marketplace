import { useEffect, useRef } from "react";
import Decimal from "decimal.js";
import { ShoppingBag, X } from "lucide-react";
import { formatEth } from "@/lib/format";
import type { Order } from "@/lib/orders";
import { focusRing } from "@/lib/ui";

type OrderConfirmationProps = {
  order: Order | null;
  onClose: () => void;
};

const eth = (value: string) => `${formatEth(new Decimal(value))} ETH`;

const OrderConfirmation = ({ order, onClose }: OrderConfirmationProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  // <dialog> nativo: prende o foco, fecha com Esc e devolve o foco ao fechar
  useEffect(() => {
    const dialog = ref.current;
    if (order && dialog && !dialog.open) dialog.showModal();
  }, [order]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="order-title"
      className="m-auto max-h-[92vh] w-[min(92vw,460px)] overflow-y-auto border-b-8 border-[#CF8A4B] bg-[#26180F] p-0 font-mono text-[#F5F1EB] backdrop:bg-black/80"
    >
      {order && (
        <div className="relative px-5 pb-6 pt-8">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Fechar confirmação"
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded hover:bg-[#3A2112] ${focusRing}`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>

          <ShoppingBag aria-hidden="true" className="mx-auto h-10 w-10 text-[#CF8A4B]" />
          <h2 id="order-title" className="mt-3 text-center text-sm font-bold text-[#E89B55]">
            Seus NFTs agora estão na sua carteira
          </h2>

          <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-[#3A2112] py-3 text-[11px] sm:grid-cols-4">
            <div>
              <dt className="font-bold">ID da transação</dt>
              <dd className="text-[#B99665]">
                {order.txHash.slice(0, 6)}…{order.txHash.slice(-4)}
              </dd>
            </div>
            <div>
              <dt className="font-bold">Data</dt>
              <dd className="text-[#B99665]">
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="font-bold">Total</dt>
              <dd className="text-[#B99665]">{eth(order.totalEth)}</dd>
            </div>
            <div>
              <dt className="font-bold">Carteira</dt>
              <dd className="text-[#B99665]">{order.wallet}</dd>
            </div>
          </dl>

          <h3 className="mt-4 text-xs font-bold">Detalhes da transação</h3>
          <ul className="mt-3 space-y-3">
            {order.items.map((item) => (
              <li key={item.nftId} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{item.name}</p>
                  <p className="text-[10px] text-[#B99665]">ID do token: #{item.tokenId}</p>
                </div>
                <span className="text-[11px] text-[#B99665]">
                  <span className="sr-only">Quantidade: </span>(x {item.quantity})
                </span>
                <span className="text-xs font-bold text-[#E89B55]">
                  {eth(new Decimal(item.priceEth).times(item.quantity).toString())}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1 text-xs">
            <div className="flex justify-between">
              <dt>Taxa de rede</dt>
              <dd>{eth(order.feeEth)}</dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Total</dt>
              <dd className="text-[#E89B55]">{eth(order.totalEth)}</dd>
            </div>
          </dl>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-[#B99665]">
            Transação confirmada na {order.network}. A propriedade foi transferida
            para sua carteira conectada e registrada na rede.
          </p>

          {/* Link simulado (README): o hash não existe na rede de verdade */}
          <a
            href={`https://etherscan.io/tx/${order.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`mx-auto mt-4 block w-fit rounded bg-[#CF8A4B] px-5 py-2 text-xs font-bold text-[#26180F] hover:bg-[#E0A066] ${focusRing}`}
          >
            Ver no Etherscan
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      )}
    </dialog>
  );
};

export default OrderConfirmation;
