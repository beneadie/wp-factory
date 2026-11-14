# Commerce (parked, opt-in)

**Not part of the base build.** This holds the WooCommerce store code that used
to live in `src/`, kept so a shop can opt in later without rebuilding it.
Nothing in `src/` imports it; `tsconfig` and eslint ignore it.

```
commerce/
  app/shop/[slug]/                     product detail route
  app/product-category/[...slug]/      category archive route
  components/product-card.tsx
  components/product-grid.tsx
  lib/store.ts                         Store API client
  lib/format.ts                        price formatting
  lib/types.ts                         Store types (pristine copy)
```

## Re-enabling it

1. Copy the routes back to `src/app/shop` and `src/app/product-category`.
2. Copy the components into `src/components/`, and `lib/store.ts` +
   `lib/format.ts` into `src/lib/wp/` and `src/lib/`.
3. Merge the Store types you need into `src/lib/wp/types.ts`.
4. Add the commerce run back to `factory/phases.tsv` and its prompt.
5. Set `SITE_CURRENCY` in the site's `.env.local`.
6. Remove `commerce` from the `exclude`/`ignores` lists if you keep it in-tree.

The runner blocks sites with a Store API (`store-out-of-scope`) until this is
deliberately re-enabled.
