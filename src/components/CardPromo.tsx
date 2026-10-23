type CardPromoProps = {
  titulo: string;
  descricao: string;
  imagem: string;
};

const CardPromo = ({ titulo, descricao, imagem }: CardPromoProps) => {
  return (
    <article className="group flex w-full min-w-0 overflow-hidden rounded-xl bg-[#21140F] sm:w-[calc(50%-12px)]">
      {/* Imagem */}
      <div className="w-[42%] shrink-0 overflow-hidden sm:w-[45%]">
        <img
          src={imagem}
          alt={titulo}
          className="h-full min-h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-3 py-5 text-center sm:px-4 sm:py-6 lg:px-6">
        <h2 className="text-sm font-bold leading-snug text-[#F5F1EB] sm:text-base">
          {titulo}
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-[#B99665]">
          {descricao}
        </p>

        <a
          href="#mercado"
          className="mt-3 inline-flex items-center gap-2 rounded bg-[#D28A4C] px-4 py-2 text-xs font-bold uppercase text-[#140D0A] transition-colors hover:bg-[#E5A264]"
        >
          Explorar <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
};

export default CardPromo;
