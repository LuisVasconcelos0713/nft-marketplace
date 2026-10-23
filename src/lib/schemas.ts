import { z } from "zod";

const eth = z.string().regex(/^\d+(\.\d+)?$/, "Preço ETH inválido");

export const NftSchema = z.object({
  // Identificação
  id: z.string(),
  name: z.string(),
  tokenId: z.string(),

  // Catálogo
  collection: z.string(),
  category: z.enum([
    "Arte digital",
    "Fotografia",
    "Música",
    "Arte 3D",
    "Colecionáveis",
    "Generativa",
    "Jogos",
    "Assinaturas",
    "Utilidade",
  ]),
  image: z.string(),
  priceEth: eth,
  previousPriceEth: eth.optional(),
  network: z.enum(["Ethereum", "Polygon", "Solana"]),
  available: z.number().int().min(0),

  // Detalhes do NFT
  description: z.string(),
  edition: z.object({
    number: z.number().int().min(1),
    total: z.number().int().min(1).optional(),
    isOpen: z.boolean(),
  }),
  attributes: z.array(
    z.object({
      trait: z.string(),
      value: z.string(),
    }),
  ),

  // Criador e avaliações
  creator: z.object({
    name: z.string(),
    walletAddress: z.string(),
    royaltyPercent: z.number().min(0).max(100),
  }),
  rating: z.object({
    average: z.number().min(0).max(5),
    count: z.number().int().min(0),
  }),

  // Regras de compra
  minQuantity: z.number().int().min(1).default(1),
});

export type NFT = z.infer<typeof NftSchema>;
export type NFTAttribute = NFT["attributes"][number];
