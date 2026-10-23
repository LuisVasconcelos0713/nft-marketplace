import {
  useState,
  type ComponentType,
  type FormEvent,
  type SVGProps,
} from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../assets/SocialIcons";

/* ---------- Tipos: descrevem o formato de cada lista abaixo ---------- */
type Feature = { letter: string; title: string; description: string };
type LinkGroup = { title: string; links: string[] };
type Social = {
  name: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/* ---------- Dados (fáceis de editar sem mexer no JSX) ---------- */
const features: Feature[] = [
  {
    letter: "W",
    title: "Segurança da carteira",
    description:
      "Proteja sua carteira e colecione arte digital verificada com confiança.",
  },
  {
    letter: "C",
    title: "Criadores em destaque",
    description:
      "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
  },
  {
    letter: "D",
    title: "Alertas de lançamentos",
    description:
      "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
  },
];

const linkGroups: LinkGroup[] = [
  {
    title: "Meu perfil",
    links: [
      "Meu perfil",
      "Minha coleção",
      "Atividade",
      "Estúdio do criador",
      "Lista de interesse",
    ],
  },
  {
    title: "Central de ajuda",
    links: [
      "Central de ajuda",
      "Como comprar NFTs",
      "Carteira e segurança",
      "Política do mercado",
      "Denunciar item",
    ],
  },
  {
    title: "Coleções",
    links: ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"],
  },
];

const socials: Social[] = [
  { name: "Facebook", href: "https://www.facebook.com", Icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com", Icon: InstagramIcon },
  { name: "Twitter", href: "https://twitter.com", Icon: TwitterIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com", Icon: LinkedinIcon },
  { name: "YouTube", href: "https://www.youtube.com", Icon: YoutubeIcon },
];

const wallets = ["MetaMask", "WalletConnect", "Coinbase"];

/* Anel de foco visível para navegação por teclado (requisito de acessibilidade) */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1EB]";

const Footer = () => {
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterMessage(
      "A newsletter não está disponível nesta demonstração.",
    );
  };

  return (
    <footer className="mx-auto xl:ml-50 bg-[#140D0B] font-mono text-[#F5F1EB]">
      {/* ===== 1. Destaques + newsletter ===== */}
      <div className="bg-[#26180F]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={
                index > 0 ? "lg:border-l lg:border-[#CF8A4B]/70 lg:pl-6" : ""
              }
            >
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CF8A4B] text-3xl font-bold text-[#26180F]"
              >
                {feature.letter}
              </div>
              <p className="mt-4 text-base font-bold">{feature.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#B99665]">
                {feature.description}
              </p>
            </div>
          ))}

          <div className="lg:border-l lg:border-[#CF8A4B]/70 lg:pl-6">
            <h2 className="text-lg font-bold leading-tight">
              Antecipe-se ao próximo lançamento
            </h2>

            <form onSubmit={handleSubmit} className="mt-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu e-mail
              </label>
              <div className="flex">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="digite seu e-mail..."
                  className={`min-w-0 flex-1 rounded-l bg-[#3A2112] px-3 py-3 text-sm text-[#F5F1EB] placeholder:text-[#B99665] ${focusRing}`}
                />
                <button
                  type="submit"
                  className={`rounded-r bg-[#CF8A4B] px-4 text-base font-bold text-[#26180F] transition-colors hover:bg-[#E0A066] ${focusRing}`}
                >
                  Enviar
                </button>
              </div>
              <p role="status" className="mt-2 min-h-5 text-xs text-[#F5F1EB]">
                {newsletterMessage}
              </p>
            </form>

            <p className="mt-2 text-sm leading-relaxed text-[#B99665]">
              Receba lançamentos selecionados, histórias de criadores e
              novidades do mercado.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#3A2112]">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-4 px-6 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p className="font-bold tracking-widest">KURIO</p>
          <p>Feito para colecionadores, criadores e cultura</p>
          <a
            href="mailto:contato@email.com"
            className={`w-fit hover:underline ${focusRing}`}
          >
            contato@email.com
          </a>
          <a
            href="tel:+551140028922"
            className={`w-fit hover:underline ${focusRing}`}
          >
            +55 11 4002 8922
          </a>
        </div>
      </div>

      <div className="bg-[#26180F]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-lg font-bold">{group.title}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {group.links.map((label) => (
                  <li key={label}>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-lg font-bold">Redes sociais</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (abre em nova aba)`}
                    className={`flex h-9 w-9 items-center justify-center rounded border border-[#CF8A4B] text-[#CF8A4B] transition-colors hover:bg-[#CF8A4B] hover:text-[#26180F] ${focusRing}`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-bold">Carteiras compatíveis</h2>
            <ul className="mt-3 flex w-fit flex-wrap items-center gap-x-3 gap-y-1 rounded border border-[#CF8A4B]/40 bg-[#3A2112]/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#CF8A4B]">
              {wallets.map((wallet, index) => (
                <li key={wallet} className="flex items-center gap-3">
                  {index > 0 && <span aria-hidden="true">•</span>}
                  {wallet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#140D0B] py-3 text-center text-xs">
        <p>
          © {new Date().getFullYear()} Kurio. Propriedade digital para todos.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
