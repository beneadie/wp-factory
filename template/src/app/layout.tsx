import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.locale.split("-")[0]}>
      <body className="flex min-h-dvh flex-col">
        <header className="border-b border-border">
          <div className="container-page flex h-16 items-center justify-between">
            <Link href="/" className="font-serif text-lg">
              {site.name}
            </Link>
            <nav aria-label="Primary" className="hidden gap-6 sm:flex">
              {site.primaryNav.map((item) => (
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
