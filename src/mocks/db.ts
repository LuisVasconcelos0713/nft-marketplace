import { mockNFTs } from "@/data/nfts";
import type { NFT } from "@/lib/schemas";

/*
  "Banco de dados" simulado: vive em memória, dentro do navegador.
  Só os handlers do MSW leem e escrevem aqui. Nenhum componente importa este arquivo.

  Os fixtures (src/mocks/fixtures/nfts.ts) são a fonte inicial dos dados.
  structuredClone faz uma cópia: assim, alterar o banco nunca altera os fixtures,
  e resetDb() consegue restaurar exatamente o estado de origem.
*/
const seed = (): NFT[] => structuredClone(mockNFTs);

export const db = {
  nfts: seed(),
};

/** Restaura o cenário conhecido (usado pelos testes e pelo reset de demonstração) */
export function resetDb() {
  db.nfts = seed();
}
