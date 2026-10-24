import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, LogOut, UserRound } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

type AuthUser = {
  name: string;
  email: string;
};

const links = [
  { label: "Home", to: "/" },
  { label: "Mercado", to: "/mercado" },
  { label: "Criadores", to: "/criadores" },
  { label: "Aprenda", to: "/aprenda" },
];

function getSavedUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem("kurio-demo-user");
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getSavedUser);

  const linkBase =
    "flex h-16 items-center border-b-2 px-4 text-sm transition-colors duration-200";

  const linkInactive = "border-transparent text-[#d6c6b8] hover:text-[#E89B55]";

  const linkActive = "border-[#E89B55] font-semibold text-[#E89B55]";

  function handleLogout() {
    localStorage.removeItem("kurio-demo-user");
    setUser(null);
  }

  return (
    <>
      <header className="hidden w-full bg-[#140c08] text-[#f5eee5] md:flex">
        <nav className="mx-auto flex h-16 items-center justify-between border-b border-[#3b2418] px-6 lg:w-[60%]">
          <Link
            to="/"
            className="shrink-0 font-mono text-lg font-bold tracking-[0.2em]"
          >
            KURIO
          </Link>

          <div className="hidden h-full items-center gap-2 px-4 md:flex lg:px-12">
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

            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex max-w-28 items-center gap-1 truncate text-xs text-[#D6C6B8]">
                  <UserRound size={14} />
                  {user.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair da conta"
                  title="Sair"
                  className="rounded p-2 text-[#D6C6B8] hover:text-[#E89B55]"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="rounded bg-[#E89B55] px-4 py-2 text-sm font-semibold text-[#201108] transition-colors hover:bg-[#f2ad6c]"
              >
                Entrar
              </button>
            )}
          </div>
        </nav>
      </header>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            setAuthOpen(false);
          }}
        />
      )}
    </>
  );
}
