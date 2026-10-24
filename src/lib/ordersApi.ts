import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import { ApiErrorSchema } from "@/lib/contracts";
import { OrderSchema, type OrderRequest } from "@/lib/orders";

/* A chave de idempotência identifica a TENTATIVA: repetir a mesma chave não compra duas vezes. */
export async function createOrder(request: OrderRequest, idempotencyKey: string) {
  const { data } = await api.post("/orders", request, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return OrderSchema.parse(data);
}

/** Texto de erro para mostrar ao usuário (usa a mensagem da API quando existe) */
export function apiErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const parsed = ApiErrorSchema.safeParse(error.response?.data);
    if (parsed.success) return parsed.data.message;
  }
  return "Não foi possível concluir a compra. Verifique sua conexão e tente novamente.";
}
