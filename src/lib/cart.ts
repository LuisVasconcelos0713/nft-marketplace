import { useSyncExternalStore } from "react";
import { z } from "zod";

/*
  Carrinho SIMPLES: guarda só { id do NFT, quantidade } e salva no localStorage,
  então sobrevive ao refresh. Os dados do NFT (nome, preço) você busca pelo id
  com useQuery(nftQueryOptions(id)) quando for desenhar a tela do carrinho.

  Limitação conhecida: ainda não é a API do README (GET/POST /api/cart).
  Quando chegar a hora, só as funções abaixo mudam; os componentes continuam iguais.
*/

const CartSchema = z.array(
  z.object({
    nftId: z.string(),
    quantity: z.number().int().min(1),
  }),
);
export type CartItem = z.infer<typeof CartSchema>[number];

const STORAGE_KEY = "kurio-cart";

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = CartSchema.safeParse(raw ? JSON.parse(raw) : []);
    return parsed.success ? parsed.data : [];
  } catch {
    return []; // localStorage bloqueado ou JSON quebrado: começa vazio
  }
}

let items: CartItem[] = load();
const listeners = new Set<() => void>();

function commit(next: CartItem[]) {
  items = next; // sempre um array novo, é isso que faz o React re-renderizar
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* sem espaço ou bloqueado: o carrinho segue funcionando só em memória */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Soma `quantity` ao item (cria se não existir). */
export function addToCart(nftId: string, quantity: number) {
  const existing = items.find((item) => item.nftId === nftId);
  commit(
    existing
      ? items.map((item) =>
          item.nftId === nftId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [...items, { nftId, quantity }],
  );
}

/** Define a quantidade exata de um item (os limites mín/máx são checados na tela). */
export function setCartQuantity(nftId: string, quantity: number) {
  commit(
    items.map((item) =>
      item.nftId === nftId ? { ...item, quantity: Math.max(1, quantity) } : item,
    ),
  );
}

export function removeFromCart(nftId: string) {
  commit(items.filter((item) => item.nftId !== nftId));
}

export function clearCart() {
  commit([]);
}

/** Lê o carrinho em qualquer componente e re-renderiza quando ele muda. */
export function useCart() {
  const current = useSyncExternalStore(subscribe, () => items);
  return {
    items: current,
    totalItems: current.reduce((sum, item) => sum + item.quantity, 0),
    quantityOf: (nftId: string) =>
      current.find((item) => item.nftId === nftId)?.quantity ?? 0,
  };
}
