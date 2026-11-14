import Link from "next/link";
import { site } from "@/config/site";
import { plainText } from "@/lib/html";
import { getPages, pagePath } from "@/lib/wp/pages";

export const revalidate = 300;

export default async function HomePage() {
  const pages = await getPages();
  const topLevel = pages.filter((page) => !page.parent);

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-20">
          <p className="eyebrow">{site.name}</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">
            {site.description || site.name}
          </h1>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-2xl">Pages</h2>
        {topLevel.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No pages published yet.</p>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {topLevel.map((page) => (
              <li key={page.id}>
                <Link href={pagePath(page)} className="link-underline text-base">
                  {plainText(page.title.rendered)}
                </Link>
                {plainText(page.excerpt.rendered) ? (
                  <p className="mt-1 text-sm text-muted">
                    {plainText(page.excerpt.rendered)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
