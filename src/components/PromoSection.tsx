import CardPromo from "./CardPromo";

const PromoSection = () => {
  return (
    <section className="mx-auto pb-12 flex w-full max-w-5xl flex-wrap items-stretch justify-center gap-4 px-4 py-6 sm:px-0">
      <CardPromo
        titulo="Lançamentos gênesis de edição limitada"
        descricao="Colecione edições escassas diretamente dos criadores antes da revelação pública."
        imagem="/images/2986a7cb16d09de8970824d2dd58bf0bb021702c%20(3).png"
      />

      <CardPromo
        titulo="Arte digital selecionada e muito mais"
        descricao="Explore novos artistas, coleções verificadas e obras digitais que definem tendências."
        imagem="/images/9df2ff42dd27ba657621c304557d1a855a4be6a5%20(2).png"
      />
    </section>
  );
};

export default PromoSection;
