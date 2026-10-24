import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart } from "lucide-react";

const links = [
  { label: "Home", to: "/" },
  { label: "Mercado", to: "/mercado" },
  { label: "Criadores", to: "/criadores" },
  { label: "Aprenda", to: "/aprenda" },
];

export default function Navbar() {
  const linkBase =
    "flex h-16 items-center border-b-2 px-4 text-sm transition-colors duration-200";

  const linkInactive = "border-transparent text-[#d6c6b8] hover:text-[#E89B55]";

  const linkActive = "border-[#E89B55] font-semibold text-[#E89B55]";

  return (
    <header className="hidden md:flex w-full bg-[#140c08] text-[#f5eee5]">
      <nav className="mx-auto flex h-16 lg:w-[60%] items-center justify-between border-b border-[#3b2418] px-6">
        <Link
          to="/"
          className="shrink-0 font-mono text-lg font-bold tracking-[0.2em]"
        >
          KURIO
        </Link>

        <div className="hidden h-full items-center gap-2 md:flex px-12">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: linkActive }}
              inactiveProps={{ className: linkInactive }}
              className={linkBase}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Buscar NFTs"
            className="rounded p-2 text-[#f5eee5] transition-colors hover:text-[#E89B55]"
          >
            <Search size={18} />
          </button>

          <Link
            to="/carrinho"
            aria-label="Carrinho"
            className="rounded p-2 text-[#f5eee5] transition-colors hover:text-[#E89B55]"
          >
            <ShoppingCart size={18} />
          </Link>

          <button className="rounded bg-[#E89B55] px-4 py-2 text-sm font-semibold text-[#201108] transition-colors hover:bg-[#f2ad6c]">
            Entrar
          </button>
        </div>
      </nav>
    </header>
  );
}
