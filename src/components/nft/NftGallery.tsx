import { useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { focusRing } from "../../lib/ui";

type NftGalleryProps = {
  name: string;
  images: string[];
};

const NftGallery = ({ name, images }: NftGalleryProps) => {
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = images[selected];

  return (
    <div className="flex gap-3">
      {/* Miniaturas */}
      <ul
        className="flex w-16 shrink-0 flex-col gap-3 sm:w-20"
        aria-label="Miniaturas"
      >
        {images.map((src, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={index === selected}
              aria-label={`Ver imagem ${index + 1} de ${images.length}`}
              className={`block aspect-square w-full overflow-hidden rounded-md border-2 transition-colors ${
                index === selected
                  ? "border-[#CF8A4B]"
                  : "border-transparent hover:border-[#B99665]"
              } ${focusRing}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Imagem principal */}
      <div className="relative min-w-0 flex-1">
        <div className="aspect-square overflow-hidden rounded-xl bg-[#F3EAD7]">
          <img
            src={current}
            alt={`${name}, imagem ${selected + 1} de ${images.length}`}
            className="h-full w-full object-cover"
          />
        </div>

        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-label="Ampliar imagem"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#140D0B]/70 text-[#F5F1EB] transition-colors hover:bg-[#140D0B] ${focusRing}`}
        >
          <ZoomIn aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {/*
        <dialog> nativo: o navegador prende o foco dentro dele, fecha com Esc
        e devolve o foco ao botão de zoom (requisito de foco em diálogos).
      */}
      <dialog
        ref={dialogRef}
        aria-label={`${name}, imagem ampliada`}
        onClick={(event) => {
          // clique no fundo escuro fecha
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto max-h-[92vh] w-[min(92vw,720px)] rounded-xl bg-[#26180F] p-0 text-[#F5F1EB] backdrop:bg-black/80"
      >
        <div className="relative p-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fechar imagem ampliada"
            className={`absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#140D0B]/80 hover:bg-[#140D0B] ${focusRing}`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
          <img
            src={current}
            alt={name}
            className="max-h-[84vh] w-full rounded-lg object-contain"
          />
        </div>
      </dialog>
    </div>
  );
};

export default NftGallery;
