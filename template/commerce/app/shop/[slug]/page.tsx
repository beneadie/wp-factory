import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteImage } from "@/components/site-image";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/wp/store";

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Product",
    description: product?.short_description.replace(/<[^>]+>/g, "").trim(),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const image = product.images[0];
  const price = formatPrice(
    product.prices.price,
    product.prices.currency_minor_unit,
    product.prices.currency_code,
  );

  return (
    <article className="container-page grid gap-10 py-14 lg:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden bg-surface">
        {image ? (
          <SiteImage
            src={image.src}
            alt={image.alt || product.name}
            className="h-full w-full object-cover"
            priority
          />
        ) : null}
      </div>

      <div className="lg:py-8">
        <h1 className="text-3xl sm:text-4xl">{product.name}</h1>
        <p className="mt-4 text-lg">{price}</p>
        <p className="mt-2 text-sm text-muted">
          {product.is_in_stock
            ? product.stock_availability?.text || "In stock"
            : product.stock_availability?.text || "Sold out"}
        </p>

        <button
          type="button"
          disabled
          title="Add to cart is wired by the catalog/cart pass"
          className="btn-primary mt-8 w-full cursor-not-allowed opacity-60 sm:w-auto"
        >
          Add to cart
        </button>

        {product.short_description ? (
          <div
            className="mt-8 max-w-prose text-sm text-muted"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        ) : null}
      </div>

      {product.description ? (
        <div className="lg:col-span-2">
          <div
            className="max-w-prose text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      ) : null}
    </article>
  );
}
