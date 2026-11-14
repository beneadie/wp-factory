import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl">Page not found</h1>
      <p className="mt-4 text-sm text-muted">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="btn-outline mt-8">
        Back to the home page
      </Link>
    </section>
  );
}
