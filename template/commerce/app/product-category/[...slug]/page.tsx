import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { getCategoryBySlug, getProducts } from "@/lib/wp/store";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug.at(-1) ?? "");
  return { title: category?.name ?? "Shop" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug.at(-1) ?? "");

  if (!category) notFound();

  const products = await getProducts({
    category: category.id,
    perPage: 24,
  });

  return (
    <section className="container-page py-14">
      <p className="eyebrow">Category</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{category.name}</h1>
      {category.description ? (
        <div
          className="mt-4 max-w-prose text-sm text-muted"
          dangerouslySetInnerHTML={{ __html: category.description }}
        />
      ) : null}
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
