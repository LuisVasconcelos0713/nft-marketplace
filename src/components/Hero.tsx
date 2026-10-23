import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

const Hero = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-5 md:grid md:grid-cols-1 md:items-center md:gap-10 md:px-6 md:py-8 lg:px-0">
      {/* MOBILE */}
      <div className="md:hidden">
        {/* Busca e filtros */}
        <div className="mb-4 flex gap-2">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#241610] px-3 text-[#B99665]">
            <Search size={19} className="shrink-0" />
            <input
              type="search"
              placeholder="Explorar coleções"
              aria-label="Explorar coleções"
              className="w-full min-w-0 bg-transparent font-mono text-sm outline-none placeholder:text-[#B99665]"
            />
          </label>

          <button
            type="button"
            aria-label="Filtros"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D28A4C] text-[#140D0A]"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Card compacto */}
        <div className="relative flex min-h-[176px] overflow-hidden rounded-[26px] bg-[radial-gradient(ellipse_at_35%_40%,#865832_0%,#5b3922_48%,#29190f_100%)] px-4 py-3">
          <div className="pointer-events-none absolute -left-8 -top-10 h-48 w-48 rounded-full border-[24px] border-[#D49A60]/10" />

          <div className="relative z-10 w-[62%] pb-4">
            <p className="mb-2 font-mono text-[10px] text-[#FFF2DF]">
              Bem-vindo à Kurio
            </p>

            <h1 className="font-mono text-[18px] font-bold leading-[1.5] text-[#F5F1EB]">
              SEJA DONO DA
              <br />
              CULTURA DIGITAL
            </h1>

            <p className="mt-2 max-w-[190px] font-mono text-[10px] leading-[1.6] text-[#D7B991]">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>

            <a
              href="#mercado"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase text-[#E9A15B]"
            >
              Explorar <ArrowRight size={14} />
            </a>
          </div>

          <div className="absolute right-3 top-1/2 w-[38%] max-w-[145px] -translate-y-1/2">
            <img
              src="/images/8459204731e6eba9d474cbc8ebc37071360d3ba5%20(2).png"
              alt="Macaco colecionável com óculos escuros e jaqueta verde"
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]/60" />
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-10 md:grid md:grid-cols-[1fr_340px] md:gap-12">
        <div className="flex flex-col items-start">
          <p className="mb-3 font-mono text-xs tracking-[0.12em] text-[#F7F3EC]">
            Bem-vindo à Kurio
          </p>

          <h1 className="mb-3 max-w-[580px] font-mono text-3xl font-bold leading-[1.45] tracking-[0.02em] text-[#F5F1EB] md:text-[43px]">
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>

          <p className="mb-5 max-w-[440px] font-mono text-[11px] leading-[1.8] text-[#CFB28C]">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </p>

          <a
            href="#mercado"
            className="inline-flex items-center rounded bg-[#D28A4C] px-5 py-2 text-xs font-bold uppercase text-[#140D0A] transition-colors hover:bg-[#E5A264]"
          >
            Explorar
          </a>

          <div
            className="mt-7 flex w-full justify-center gap-1.5"
            aria-label="Slide 1 de 3"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#D28A4C]/60" />
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl md:w-[340px]">
          <img
            src="/images/8459204731e6eba9d474cbc8ebc37071360d3ba5%20(2).png"
            alt="Macaco colecionável com óculos escuros e jaqueta verde"
            className="aspect-square w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
