import type { NFT } from "../data/nfts";

type NftCardProps = {
  nft: NFT;
};

export default function NftCard({ nft }: NftCardProps) {
  return (
    <article className="min-w-0">
      <a
        href={`/mercado/${nft.id}`}
        className="group block bg-[#21140F] p-2 transition-colors hover:bg-[#302017]"
      >
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="aspect-square w-full rounded-lg object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </a>

      <div className="mt-2 min-w-0 font-mono">
        <h3 className="truncate text-[11px] text-[#F5F1EB]">{nft.name}</h3>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[11px]">
          <span className="font-bold text-[#E89B55]">
            <span>{nft.priceEth} ETH</span>
          </span>

          {nft.previousPriceEth && (
            <span className="line-through text-[#8f7965]">
              {nft.previousPriceEth} ETH
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
