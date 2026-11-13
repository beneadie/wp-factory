export function wpBaseUrl(): string {
  const base = process.env.WP_BASE_URL?.replace(/\/+$/, "");
  if (!base) {
    throw new Error("WP_BASE_URL is not set");
  }
  return base;
}
