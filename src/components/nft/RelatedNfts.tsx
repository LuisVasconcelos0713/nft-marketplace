import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { NFT } from "@/lib/schemas";
import { focusRing } from "@/lib/ui";

type RelatedNftsProps = { items: NFT[] };

const RelatedNfts = ({ items }: RelatedNftsProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [activePage, setActivePage] = useState(0);

  // Calcula quantas "páginas" cabem e em qual o usuário está (para os pontinhos)
  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el || el.clientWidth === 0) return;
    const total = Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth));
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setPages(total);
    setActivePage(
      atEnd
        ? total - 1
        : Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)),
    );
  }, []);

  useEffect(() => {
    measure();
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, items.length]);

  const goToPage = (index: number) => {
    const el = listRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="related-title">
      <h2
        id="related-title"
        className="border-b border-[#3A2112] pb-2 text-sm font-bold text-[#CF8A4B]"
      >
        Mais desta coleção
      </h2>

      <ul
        ref={listRef}
        onScroll={measure}
        className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.id} className="w-40 shrink-0 snap-start sm:w-44">
            <Link
              to="/mercado/$id"
              params={{ id: item.id }}
              className={`block rounded-lg border border-[#3A2112] bg-[#26180F] p-3 transition-colors hover:border-[#CF8A4B] ${focusRing}`}
            >
              <div className="aspect-square overflow-hidden rounded-md bg-[#F3EAD7]">
                <img
                  src={item.image}
                  alt={`${item.name}, da coleção ${item.collection}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 truncate text-xs font-bold">{item.name}</p>
              <p className="mt-1 text-xs font-bold text-[#CF8A4B]">
                {item.priceEth} ETH
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div
          role="group"
          aria-label="Páginas do carrossel"
          className="mt-3 flex justify-center"
        >
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToPage(index)}
              aria-label={`Ir para o grupo ${index + 1} de ${pages}`}
              aria-current={index === activePage}
              className={`flex h-6 w-6 items-center justify-center rounded-full ${focusRing}`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full border border-[#CF8A4B] ${
                  index === activePage ? "bg-[#CF8A4B]" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedNfts;
