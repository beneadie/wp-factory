// Types mirror real WordPress API responses. Do not invent fields.

export interface WpRendered {
  rendered: string;
}

export interface WpPage {
  id: number;
  slug: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  date: string;
  modified: string;
  parent?: number;
}
