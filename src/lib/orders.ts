import { z } from "zod";

/* ---------- Opções fixas (as mesmas do Figma) ---------- */
export const NETWORKS = ["Ethereum", "Polygon", "Solana"] as const;
export const WALLET_TYPES = ["Principal", "Secundária"] as const;
export const WALLET_PROVIDERS = ["MetaMask", "WalletConnect", "Coinbase Wallet"] as const;

/* Provisório: depois vem da cotação da API (README). */
export const NETWORK_FEE_ETH = "0.016";

const ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const ENS = /^[a-z0-9-]+\.eth$/i;
const eth = z.string().regex(/^\d+(\.\d+)?$/);

/* ---------- Formulário "Perfil do colecionador" ---------- */
export const CheckoutFormSchema = z.object({
  displayName: z.string().trim().min(2, "Informe o nome de exibição (mín. 2 caracteres)"),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]{3,20}$/, "Use de 3 a 20 letras, números ou _"),
  network: z.enum(NETWORKS, { error: "Selecione uma rede" }),
  profileName: z.string().trim().min(2, "Informe o nome do perfil"),
  walletAddress: z
    .string()
    .trim()
    .regex(ADDRESS, "Endereço inválido: use 0x seguido de 40 caracteres hexadecimais"),
  secondaryWallet: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine(
      (value) => !value || ADDRESS.test(value) || ENS.test(value),
      "Use um endereço 0x válido ou um nome terminado em .eth",
    ),
  walletType: z.enum(WALLET_TYPES, { error: "Selecione o tipo de carteira" }),
  referralCode: z.string().trim().min(3, "Informe o código de indicação"),
  email: z.email("Informe um e-mail válido"),
  ensName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9-]{3,}$/, "Use ao menos 3 letras, números ou hífen"),
  useAnotherWallet: z.boolean(),
  notes: z
    .string()
    .trim()
    .max(300, "Máximo de 300 caracteres")
    .optional()
    .transform((value) => value || undefined),
  wallet: z.enum(WALLET_PROVIDERS, { error: "Escolha a carteira para pagar" }),
});
export type CheckoutForm = z.infer<typeof CheckoutFormSchema>;
export type FieldErrors = Partial<Record<keyof CheckoutForm, string>>;

/* ---------- Contrato de POST /api/orders ---------- */
export const OrderRequestSchema = z.object({
  items: z
    .array(z.object({ nftId: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
  form: CheckoutFormSchema,
});
export type OrderRequest = z.infer<typeof OrderRequestSchema>;

/* O pedido guarda um "retrato" (snapshot) dos NFTs no momento da compra:
   se o catálogo mudar depois, o recibo continua com os valores originais. */
export const OrderSchema = z.object({
  id: z.string(),
  txHash: z.string(),
  createdAt: z.string(),
  status: z.literal("confirmed"),
  wallet: z.enum(WALLET_PROVIDERS),
  network: z.enum(NETWORKS),
  items: z.array(
    z.object({
      nftId: z.string(),
      name: z.string(),
      image: z.string(),
      tokenId: z.string(),
      priceEth: eth,
      quantity: z.number().int(),
    }),
  ),
  subtotalEth: eth,
  discountEth: eth,
  feeEth: eth,
  totalEth: eth,
});
export type Order = z.infer<typeof OrderSchema>;
