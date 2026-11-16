import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MotionProvider } from "@/components/motion/motion-provider";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { RouteProgress } from "@/components/motion/route-progress";
import { SiteHeaderShell } from "@/components/site-header-shell";
import { site } from "@/config/site";
import { fontVariables } from "@/config/theme";
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
      <body className={`${fontVariables} flex min-h-dvh flex-col`}>
        <MotionProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <RevealObserver />

          <a
            href="#main"
            className="absolute -top-20 left-4 z-50 rounded-sm border border-border bg-elevated px-4 py-2 text-sm focus:top-4"
          >
            Skip to content
          </a>

          <SiteHeaderShell>
            <header className="border-b border-border">
              <div className="container-page header-inner flex items-center justify-between">
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
          </SiteHeaderShell>

          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>

          <footer className="border-t border-border py-10">
            <div className="container-page text-sm text-muted">
              © {new Date().getFullYear()} {site.name}
            </div>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}
