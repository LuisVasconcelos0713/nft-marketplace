import type { Article } from "../data/articles";

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <article className="overflow-hidden rounded-md bg-[#21140F]">
      <img
        src={article.image}
        alt=""
        loading="lazy"
        className="aspect-[1.55/1] w-full object-cover"
      />

      <div className="p-3">
        <p className="font-mono text-[9px] leading-tight text-[#B99665]">
          {article.date} <span className="px-1">|</span> Leitura de{" "}
          {article.readingTime} min
        </p>

        <h3 className="mt-2 font-mono text-xs font-bold leading-snug text-[#F5F1EB]">
          {article.title}
        </h3>

        <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#B99665]">
          {article.description}
        </p>

        <a
          href={`/diario/${article.slug}`}
          className="mt-2 inline-block font-mono text-[10px] text-[#D28A4C] transition-colors hover:text-[#E5A264]"
        >
          Ler mais →
        </a>
      </div>
    </article>
  );
};

export default ArticleCard;
