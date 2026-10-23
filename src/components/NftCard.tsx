import { Link } from "@tanstack/react-router";
import type { NFT } from "@/lib/schemas";
import { focusRing } from "@/lib/ui";

type NftCardProps = {
  nft: NFT;
};

export default function NftCard({ nft }: NftCardProps) {
  return (
    <article className="min-w-0">
      <Link
        to="/mercado/$id"
        params={{ id: nft.id }}
        className={`group block bg-[#21140F] p-2 transition-colors hover:bg-[#302017] ${focusRing}`}
      >
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="aspect-square w-full rounded-lg object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="mt-2 min-w-0 font-mono">
        <h3 className="truncate text-[16px] text-[#F5F1EB]">{nft.name}</h3>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[15px]">
          <span className="font-bold text-[#E89B55]">{nft.priceEth} ETH</span>

          {nft.previousPriceEth && (
            <span className="line-through text-[#8f7965]">
              <span className="sr-only">Preço anterior: </span>
              {nft.previousPriceEth} ETH
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
