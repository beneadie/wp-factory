import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { plainText } from "@/lib/html";
import { getPageBySlug, pagePath } from "@/lib/wp/pages";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function loadPage(params: PageProps["params"]) {
  const { slug } = await params;
  const page = await getPageBySlug(slug[slug.length - 1]);
  if (!page) return null;
  // The URL must match the WordPress permalink, not just the slug.
  return pagePath(page) === `/${slug.join("/")}/` ? page : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await loadPage(params);
  if (!page) return {};
  const description = plainText(page.excerpt.rendered).slice(0, 160);
  return {
    title: plainText(page.title.rendered),
    description: description || undefined,
  };
}

export default async function WordPressPage({ params }: PageProps) {
  const page = await loadPage(params);
  if (!page) notFound();

  return (
    <article className="container-page py-16">
      <h1 className="max-w-3xl text-4xl">{plainText(page.title.rendered)}</h1>
      <div
        className="mt-8 max-w-2xl text-base leading-relaxed [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:text-xl [&_img]:mt-6 [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </article>
  );
}
