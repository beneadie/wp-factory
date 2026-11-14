import { wpFetch } from "./fetcher";
import type { WpPage } from "./types";

const LIST_FIELDS = "id,slug,link,title,excerpt,parent";
const PAGE_FIELDS = "id,slug,link,title,content,excerpt,date,modified,parent";

export function getPages(): Promise<WpPage[]> {
  return wpFetch<WpPage[]>("/wp/v2/pages", {
    searchParams: {
      per_page: 100,
      _fields: LIST_FIELDS,
      orderby: "menu_order",
      order: "asc",
    },
    tags: ["pages"],
  });
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const pages = await wpFetch<WpPage[]>("/wp/v2/pages", {
    searchParams: { slug, per_page: 1, _fields: PAGE_FIELDS },
    tags: ["pages", `page-${slug}`],
  });
  return pages[0] ?? null;
}

/** The page's local path, preserving WordPress's trailing-slash style. */
export function pagePath(page: WpPage): string {
  const pathname = new URL(page.link).pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}
