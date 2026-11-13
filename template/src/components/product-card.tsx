import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/wp/types";
import { SiteImage } from "./site-image";

export function ProductCard({ product }: { product: StoreProduct }) {
  const image = product.images[0];

  return (
    <Link href={`/shop/${product.slug}/`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {image ? (
          <SiteImage
            src={image.src}
            alt={image.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
          />
        ) : null}
        {!product.is_in_stock ? (
          <span className="absolute left-3 top-3 bg-text px-2 py-1 text-xs text-bg">
            Sold out
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-sm font-medium">{product.name}</h3>
      <p className="mt-1 text-sm text-muted">
        {formatPrice(
          product.prices.price,
          product.prices.currency_minor_unit,
          product.prices.currency_code,
        )}
      </p>
    </Link>
  );
}
