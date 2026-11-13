import { wpFetch } from "./fetcher";
import type { StoreCategory, StoreProduct, WpPage } from "./types";

interface ProductQuery {
  page?: number;
  perPage?: number;
  category?: number | string;
  search?: string;
  orderby?: string;
}

export function getProducts({
  page = 1,
  perPage = 12,
  category,
  search,
  orderby,
}: ProductQuery = {}): Promise<StoreProduct[]> {
  return wpFetch<StoreProduct[]>("/wc/store/v1/products", {
    searchParams: {
      page,
      per_page: perPage,
      category,
      search,
      orderby,
    },
    tags: ["products"],
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  const products = await wpFetch<StoreProduct[]>("/wc/store/v1/products", {
    searchParams: { slug, per_page: 1 },
    tags: ["products", `product-${slug}`],
  });
  return products[0] ?? null;
}

export function getCategories(): Promise<StoreCategory[]> {
  return wpFetch<StoreCategory[]>("/wc/store/v1/products/categories", {
    searchParams: { per_page: 100 },
    tags: ["categories"],
  });
}

export async function getCategoryBySlug(
  slug: string,
): Promise<StoreCategory | null> {
  const categories = await wpFetch<StoreCategory[]>(
    "/wc/store/v1/products/categories",
    {
      searchParams: { slug, per_page: 1 },
      tags: ["categories"],
    },
  );
  return categories[0] ?? null;
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const pages = await wpFetch<WpPage[]>("/wp/v2/pages", {
    searchParams: { slug, per_page: 1 },
    tags: ["pages", `page-${slug}`],
  });
  return pages[0] ?? null;
}
