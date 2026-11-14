export function formatPrice(
  minorUnits: string | number,
  minorUnit = 2,
  currency = "EUR",
): string {
  const value = Number(minorUnits) / 10 ** minorUnit;
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
  }).format(value);
}
