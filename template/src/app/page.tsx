import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { site } from "@/config/site";
import { getProducts } from "@/lib/wp/store";

export const revalidate = 300;

async function loadProducts() {
  try {
    return await getProducts({ perPage: 8 });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await loadProducts();

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-20">
          <p className="eyebrow">{site.name}</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">
            {site.description}
          </h1>
          <Link
            href={site.primaryNav[0].href}
            className="mt-8 inline-block text-sm link-underline"
          >
            Browse the shop
          </Link>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-2xl">Shop</h2>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
