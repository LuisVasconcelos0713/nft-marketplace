import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { nftQueryOptions } from "@/api/nftsApi";
import { apiErrorMessage, createOrder } from "@/lib/ordersApi";
import { clearCart, useCart } from "@/lib/cart";
import {
  CheckoutFormSchema,
  type CheckoutForm as CheckoutFormValues,
  type FieldErrors,
  type Order,
  type OrderRequest,
} from "@/lib/orders";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { focusRing } from "@/lib/ui";

export const Route = createFileRoute("/pagamento")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items } = useCart();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const [errors, setErrors] = useState<FieldErrors>({});
  const [order, setOrder] = useState<Order | null>(null);
  // Guarda a chave de idempotência da tentativa atual
  const attempt = useRef<{ key: string; fingerprint: string } | null>(null);

  // Mesmos dados do carrinho (vêm do cache do TanStack Query)
  const results = useQueries({
    queries: items.map((item) => nftQueryOptions(item.nftId)),
  });
  const loading = results.some((result) => result.isPending);
  const subtotal = items.reduce((sum, item, index) => {
    const nft = results[index]?.data;
    return nft ? sum.plus(new Decimal(nft.priceEth).times(item.quantity)) : sum;
  }, new Decimal(0));

  const mutation = useMutation({
    mutationFn: ({ request, key }: { request: OrderRequest; key: string }) =>
      createOrder(request, key),
    onSuccess: (created) => {
      setOrder(created); // só aqui, com a resposta do servidor, a compra é confirmada
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["nfts"] }); // a disponibilidade mudou
    },
  });

  // Quando aparecem erros de validação, leva o foco ao primeiro campo com erro
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mutation.isPending || items.length === 0) return; // evita pedido duplicado

    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");

    const parsed = CheckoutFormSchema.safeParse({
      displayName: text("displayName"),
      username: text("username"),
      network: text("network"),
      profileName: text("profileName"),
      walletAddress: text("walletAddress"),
      secondaryWallet: text("secondaryWallet"),
      walletType: text("walletType"),
      referralCode: text("referralCode"),
      email: text("email"),
      ensName: text("ensName"),
      useAnotherWallet: data.get("useAnotherWallet") === "on",
      notes: text("notes"),
      wallet: text("wallet"),
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormValues;
        if (!next[field]) next[field] = issue.message; // só a primeira mensagem de cada campo
      }
      setErrors(next);
      return;
    }
    setErrors({});

    const request: OrderRequest = {
      items: items.map(({ nftId, quantity }) => ({ nftId, quantity })),
      form: parsed.data,
    };

    // Repetir a MESMA compra (ex.: tentar de novo após falha) reaproveita a chave;
    // mudar qualquer dado gera uma chave nova.
    const fingerprint = JSON.stringify(request);
    if (attempt.current?.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, key: crypto.randomUUID() };
    }
    mutation.mutate({ request, key: attempt.current.key });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 font-mono text-[#F5F1EB]">
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
          <li>Mercado</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Pagamento</li>
        </ol>
      </nav>

      <h1 className="sr-only">Pagamento</h1>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-bold">Não há itens para pagar</p>
          <p className="mt-2 text-sm text-[#B99665]">
            Adicione NFTs ao carrinho para continuar.
          </p>
          <Link
            to="/"
            className={`mt-6 inline-block rounded bg-[#CF8A4B] px-6 py-2 text-xs font-bold uppercase text-[#26180F] hover:bg-[#E0A066] ${focusRing}`}
          >
            Explorar o mercado
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_340px]">
          <CheckoutForm errors={errors} onSubmit={handleSubmit} />
          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            loading={loading}
            pending={mutation.isPending}
            walletError={errors.wallet}
            submitError={
              mutation.isError ? apiErrorMessage(mutation.error) : undefined
            }
          />
        </div>
      )}

      {/* Aparece só quando o servidor (MSW) confirmou o pedido */}
      <OrderConfirmation order={order} onClose={() => navigate({ to: "/" })} />
    </div>
  );
}
