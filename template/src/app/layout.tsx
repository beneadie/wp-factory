import type { Metadata } from "next";
import Link from "next/link";
import { NavigationPending } from "@/components/navigation-pending";
import { site } from "@/config/site";
import { plainText } from "@/lib/html";
import { getPages, pagePath } from "@/lib/wp/pages";
import "./globals.css";

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description || undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pages = await getPages().catch(() => []);
  const nav = site.primaryNav.length
    ? site.primaryNav
    : pages
        .filter((page) => !page.parent)
        .slice(0, 6)
        .map((page) => ({
          label: plainText(page.title.rendered),
          href: pagePath(page),
        }));

  return (
    <html lang={site.locale.split("-")[0]}>
      <body className="flex min-h-dvh flex-col">
        <NavigationPending />
        <header className="border-b border-border">
          <div className="container-page flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-medium">
              {site.name}
            </Link>
            <nav aria-label="Primary" className="hidden gap-6 sm:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link-underline text-sm text-muted hover:text-text"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-10">
          <div className="container-page text-sm text-muted">
            © {new Date().getFullYear()} {site.name}
          </div>
        </footer>
      </body>
    </html>
  );
}
