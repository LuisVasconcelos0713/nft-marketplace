import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import { db } from "./db";
import type { ApiError } from "@/lib/contracts";
import { NETWORK_FEE_ETH, OrderRequestSchema, type Order } from "@/lib/orders";

/*
  Pedidos simulados. Idempotência: a mesma chave + o mesmo conteúdo devolve o MESMO
  pedido (sem comprar de novo); a mesma chave com conteúdo diferente dá 409.
*/
type Stored = { fingerprint: string; order: Order };
const byKey = new Map<string, Stored>();
let counter = 0;

/** Esvazia os pedidos (para testes e reset de cenário) */
export function resetOrders() {
  byKey.clear();
  counter = 0;
}

const fail = (error: ApiError, status: number) =>
  HttpResponse.json(error, { status });

// Hash de transação falso, mas sempre igual para o mesmo número de pedido
const fakeTxHash = (n: number) =>
  "0x" +
  Array.from({ length: 64 }, (_, i) =>
    ((n * 31 + i * 17 + i * i * 7) % 16).toString(16),
  ).join("");

export const orderHandlers = [
  http.post("/api/orders", async ({ request }) => {
    const key = request.headers.get("Idempotency-Key");
    if (!key) {
      return fail({ code: "VALIDATION", message: "Chave de idempotência ausente" }, 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = OrderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail({ code: "VALIDATION", message: "Dados do pedido inválidos" }, 400);
    }

    await delay(800);

    // Daqui até salvar o pedido não há mais "await": dois cliques seguidos não passam juntos.
    const fingerprint = JSON.stringify(parsed.data);
    const previous = byKey.get(key);
    if (previous) {
      return previous.fingerprint === fingerprint
        ? HttpResponse.json(previous.order)
        : fail({ code: "CONFLICT", message: "Esta chave já foi usada em outro pedido" }, 409);
    }

    // Confere a disponibilidade de tudo ANTES de alterar qualquer coisa
    const lines = [];
    for (const { nftId, quantity } of parsed.data.items) {
      const nft = db.nfts.find((item) => item.id === nftId);
      if (!nft) {
        return fail({ code: "NOT_FOUND", message: "Um dos NFTs não existe mais" }, 404);
      }
      if (quantity > nft.available) {
        return fail(
          {
            code: "CONFLICT",
            message: `Disponibilidade insuficiente para ${nft.name} (restam ${nft.available}).`,
          },
          409,
        );
      }
      lines.push({ nft, quantity });
    }

    let subtotal = new Decimal(0);
    for (const { nft, quantity } of lines) {
      nft.available -= quantity;
      subtotal = subtotal.plus(new Decimal(nft.priceEth).times(quantity));
    }
    const fee = new Decimal(NETWORK_FEE_ETH);

    counter += 1;
    const order: Order = {
      id: `ord_${String(counter).padStart(4, "0")}`,
      txHash: fakeTxHash(counter),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      wallet: parsed.data.form.wallet,
      network: parsed.data.form.network,
      items: lines.map(({ nft, quantity }) => ({
        nftId: nft.id,
        name: nft.name,
        image: nft.image,
        tokenId: nft.tokenId,
        priceEth: nft.priceEth,
        quantity,
      })),
      subtotalEth: subtotal.toString(),
      discountEth: "0",
      feeEth: fee.toString(),
      totalEth: subtotal.plus(fee).toString(),
    };

    byKey.set(key, { fingerprint, order });
    return HttpResponse.json(order, { status: 201 });
  }),
];
