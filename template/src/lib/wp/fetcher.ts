import { wpBaseUrl } from "./config";

export class WpError extends Error {
  constructor(
    message: string,
    public status: number,
    public path: string,
  ) {
    super(message);
    this.name = "WpError";
  }
}

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
  searchParams?: Record<string, string | number | undefined>;
}

export async function wpFetch<T>(
  path: string,
  { revalidate = 300, tags = [], searchParams }: FetchOptions = {},
): Promise<T> {
  const url = new URL(`${wpBaseUrl()}/wp-json${path}`);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate, tags },
  });

  if (!response.ok) {
    throw new WpError(
      `WordPress returned ${response.status} for ${path}`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}
