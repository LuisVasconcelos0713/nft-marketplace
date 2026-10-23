import { articles } from "../data/articles";
import ArticleCard from "./ArticleCard";

const DiarySection = () => {
  return (
    <section className="mx-auto xl:ml-50  w-full max-w-5xl px-4 py-10 sm:px-0">
      <header className="mb-6 text-center">
        <h2 className="font-mono text-xl font-bold text-[#F5F1EB] sm:text-2xl">
          Diário da Cunhagem
        </h2>

        <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#B99665] sm:text-xs">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};
export default DiarySection;
