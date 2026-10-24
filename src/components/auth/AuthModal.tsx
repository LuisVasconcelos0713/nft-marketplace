import { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";

type AuthUser = {
  name: string;
  email: string;
};

type AuthModalProps = {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
};

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (mode === "register" && !name.trim()) {
      setError("Informe seu nome.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // Simulação local: não envia dados para nenhum servidor.
    window.setTimeout(() => {
      const user: AuthUser = {
        name: mode === "register" ? name.trim() : normalizedEmail.split("@")[0],
        email: normalizedEmail,
      };

      localStorage.setItem("kurio-demo-user", JSON.stringify(user));
      setLoading(false);
      onSuccess(user);
    }, 500);
  }

  function handleForgotPassword() {
    if (!email.trim()) {
      setError("Informe seu e-mail primeiro.");
      return;
    }

    setError("");
    setMessage("Recuperação simulada: nenhum e-mail real foi enviado.");
  }

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full max-w-[420px] border border-[#D28A4C] bg-[#140D0A] px-6 py-7 font-mono text-[#F5F1EB] shadow-2xl sm:px-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute right-3 top-3 rounded p-1 text-[#B99665] hover:text-[#E89B55]"
        >
          <X size={17} />
        </button>

        <div className="mb-5 flex justify-center gap-2 text-sm sm:text-base">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className={
              mode === "login"
                ? "font-bold text-[#E89B55]"
                : "text-[#B99665] hover:text-[#F5F1EB]"
            }
          >
            Entrar
          </button>

          <span className="text-[#70513A]">|</span>

          <button
            type="button"
            onClick={() => changeMode("register")}
            className={
              mode === "register"
                ? "font-bold text-[#E89B55]"
                : "text-[#B99665] hover:text-[#F5F1EB]"
            }
          >
            Criar conta
          </button>
        </div>

        <h2 id="auth-title" className="text-center text-lg font-bold">
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
        </h2>

        <p className="mx-auto mt-2 max-w-[290px] text-center text-[10px] leading-relaxed text-[#B99665]">
          {mode === "login"
            ? "Entre para gerenciar sua carteira, coleções e perfil."
            : "Cadastre-se para explorar e colecionar arte digital."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "register" && (
            <label className="block">
              <span className="sr-only">Nome</span>
              <input
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-sm border border-[#39251B] bg-[#21140F] px-3 py-3 text-xs outline-none placeholder:text-[#9C7B5D] focus:border-[#D28A4C]"
                required
              />
            </label>
          )}

          <label className="block">
            <span className="sr-only">E-mail</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="contato@email.com"
              className="w-full rounded-sm border border-[#39251B] bg-[#21140F] px-3 py-3 text-xs outline-none placeholder:text-[#9C7B5D] focus:border-[#D28A4C]"
              required
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Senha</span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha (mínimo 6 caracteres)"
              className="w-full rounded-sm border border-[#39251B] bg-[#21140F] px-3 py-3 pr-10 text-xs outline-none placeholder:text-[#9C7B5D] focus:border-[#D28A4C]"
              minLength={6}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B99665] hover:text-[#E89B55]"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </label>

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] text-[#D28A4C] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-xs text-[#D8B68A]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[#D28A4C] px-4 py-3 text-xs font-bold uppercase text-[#140D0A] transition-colors hover:bg-[#E5A264] disabled:cursor-wait disabled:opacity-60"
          >
            {loading
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[10px] text-[#8F7156]">
          <span className="h-px flex-1 bg-[#39251B]" />
          Ou continue com
          <span className="h-px flex-1 bg-[#39251B]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              setMessage(
                "Login Google ainda não está integrado neste protótipo.",
              )
            }
            className="rounded-sm border border-[#39251B] px-2 py-3 text-[10px] text-[#D6C6B8] hover:border-[#D28A4C]"
          >
            Google (demo)
          </button>

          <button
            type="button"
            onClick={() =>
              setMessage(
                "Login Facebook ainda não está integrado neste protótipo.",
              )
            }
            className="rounded-sm border border-[#39251B] px-2 py-3 text-[10px] text-[#D6C6B8] hover:border-[#D28A4C]"
          >
            Facebook (demo)
          </button>
        </div>
      </section>
    </div>
  );
}
