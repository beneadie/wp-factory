export interface StorePrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_minor_unit: number;
  currency_symbol: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  prices: StorePrices;
  images: StoreImage[];
  is_in_stock: boolean;
  is_purchasable: boolean;
  on_sale: boolean;
  stock_availability: { text: string; class: string } | null;
  short_description: string;
  description: string;
  categories: { id: number; name: string; slug: string }[];
  average_rating: string;
  review_count: number;
}

export interface StoreCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: { id: number; src: string; alt: string } | null;
}

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
}
