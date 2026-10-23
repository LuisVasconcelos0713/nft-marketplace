export type Article = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readingTime: number;
  slug: string;
};

export const articles: Article[] = [
  {
    id: "1",
    title: "Como funciona a propriedade de NFTs",
    description: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    image: "/images/9df2ff42dd27ba657621c304557d1a855a4be6a5%20(2).png",
    date: "12 de setembro",
    readingTime: 6,
    slug: "como-funciona-propriedade-nfts",
  },
  {
    id: "2",
    title: "10 artistas digitais para acompanhar",
    description: "Conheça criadores que moldam a cultura digital.",
    image: "/images/2986a7cb16d09de8970824d2dd58bf0bb021702c%20(3).png",
    date: "13 de setembro",
    readingTime: 2,
    slug: "artistas-digitais-para-acompanhar",
  },
  {
    id: "3",
    title: "Raridade, atributos e procedência",
    description:
      "Entenda raridade, procedência, direitos autorais e utilidade.",
    image: "/images/8459204731e6eba9d474cbc8ebc37071360d3ba5%20(2).png",
    date: "15 de setembro",
    readingTime: 3,
    slug: "raridade-atributos-procedencia",
  },
  {
    id: "4",
    title: "Como proteger sua carteira",
    description: "Proteja sua carteira, seus ativos e sua identidade.",
    image: "/images/9df2ff42dd27ba657621c304557d1a855a4be6a5%20(2).png",
    date: "15 de setembro",
    readingTime: 2,
    slug: "como-proteger-sua-carteira",
  },
];
